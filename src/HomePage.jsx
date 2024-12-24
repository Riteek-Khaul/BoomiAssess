import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import AuthModal from './AuthModal';

Chart.register(...registerables);


function HomePage() {
  const [showExtractPage, setShowExtractPage] = useState(true);
  const [showEvaluatePage, setShowEvaluatePage] = useState(false);
  const [showMigratePage, setShowMigratePage] = useState(false);
  const [file, setFile] = useState(null);
  const [boomiaccountId, setBoomiAccountId] = useState('');
  const [boomiUsername, setBoomiUsername] = useState('');
  const [processes, setProcesses] = useState({ type: 'QueryResult', numberOfResults: 0, result: [] });
  const [selectedProcess, setSelectedProcess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [SpecificProcess, setSpecificProcess] = useState();
  const [Auth, setAuth] = useState(() => {
    // Initialize Auth state from local storage if available
    const savedAuth = localStorage.getItem('Auth');
    return savedAuth ? JSON.parse(savedAuth) : true;
  });

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSpecificProcess(null); // Reset SpecificProcess state when closing modal
  };

  const navigate = useNavigate();

  const goToHelp = () => {
    navigate('/help');
  };

  const showPage = (page) => {
    setShowExtractPage(page === 'extractPage');
    setShowEvaluatePage(page === 'evaluatePage');
    setShowMigratePage(page === 'migratePage');
  };

  const handleAccountIdChange = (event) => {
    setBoomiAccountId(event.target.value);
  };

  const handleBoomiUsernameChange = (event) => {
    setBoomiUsername(event.target.value);
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
    if (boomiaccountId && boomiUsername) {
      alert(`Extracting data for Account ID: ${boomiaccountId}`);
      try {
        const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/extractprocessmetadata';
        const response = await axios.get(url, {
          params: {
            boomiaccountId: boomiaccountId,
            boomiUsername: boomiUsername
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

  const makeEvaluateRequest = async (csvData,SubProcessResult) => {
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
      const pdfContent = [parts[0], parts[1],SubProcessResult].join('\n');
      //   console.log("Getting your files ready to download!");

      await getPDF(pdfContent);
      //generatePDF(pdfContent);

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
        const SubProcessResult = CalculateSubProcesses(result);
        console.log(SubProcessResult)
        await makeEvaluateRequest(result,SubProcessResult);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a file to evaluate.');
    }
  };

  const CalculateSubProcesses =(csvInput) => {

    // Step 1: Split the CSV input into lines
    const lines = csvInput.trim().split("\n");

    // Step 2: Initialize arrays to store component IDs and subprocess IDs
    const componentIds = [];
    const subprocessIds = [];

    // Step 3: Parse each line
    lines.forEach((line) => {
      const columns = line.split(","); // Split the line into columns

      // Extract the first column (componentId) as total processes
      if (columns.length > 0) {
        const componentId = columns[0].trim();
        if (componentId) {
          componentIds.push(componentId); // Add to component IDs list
        }
      }

      // Extract processId from processcall section (if present)
      if (line.includes("processcall")) {
        const processcallSection = line.match(/processcall:\[.*?\]/); // Extract processcall section
        if (processcallSection) {
          const processIdMatch = processcallSection[0].match(/@processId:([^\s,]+)/); // Extract processId
          if (processIdMatch) {
            const processId = processIdMatch[1].trim();
            subprocessIds.push(processId);
          }
        }
      }
    });

    // Step 4: Calculate totals
    const uniqueComponentIds = [...new Set(componentIds)]; // Unique component IDs
    const uniqueSubprocessIds = [...new Set(subprocessIds)]; // Unique subprocess IDs
    console.log(uniqueComponentIds.length)
    const totalProcesses = uniqueComponentIds.length-1;
    const totalSubprocesses = uniqueSubprocessIds.length;
    const remainingProcesses = totalProcesses - totalSubprocesses;

    // Step 5: Construct the CSV result
    const csvResult = `
   Total Processes,Main Processes,Sub-Processes
   ${totalProcesses},${remainingProcesses},${totalSubprocesses}`.trim();
   return csvResult;

  }

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

  const parseCSV = (csvString) => {
    const rows = csvString.trim().split('\n');
    return rows.slice(1).map(row => row.split(','));
  };

  const generatePDF = async (pdfContent) => {
    const doc = new jsPDF();

    // Split the data into two parts: shape data and category data
    const [csvShapeData, csvCategoryData] = pdfContent.split('\n\n');

    // Parse CSV data
    const shapeData = parseCSV(csvShapeData);
    const categoryData = parseCSV(csvCategoryData);

    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Move From Boomi to SAP Integration Suite", 10, 10);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.text("Migration Assessment Report", 10, 20);

    // Info
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`System: Dev\nDate of Report: ${currentDate}`, 10, 30);

    // Agenda
    doc.setTextColor(0, 0, 0);
    doc.text("Contents\n \nIntroduction\nMigration Assessment\nAssessment Categories\nScenario Categorization Summary\nAdapter Type Summary\n", 10, 40);

    // Introduction
    doc.setFontSize(14);
    doc.text("Introduction", 10, 80);
    doc.setFontSize(12);
    const introductionText = "By introducing the SAP Business Technology Platform (BTP), the integration topic has moved to a new stage. Certainly, there is an infrastructure change running cloud-based services and solutions. This means that administration and operational tasks may differ. The innovative technology also impacts the SAP Integration Suite design and runtime. Nested as a service on SAP BTP, SAP Integration Suite runs in SAP BTP, Cloud Foundry environment. This foundation is an open-source platform as a service (PaaS). It is designed to be configured, deployed, managed, scaled, and upgraded on any cloud Infrastructure as a Service (IaaS) provider. Please be aware of what features the Cloud Foundry environment on SAP BTP supports and doesn't support. However, the intention of SAP Integration Suite is to connect and automate processes and data efficiently across the heterogeneous IT landscape and business network by providing comprehensive integration capabilities and best practices to accelerate and modernize integration.";
    const introductionLines = doc.splitTextToSize(introductionText, 180);
    doc.text(introductionLines, 10, 90);

    // Migration Assessment
    doc.setFontSize(14);
    doc.text("Migration Assessment", 10, 160);

    // Assessment Categories
    doc.setFontSize(12);
    doc.text("Assessment Categories", 10, 170);
    doc.setTextColor(0, 128, 0);
    doc.text("• Ready to migrate: ", 10, 180);
    doc.setTextColor(0, 0, 0);
    const readyText = "These Boomi processes match to the SAP Integration Suite. They can be moved manually to the SAP Integration Suite. The move might include additional steps within SAP Integration Suite to configure this scenario properly.";
    const readyLines = doc.splitTextToSize(readyText, 180);
    doc.text(readyLines, 10, 185);

    doc.setTextColor(0, 0, 255);
    doc.text("• Adjustment required: ", 10, 205);
    doc.setTextColor(0, 0, 0);
    const adjustmentText = "These Boomi processes partially match to the scenarios offered in SAP Integration Suite. They can be moved to SAP Integration Suite manually. Further adjustments to the end-to-end integration process based on best practices are required.";
    const adjustmentLines = doc.splitTextToSize(adjustmentText, 180);
    doc.text(adjustmentLines, 10, 210);

    doc.setTextColor(255, 0, 0);
    doc.text("• Evaluation required: ", 10, 230);
    doc.setTextColor(0, 0, 0);
    const evaluationText = "For these Boomi processes, some items require further evaluation before the scenario can be moved to SAP Integration Suite.";
    const evaluationLines = doc.splitTextToSize(evaluationText, 180);
    doc.text(evaluationLines, 10, 235);

    // Scenario Categorization Summary
    doc.setFontSize(14);
    doc.text("Scenario Categorization Summary:", 10, 255);

    // Add a new page for the pie chart
    doc.addPage();

    // Create Pie Chart
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categoryData.map(row => row[0]),
        datasets: [{
          data: categoryData.map(row => parseFloat(row[2])),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A'],
        }],
      },
      options: {
        responsive: false,
        animation: false
      }
    });

    // Append the canvas to the document for rendering
    document.body.appendChild(canvas);

    // Ensure the chart is fully rendered
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvasImage = await html2canvas(canvas, { useCORS: true });
    const imgData = canvasImage.toDataURL('image/png');

    // Remove the canvas from the document
    document.body.removeChild(canvas);

    doc.addImage(imgData, 'PNG', 10, 20, 180, 80); // Adjust the position and size as needed

    // Scenario Categorization Table
    doc.autoTable({
      head: [['Current Status', 'Integration Scenarios', '% of Total Scenarios']],
      body: categoryData.map(row => [row[0], row[1], row[2]]),
      startY: 110,
      theme: 'striped',
      headStyles: { fillColor: [100, 100, 255] },
    });

    // Summary Paragraph
    const summaryText = `\n Based on our migration assessment:\n• ${categoryData[0][2]} of the Boomi processes reviewed from your current Boomi Account can be moved manually to the SAP Integration Suite.\n• ${categoryData[1][2]} of the Boomi processes reviewed from your Boomi Account can be moved manually with some adjustments.\n• ${categoryData[2][2]} of the interfaces should be further analyzed and re-evaluated prior to the move to SAP Integration Suite.\n`;
    const summaryLines = doc.splitTextToSize(summaryText, 180);
    doc.text(summaryLines, 10, doc.previousAutoTable.finalY + 10);

    // Adapter Type Summary
    doc.setFontSize(14);
    doc.text("Adapter/Connector/Shape Type Summary:", 10, doc.previousAutoTable.finalY + 60);

    // Adapter Type Table
    doc.autoTable({
      head: [['Type', 'Count']],
      body: shapeData.map(row => [row[0], row[1]]),
      startY: doc.previousAutoTable.finalY + 70,
      theme: 'striped',
      headStyles: { fillColor: [100, 100, 255] },
    });

    // Thank You
    doc.setFontSize(12);
    doc.setTextColor(255, 165, 0);
    const thankYouText = "Thank you!";
    const textWidth = doc.getTextWidth(thankYouText);
    const pageWidth = doc.internal.pageSize.getWidth();
    const centeredX = (pageWidth - textWidth) / 2;
    doc.text(thankYouText, centeredX, doc.previousAutoTable.finalY + 70);

    // Save the PDF
    doc.save('Result.pdf');
  };


  const handleFileInput = (event) => {
    setFile(event.target.files[0]);
  };

  const getProcesses = async () => {
    if (boomiaccountId && boomiUsername) {
      alert(`Fetching processes for Account ID: ${boomiaccountId}`);
      try {
        const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getallprocesses';
        const response = await axios.get(url, {
          params: {
            boomiaccountId: boomiaccountId,
            boomiUsername: boomiUsername
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
      alert(`Fetching Metadata for Process ID: ${selectedProcess}`);
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
        <button id="migrateButton" onClick={goToHelp}>
          Help
        </button>
      </div>


      <div id="heading" className="heading">
        <h1>BoomiAsses by <img src="logo.png" alt="Company Logo" className="logo" /></h1>
      </div>

      {showExtractPage && (
        <div id="extractPage" className="page">
          <h2>Extract Processes Metadata</h2>
          <label for="boomiAccountId">Boomi Account ID:</label>
          <input
            type="text"
            id="boomiAccountId"
            placeholder="Enter Boomi Account ID"
            value={boomiaccountId}
            onChange={handleAccountIdChange} />
          <label htmlFor="boomiUsername">Username</label>
          <input
            type="text"
            id="boomiUsername"
            placeholder="Enter Boomi Username"
            value={boomiUsername}
            onChange={handleBoomiUsernameChange}
          />
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
                <label htmlFor="boomiUsername">Username</label>
                <input
                  type="text"
                  id="boomiUsername"
                  placeholder="Enter Boomi Username"
                  value={boomiUsername}
                  onChange={handleBoomiUsernameChange}
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
                {
                  SpecificProcess && (
                    <Modal
                      showModal={showModal}
                      handleClose={closeModal}
                      SpecificProcess={SpecificProcess}
                      boomiaccountId={boomiaccountId}
                      selectedProcess={selectedProcess}
                    />
                  )
                }
              </div>
            )}
          </div>
        )
      }

      <div id="note" className="note">
        <p>
          <strong>Note:</strong> Account user credentials need to be set up manually in CPI-Security material before running the tool for a specific account.
        </p>
      </div>
      {Auth && (<AuthModal setAuth={setAuth} />)}
      <footer>
        <p>
          Developed and Maintained by Crave Infotech (for any support: riteek.khaul@craveinfotech.com)
        </p>
      </footer>
    </div>
  );
}

export default HomePage;

