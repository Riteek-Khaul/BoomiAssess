import React from 'react';
import { useNavigate } from 'react-router-dom';

const Help = () => {

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <button onClick={goToHome}>Home</button>
      <h1>Help Documentation</h1>
      <p>
        This tool leverages Boomi's Atmosphere APIs internally to retrieve details about processes and their configurations. Below is a list of all the APIs used for extracting process information and configurations from Boomi Atmosphere.
      </p>

      <h2>Atmosphere API Details</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Method Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>URI Endpoint</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>HTTP Method</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credentials Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Get All Processes</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>https://api.boomi.com/api/rest/v1/accountId/Process/query</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>POST</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Username / Password</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Get Process Configuration details</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>https://api.boomi.com/api/rest/v1/accountId/Component/componentId/export</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>GET</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Username / Password</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Get Components Details ( mappings/connectors/profiles etc.)</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>https://api.boomi.com/api/rest/v1/accountId/Component/componentId</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>GET</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Username / Password</td>
          </tr>
        </tbody>
      </table>

      <h3>Authentication</h3>
      <p>
        All API calls requires User / Password for authentication.
      </p>
      <pre style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
        <code>
          Authorization: Basic ( user/pass )
        </code>
      </pre>
      <p>For additional details, refer to the Boomi Atmosphere API documentation.</p>
    </div>
  );
};

export default Help;
