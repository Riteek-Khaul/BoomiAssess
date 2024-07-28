import React, { useState } from "react";

const AuthModal = ({setAuth}) => {
  const [secretCode, setSecretCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const encodeBase64 = (str) => {
    return btoa(str);
  };

  const verifySecretCode = () => {
    const encodedSecretCode = "VGhhbm9zQDM2OQ=="; // Replace with your actual encoded secret code
    const encodedInput = encodeBase64(secretCode);

    if (encodedInput === encodedSecretCode) {
      setMessage("Access Granted");
      setMessageColor("green");
      // Update local storage whenever Auth state changes
      localStorage.setItem('Auth', JSON.stringify(false));
      setAuth(false)
    } else {
      setMessage("Access Denied");
      setMessageColor("red");
    }
  };

  const handleChange = (e) => {
    setSecretCode(e.target.value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div>
          <div style={styles.container}>
            <div style={styles.loginContainer}>
              <h2>Enter Secret Code</h2>
              <input
                type="password"
                value={secretCode}
                onChange={handleChange}
                placeholder="Enter Secret Code"
                style={styles.input}
              />
              <button onClick={verifySecretCode} style={styles.button}>
                Submit
              </button>
              {message && (
                <p style={{ ...styles.message, color: messageColor }}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;


const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    loginContainer: {
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    input: {
      padding: '10px',
      marginBottom: '10px',
      width: '100%',
      boxSizing: 'border-box',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    message: {
      marginTop: '10px',
      fontWeight: 'bold',
    },
  };