import React, { useState, useEffect } from "react";
import "./Modal.css";

const Modal = ({ showModal, handleClose, customData, SpecificProcess }) => {


  const [firstPart, setFirstPart] = useState([]);
  const [secondPart, setSecondPart] = useState([]);


  const Migrate = () => {
    alert("Process Migrated Successfully!");
    handleClose();
  };

  useEffect(() => { 

    const parts = SpecificProcess.split('\n\n');
    const firstPartData = parts[0].split('\n').map(line => line.split(','));
    const secondPartData = parts[1].split('\n').map(line => line.split(','));

    setFirstPart(firstPartData);
    setSecondPart(secondPartData);
   }, []);

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Migrating : {secondPart[1][1]} </h3>
              <button className="close-button" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <p>
                <span>Used Shapes / Connectors (Boomi) |</span>{" "}
                <span>CPI Alternatives </span>
              </p>

              <table border="1">
                <thead>
                  <tr>
                    {firstPart[0] &&
                      firstPart[0].map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {firstPart.slice(1).map((row, index) => (
                    <tr key={index}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
            <p>
              Note : Resources like Message mappings/User
              Credentials/certificates are not directly migrted in this process,
              need manual intervension.
            </p>
            <div className="modal-footer">
              <button onClick={handleClose} id="cancelbtn">
                Cancel
              </button>
              <button onClick={Migrate}>Migrate</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
