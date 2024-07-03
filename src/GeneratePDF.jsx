import React,{useState} from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import axios from 'axios';
import {HTTP_Receiver,FTP_Sender,SFTP_Receiver,SFTP_Sender,MAIL_Receiver,Test} from './utils';
import {SourceXML} from  './CPISourceXML'
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

Chart.register(...registerables);

const GeneratePDF = () => {

  const [boomiaccountId, setBoomiAccountId] = useState('craveinfotech-93BT0P');
  const [selectedProcess, setSelectedProcess] = useState('56de4dbd-bdb0-4a49-bff8-aeed71857347');
  const [connectorDetails,setConnectorDetails] = useState('');
  const [updatedConnectorDetails, setUpdatedConnectorDetails] = useState({
    sender: "",
    receiver: ""
  });

  const parseCSV = (csvString) => {
    const rows = csvString.trim().split('\n');
    return rows.slice(1).map(row => row.split(','));
  };

  const classifyConnectorData = () => {
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    };

    const senderType = "ftp";
    const receiverType = "http";

    const parser = new XMLParser(options);
    const builder = new XMLBuilder(options);

    // Parse XML to JSON
    let jsonObjectConnectorData = parser.parse(connectorDetails);

    // Extract components
    const components = jsonObjectConnectorData['multimap:Messages']['multimap:Message1']['bns:Component'];

    let newUpdatedConnectorDetails = {
      sender: "",
      receiver: ""
    };

    components.forEach(element => {
      const elementXml = builder.build({ 'bns:Component': element });
      if (element['@_subType'] === senderType) {
        newUpdatedConnectorDetails.sender += elementXml;
      } else if (element['@_subType'] === receiverType) {
        newUpdatedConnectorDetails.receiver += elementXml;
      }
    });
    setUpdatedConnectorDetails(newUpdatedConnectorDetails);
  };


  const targetConnectorsData = `<bns:Component
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:bns="http://api.platform.boomi.com/" folderFullPath="Crave Infotech" componentId="b1243733-85bb-4459-9833-31bf6a745f4d" version="5" name="Crave FTP Connection" type="connector-settings" subType="ftp" createdDate="2024-06-13T18:39:44Z" createdBy="ankur.thakre@craveinfotech.com" modifiedDate="2024-06-14T06:22:22Z" modifiedBy="ankur.thakre@craveinfotech.com" deleted="false" currentVersion folderName="Crave Infotech" folderId="Rjo2NzkyMjE5" branchName="main" branchId="Qjo0MjkzNTI">
	<bns:encryptedValues>
		<bns:encryptedValue path="//FTPSettings/AuthSettings/@password" isSet></bns:encryptedValue>
	</bns:encryptedValues>
	<bns:description></bns:description>
	<bns:object>
		<FTPSettings
			xmlns="" connectionMode="passive" host="us232.siteground.us" port="21">
			<AuthSettings password="407876da24a40fb333ad89528f71f75d6ab2f2f5860308f5dba32848bd2aa2754d9ec3d9b89255839009447bf3c5d7aa89f044c6bdcabc629fd0666dc1b4be34" user="integration@craveinfotech.com"></AuthSettings>
			<SSLOptions clientauth="false" sslmode="none"></SSLOptions>
		</FTPSettings>
	</bns:object>
</bns:Component>
<bns:Component
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:bns="http://api.platform.boomi.com/" folderFullPath="Crave Infotech" componentId="28cb16ff-219c-437f-9bd5-52a3316310a5" version="9" name="Crave FTP Connector Operation" type="connector-action" subType="ftp" createdDate="2024-06-13T18:42:27Z" createdBy="ankur.thakre@craveinfotech.com" modifiedDate="2024-06-14T06:23:31Z" modifiedBy="ankur.thakre@craveinfotech.com" deleted="false" currentVersion folderName="Crave Infotech" folderId="Rjo2NzkyMjE5" branchName="main" branchId="Qjo0MjkzNTI">
	<bns:encryptedValues></bns:encryptedValues>
	<bns:description></bns:description>
	<bns:object>
		<Operation
			xmlns="">
			<Archiving directory="/cpi/archive" enabled></Archiving>
			<Configuration>
				<FTPGetAction fileToMove="*csv" ftpaction="actionget" maxFileCount="1" remoteDirectory="/cpi" transferType="binary"></FTPGetAction>
			</Configuration>
			<Tracking>
				<TrackedFields></TrackedFields>
			</Tracking>
			<Caching></Caching>
		</Operation>
	</bns:object>
</bns:Component>`;

  const pdfContent = `Type,Count
start,3
message,3
sftp,1
stop,3
disk,1
boomiapi,1
documentproperties,1
dataprocess,1

Category,Count,Percentage
Adapt,1,50%
Evaluate,1,50%
Total Processes,2,100.00%`;

  const generatePDF = async () => {
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

  const getConnectorDetails = async () => {
    if (selectedProcess) {
      alert(`Fetching Metadata for Process ID: ${selectedProcess}`);
      console.log(boomiaccountId,selectedProcess)
      try {
        const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getcomponentsdetails';
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
        setConnectorDetails(response.data);
      } catch (error) {
        console.error('Error fetching processes:', error);
        alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
      }
    } else {
      alert('Please enter Boomi Account ID.');
    }
  };

  const mapData=()=>{
    // let http = SourceXML[1].ReceiverAdaptors.http
    // const updatedXMl = HTTP_Receiver(http,targetConnectorsData);

    // let ftp = SourceXML[1].SenderAdaptors.ftp
    // const updatedXMl = FTP_Sender(ftp,targetConnectorsData);  

    // let sftp = SourceXML[1].ReceiverAdaptors.sftp
    // const updatedXMl = SFTP_Receiver(sftp,targetConnectorsData); 

    //  let sftp = SourceXML[1].SenderAdaptors.sftp
    //  const updatedXMl = SFTP_Sender(sftp,targetConnectorsData); 

      //  let mail = SourceXML[1].ReceiverAdaptors.mail
      //  const updatedXMl = MAIL_Receiver(mail,targetConnectorsData); 

      let ftp = SourceXML[1].ReceiverAdaptors.ftp
      const updatedXMl = Test(ftp,updatedConnectorDetails.sender); 

    console.log(updatedXMl)
  }

   console.log(connectorDetails)

  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
      <button onClick={getConnectorDetails}>Get Adptors Details</button>
      <button onClick={mapData}>Map data</button>
      <button onClick={classifyConnectorData}>Classify Connector data</button>
    </div>
  );
};

export default GeneratePDF;
