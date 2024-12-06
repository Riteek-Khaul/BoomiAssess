import React, { useState } from "react";

const CalSubPro = () => {
    const [csvInput, setCsvInput] = useState("");
    const [csvOutput, setCsvOutput] = useState("");
  
    const processCsv = () => {
      try {
        if (!csvInput.trim()) {
          throw new Error("CSV data is empty. Please provide valid data.");
        }
  
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
        const totalProcesses = uniqueComponentIds.length;
        const totalSubprocesses = uniqueSubprocessIds.length;
        const remainingProcesses = totalProcesses - totalSubprocesses;
  
        // Step 5: Construct the CSV result
        const csvResult = `
  Total Processes,Total Main Processes,Total Subprocesses
  ${totalProcesses},${remainingProcesses},${totalSubprocesses}
  `.trim();
  
        // Update the output
        setCsvOutput(csvResult);
      } catch (error) {
        setCsvOutput(`Error: ${error.message}`);
      }
    };
  
    return (
      <div>
        <h1>CSV Processor</h1>
        <textarea
          rows="10"
          cols="50"
          placeholder="Paste your CSV data here..."
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
        />
        <br />
        <button onClick={processCsv}>Process CSV</button>
        <h2>Output:</h2>
        <textarea
          rows="10"
          cols="50"
          readOnly
          value={csvOutput}
          placeholder="Processed CSV output will appear here..."
        />
      </div>
    );
}

export default CalSubPro


