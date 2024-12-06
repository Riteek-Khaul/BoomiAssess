import React, { useState } from "react";
import "./MigrateToCI.css"; // External CSS file for styling

function MigrateToCI() {
  const [formData, setFormData] = useState({
    iflowName: "",
    iflowId: "",
    packageId: "",
    cpiHostName: "",
    accessTokenUri: "",
    clientId: "",
    clientSecret: "",
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitFormData =async(e) =>{
    e.preventDefault();

    const apiUrl = "http://localhost:5000/migrate"; // Replace with the actual API endpoint
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("API Response:", responseData);
        return { success: true, message: "Form submitted successfully!" };
        setPopupMessage("Migrated successfully!");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        return { success: false, message: errorData.message || "Form submission failed." };
        setPopupMessage("Migration failed. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      return { success: false, message: "An error occurred while submitting the form." };
    }
  }

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="app-container">
      <h1>CPI Configuration Form</h1>
      <form className="form-container" onSubmit={submitFormData}>
        <label>
          IFlow Name:
          <input
            type="text"
            name="iflowName"
            value={formData.iflowName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          IFlow ID:
          <input
            type="text"
            name="iflowId"
            value={formData.iflowId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Package ID:
          <input
            type="text"
            name="packageId"
            value={formData.packageId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          CPI Host Name:
          <input
            type="text"
            name="cpiHostName"
            value={formData.cpiHostName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Access Token URI:
          <input
            type="text"
            name="accessTokenUri"
            value={formData.accessTokenUri}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Client ID:
          <input
            type="text"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Client Secret:
          <input
            type="password"
            name="clientSecret"
            value={formData.clientSecret}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {/* Popup for success or failure message */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MigrateToCI;
