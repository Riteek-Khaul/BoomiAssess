import React from 'react';
import './Modal.css';

const Modal = ({ showModal, handleClose,customData  }) => {

    const Migrate =()=>{
      alert("Process Migrated Successfully!")
      handleClose()
    }

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Migrating :{customData.title} </h2>
              <button className="close-button" onClick={handleClose}>&times;</button>
            </div>
            <div className="modal-content">
                <p>
                <span>Used Shapes / Connectors (Boomi) |</span>  <span>CPI Alternatives </span>
                </p>
                <p>
                <span>REST |</span>  <span>HTTP </span>
                </p>
                <p>
                <span>SFTP |</span>  <span>SFTP</span>
                </p>
            </div>
            <p>Note : Resources like Message mappings/User Credentials/certificates are not directly migrted in this process, need manual intervension.</p>
            <div className="modal-footer">
              <button onClick={handleClose} id='cancelbtn'>Cancel</button>
              <button onClick={Migrate}>Migrate</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
