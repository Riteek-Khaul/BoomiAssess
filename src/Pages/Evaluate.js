import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../AuthModal';
import Loader from '../Loader';
import axios from 'axios';
import Navbar from '../Components/Navbar';

const Evaluate = () => {

    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [Auth, setAuth] = useState(() => {
        // Initialize Auth state from local storage if available
        const savedAuth = localStorage.getItem('Auth');
        return savedAuth ? JSON.parse(savedAuth) : true;
      });

    const navigate = useNavigate();

    const handleFileInput = (event) => {
        setFile(event.target.files[0]);
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

    const startEvaluate = async () => {

        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileContent = event.target.result;
                const data = fileContent.split('\n');
                const result = data.map(row => row.split(',').join(',')).join('\n');
                const SubProcessResult = CalculateSubProcesses(result);
                console.log(SubProcessResult)
                await makeEvaluateRequest(result, SubProcessResult);
            };
            reader.readAsText(file);
        } else {
            alert('Please select a file to evaluate.');
        }
    };

    const makeEvaluateRequest = async (csvData, SubProcessResult) => {
        try {
            setIsLoading(true);
            const url = "https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/evaluateprocessmetadata";
            const response = await axios.post(url, csvData, {
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'text/plain',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                responseType: 'text',
            });

            setIsLoading(false);

            const parts = response.data.split(/\n\s*\n/);
            const pdfContent = [parts[0], parts[1], SubProcessResult].join('\n');
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

    const CalculateSubProcesses = (csvInput) => {

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
        const totalProcesses = uniqueComponentIds.length - 1;
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
            setIsLoading(true);
            const url = "https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/makeresultpdf";
            const response = await axios.post(url, pdfContent, {
                headers: {
                    'Accept': 'application/pdf',
                    'Content-Type': 'text/plain',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                responseType: 'blob',
            });

            setIsLoading(false);

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

    return (
        <div className='App'>
            <Navbar />

            <div id="heading" className="heading">
                <h1>BoomiAsses by <img src="logo.png" alt="Company Logo" className="logo" /></h1>
            </div>

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

            {isLoading && <Loader />}

            {Auth && (<AuthModal setAuth={setAuth} />)}
            <footer>
                <p>
                    Developed and Maintained by Crave Infotech (for any support: riteek.khaul@craveinfotech.com)
                </p>
            </footer>

        </div>
    )
}

export default Evaluate