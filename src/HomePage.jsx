import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';


function HomePage(){
  const [showExtractPage, setShowExtractPage] = useState(true);
  const [showEvaluatePage, setShowEvaluatePage] = useState(false);
  const [showMigratePage, setShowMigratePage] = useState(false);
  const [file, setFile] = useState(null);
  const [boomiaccountId, setBoomiAccountId] = useState('');
  const [processes, setProcesses] = useState({ type: 'QueryResult', numberOfResults: 0, result: [] });
  const [selectedProcess, setSelectedProcess] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [SpecificProcess, setSpecificProcess] = useState();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const navigate = useNavigate();

  const showPage = (page) => {
    setShowExtractPage(page === 'extractPage');
    setShowEvaluatePage(page === 'evaluatePage');
    setShowMigratePage(page === 'migratePage');
  };

  const handleAccountIdChange = (event) => {
    setBoomiAccountId(event.target.value);
  };

  const downloadCSV = (filename, csvData) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const extract = async () => {
    if (boomiaccountId) {
      alert(`Extracting data for Account ID: ${boomiaccountId}`);
      try {
        const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/extractprocessmetadata';
        const response = await axios.get(url, {
          params: {
            boomiaccountId: boomiaccountId
          },
          headers: {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain',
            'X-Requested-With': 'XMLHttpRequest',
          },
          responseType: 'text',
        });
        downloadCSV('response_data.csv', response.data);
        navigate('/success', { state: { message: 'Data extracted successfully!' } });
      } catch (error) {
        console.error('Error making authenticated request:', error);
        alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
      }
    } else {
      alert('Please enter Boomi Account ID.');
    }
  };

  const makeEvaluateRequest = async (csvData) => {
    try {
      const url = "https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/evaluateprocessmetadata";
      const response = await axios.post(url, csvData, {
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'text/plain',
          'X-Requested-With': 'XMLHttpRequest',
        },
        responseType: 'text',
      });

      const parts = response.data.split(/\n\s*\n/);
      const pdfContent = [parts[0], parts[1]].join('\n');
    //   alert("Getting your files ready to download!");

      await getPDF(pdfContent);

      const part2Csv = parts[2].split('\n').map(line => line.trim()).join('\n');
      downloadCSV('MainResult.csv', part2Csv);

      const part3Csv = parts[3].split('\n').map(line => line.trim()).join('\n');
      downloadCSV('FullEvaluationResult.csv', part3Csv);

      navigate('/success');
    } catch (error) {
      console.log('Error making evaluate request:', error);
      alert("Something Went wrong!...Please review the uploaded file or contact support!")
    }
  };

  const startEvaluate = async () => {

    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        const data = fileContent.split('\n');
        const result = data.map(row => row.split(',').join(',')).join('\n');
        await makeEvaluateRequest(result);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a file to evaluate.');
    }
  };

  

  const getPDF = async (pdfContent) => {
    try {
      const url = "https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/makeresultpdf";
      const response = await axios.post(url, pdfContent, {
        headers: {
          'Accept': 'application/pdf',
          'Content-Type': 'text/plain',
          'X-Requested-With': 'XMLHttpRequest',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', 'Result.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log('Error making PDF request:', error);
      alert("Something Went wrong!...Please review the uploaded file or contact support!")
    }
  };

  const handleFileInput = (event) => {
    setFile(event.target.files[0]);
  };

  const getProcesses = async () => {
    if (boomiaccountId) { 
      alert(`Fetching processes for Account ID: ${boomiaccountId}`);
      try {
        const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getallprocesses';
        const response = await axios.get(url, {
          params: {
            boomiaccountId: boomiaccountId
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',

          },
        });
        setProcesses(response.data);
      } catch (error) {
        console.error('Error fetching processes:', error);
        alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
      }
    } else {
      alert('Please enter Boomi Account ID.');
    }
  };

  const Next = async () => {
    if (selectedProcess) {
      alert(`Fetching processes for Process ID: ${selectedProcess}`);
      try {
        const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getspecificprocess';
        const response = await axios.get(url, {
          params: {
            boomiaccountId: boomiaccountId,
            selectedProcess: selectedProcess
          },
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        setSpecificProcess(response.data);
        openModal();
      } catch (error) {
        console.error('Error fetching processes:', error);
        alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
      }
    } else {
      alert('Please enter Boomi Account ID.');
    }
  };

  const handleProcessChange = (event) => {
    setSelectedProcess(event.target.value);
  };

  console.log(selectedProcess)
//  console.log(processes)
  console.log(SpecificProcess)


  return (
    <div className="App">
      <div id="navbar">
        <button id="extractButton" onClick={() => showPage('extractPage')}>
          Extract
        </button>
        <button id="evaluateButton" onClick={() => showPage('evaluatePage')}>
          Evaluate
        </button>
        <button id="migrateButton" onClick={() => showPage('migratePage')}>
          Migrate
        </button>
      </div>


      <div id="heading" className="heading">
        <h1>BoomiAsses by <img src="logo.png" alt="Company Logo" className="logo" /></h1>
      </div>

      {showExtractPage && (
        <div id="extractPage" className="page">
          <h2>Extract Processes Metadata</h2>
          <label for="boomiAccountId">Boomi Account ID:</label>
          <input type="text" id="boomiAccountId" placeholder="Enter Boomi Account ID"  value={boomiaccountId} onChange={handleAccountIdChange} />
          <button onClick={extract}>Extract</button>
        </div>
      )}

      {showEvaluatePage && (
        <div id="evaluatePage" className="page">
          <h2>Evaluate Processes Metadata</h2>
          <input type="file" onChange={handleFileInput} />
          {file && (
          <div>
            <p>Selected File: {file.name}</p>
            <p>File Type: {file.type}</p>
            <p>File Size: {file.size} bytes</p>
          </div>
         )}
          <button onClick={startEvaluate}>Start Evaluation</button>
          <button id="reportbtn" style={{ display: 'none' }}>
            Download Reports
          </button>
        </div>
      )}

{
  showMigratePage && (
    <div id="migratePage" className="page">
      <h2>Migrate Processes</h2>
      {processes.result.length === 0 ? (
        <>
          <label htmlFor="boomiAccountId">Boomi Account ID:</label>
          <input
            type="text"
            id="boomiAccountId"
            placeholder="Enter Boomi Account ID"
            value={boomiaccountId}
            onChange={handleAccountIdChange}
          />
          <button onClick={getProcesses}>Fetch All Processes</button>
        </>
      ) : (
        <div>
          <label htmlFor="processSelect">Select Process: ( Total : {processes.numberOfResults} )</label>
          <select
            id="processSelect"
            value={selectedProcess}
            onChange={handleProcessChange}
          >
            <option value="">--Select a process--</option>
            {processes.result.map((process, index) => (
              <option key={index} value={process.id}>
                {process.name}
              </option>
            ))}
          </select>
          <button onClick={Next}>Next</button>
          <Modal
            showModal={showModal}
            handleClose={closeModal}
            SpecificProcess={SpecificProcess}
          />
        </div>
      )}
    </div>
  )
}

      <div id="note" className="note">
        <p>
          <strong>Note:</strong> Account user credentials need to be set up manually before running the tool for a specific account.
        </p>
      </div>

      <footer>
        <p>
          Developed and Maintained by Crave Infotech (for any support: riteek.khaul@craveinfotech.com)
        </p>
      </footer>
    </div>
  );
}

export default HomePage;

