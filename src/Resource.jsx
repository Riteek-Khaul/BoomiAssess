import React, { useState } from "react";
import "./Resource.css";
import { useNavigate } from 'react-router-dom';

const ResourceDownloader = () => {
  const [currentTab, setCurrentTab] = useState("messageMapping");
  const [resourceIds, setResourceIds] = useState({
    messageMapping: "",
    udf: "",
    scripts: "",
    crt: "",
    profiles: "",
  });

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResourceIds((prevIds) => ({
      ...prevIds,
      [name]: value,
    }));
  };

  const handleDownload = (resourceType) => {
    const id = resourceIds[resourceType];
    if (id) {
      // Logic to download the resource based on id
      // Replace this with actual download logic
      alert(`Downloading ${resourceType} with ID: ${id}`);
    } else {
      alert(`Please enter an ID for ${resourceType}`);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "messageMapping":
        return (
          <div className="tab-content">
            <h3>Message Mapping</h3>
            <input
              type="text"
              name="messageMapping"
              placeholder="Enter Message Mapping ID"
              value={resourceIds.messageMapping}
              onChange={handleInputChange}
            />
            <button onClick={() => handleDownload("messageMapping")}>
              Download
            </button>
          </div>
        );
      case "udf":
        return (
          <div className="tab-content">
            <h3>UDF</h3>
            <input
              type="text"
              name="udf"
              placeholder="Enter UDF ID"
              value={resourceIds.udf}
              onChange={handleInputChange}
            />
            <button onClick={() => handleDownload("udf")}>Download</button>
          </div>
        );
      case "scripts":
        return (
          <div className="tab-content">
            <h3>Scripts</h3>
            <input
              type="text"
              name="scripts"
              placeholder="Enter Process ID"
              value={resourceIds.scripts}
              onChange={handleInputChange}
            />
            <button onClick={() => handleDownload("scripts")}>Download</button>
          </div>
        );
      case "crt":
        return (
          <div className="tab-content">
            <h3>CRT (Lookups)</h3>
            <input
              type="text"
              name="crt"
              placeholder="Enter CRT ID"
              value={resourceIds.crt}
              onChange={handleInputChange}
            />
            <button onClick={() => handleDownload("crt")}>Download</button>
          </div>
        );
      case "profiles":
        return (
          <div className="tab-content">
            <h3>Profiles (S/T)</h3>
            <input
              type="text"
              name="profiles"
              placeholder="Enter Profiles ID"
              value={resourceIds.profiles}
              onChange={handleInputChange}
            />
            <button onClick={() => handleDownload("profiles")}>Download</button>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="resource-downloader">
        <button onClick={goToHome}>Home</button>
      <h2>Resource Downloader</h2>
      <div className="tabs-navigation">
        <button onClick={() => setCurrentTab("messageMapping")}>
          Message Mapping
        </button>
        <button onClick={() => setCurrentTab("udf")}>UDF</button>
        <button onClick={() => setCurrentTab("scripts")}>Scripts</button>
        <button onClick={() => setCurrentTab("crt")}>CRT (Lookups)</button>
        <button onClick={() => setCurrentTab("profiles")}>
          Profiles (S/T)
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default ResourceDownloader;
