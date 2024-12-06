const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON body
app.use(bodyParser.json());

// Route to handle form submission
app.post("/migrate", async (req, res) => {
  const {
    iflowName,
    iflowId,
    packageId,
    artifactContent,
    cpiHostName,
    accessTokenUri,
    clientId,
    clientSecret,
  } = req.body;

  console.log(req.body)

  // Validate required fields
  if (
    !iflowName ||
    !iflowId ||
    !packageId ||
    !artifactContent ||
    !cpiHostName ||
    !accessTokenUri ||
    !clientId ||
    !clientSecret
  ) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required. Please provide valid data.",
    });
  }

  try {
    // Step 1: Get OAuth 2.0 token
    const tokenResponse = await axios.post(
      accessTokenUri,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const apiUrl = `https://${cpiHostName}/api/v1/IntegrationDesigntimeArtifacts`; // Replace with the actual endpoint
    const apiResponse = await axios.post(
      apiUrl,
      {
       "Name":iflowName,
       "Id": iflowId,
       "PackageId":packageId,
       "ArtifactContent":artifactContent,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 3: Send the API response back to the client
    res.status(200).json({
      status: "success",
      message: "Data successfully migrated to the target service.",
      data: apiResponse.data,
    });
  } catch (error) {
    console.error("Error during migration:", error.message);

    // Handle errors (e.g., OAuth or API request failures)
    res.status(500).json({
      status: "error",
      message: "An error occurred during the migration process.",
      error: error.response?.data || error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
