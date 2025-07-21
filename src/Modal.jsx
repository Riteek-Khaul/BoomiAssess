import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import "./Modal.css";
import "./MigrateToCI.css";
import axios from "axios";
import { shapesMappings } from "./shapesMappings";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { SourceXML } from "./CPISourceXML";
import { Stepper, Step, StepLabel, Box, Button } from "@mui/material";
import {
  HTTP_Receiver,
  FTP_Sender,
  SFTP_Receiver,
  SFTP_Sender,
  MAIL_Receiver,
  Test,
} from "./utils";
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const Modal = ({
  showModal,
  handleClose,
  SpecificProcess,
  selectedProcess,
  boomiaccountId,
  boomiUsername,
  setIsLoading,
  getSubprocessesdependencies,
  subprocessesdependencies,
  getReusableResources,
  reusableResources,
  scriptsDetails,
  xsltDetails,
  mapDetails
}) => {
  const [boomiProcessData, setBoomiProcessData] = useState(SpecificProcess);
  const subProcesses= subprocessesdependencies;
  const [firstPart, setFirstPart] = useState([]);
  const [secondPart, setSecondPart] = useState([]);
  const [APiDetails, setApiDetails] = useState({
    selectedProcess: selectedProcess,
    boomiaccountId: boomiaccountId,
    boomiUsername: boomiUsername,
  });
  const [revisedSequenceMapping, setRevisedSequenceMapping] = useState({});
  const [isMigrate, setisMigrate] = useState(false);
  const [scriptsArray, setScriptsArray] = useState(scriptsDetails);
  const [xsltArray, setXsltArray] = useState(xsltDetails);
  const [mapArray, setMapArray] = useState(mapDetails);
  const [boomiConnectors, setBoomiConnectors] = useState({});
  const [connectors, setConnectors] = useState({ sender: [], receiver: [] });
  const [shapeArray, setShapeArray] = useState([]);
  const [shapeCounter, setShapeCounter] = useState(0);
  const [processedShapes, setProcessedShapes] = useState([]);
  const [MetaInfofileContent, setMetaInfoFileContent] = useState("");
  const [MFContent, setMFContent] = useState("");
  const [projectxmlFile, setProjectXmlFile] = useState(null);
  const [dynamicName, setDynamicName] = useState("Test01");
  const [PM1Content, setPM1Content] = useState("");
  const [PM2Content, setPM2Content] = useState("");
  const [iflowXML, setIflowXML] = useState("");
  const [connectorDetails, setConnectorDetails] = useState("");
  const [updatedConnectorDetails, setUpdatedConnectorDetails] = useState({
    sender: "",
    receiver: "",
  });
  const [stepButtonStatus, setStepButtonStatus] = useState({
    CDStatus: false,
    CCDStatus: false,
    RRStatus: false,
  });
  const [formData, setFormData] = useState({
    iflowName: "",
    iflowId: "",
    packageId: "",
    artifactContent: "",
    cpiHostName: "",
    accessTokenUri: "",
    clientId: "",
    clientSecret: "",
  });

  console.log("scriptsArray",scriptsArray);
  console.log("xsltArray",xsltArray);
  console.log("mapArray",mapArray);

  const reuseResources = reusableResources;
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [proceedClicked, setProceedClicked] = useState(false);
  const [activeStepCount, setActiveStepCount] = useState(0);
  const [skip, setSkip] = useState(new Set());
  const [ipackge, setipackge] =
    useState(`Import-Package: com.sap.esb.application.services.cxf.interceptor,com.sap
 .esb.security,com.sap.it.op.agent.api,com.sap.it.op.agent.collector.cam
 el,com.sap.it.op.agent.collector.cxf,com.sap.it.op.agent.mpl,javax.jms,
 javax.jws,javax.wsdl,javax.xml.bind.annotation,javax.xml.namespace,java
 x.xml.ws,org.apache.camel;version="2.8",org.apache.camel.builder;versio
 n="2.8",org.apache.camel.builder.xml;version="2.8",org.apache.camel.com
 ponent.cxf,org.apache.camel.model;version="2.8",org.apache.camel.proces
 sor;version="2.8",org.apache.camel.processor.aggregate;version="2.8",or
 g.apache.camel.spring.spi;version="2.8",org.apache.commons.logging,org.
 apache.cxf.binding,org.apache.cxf.binding.soap,org.apache.cxf.binding.s
 oap.spring,org.apache.cxf.bus,org.apache.cxf.bus.resource,org.apache.cx
 f.bus.spring,org.apache.cxf.buslifecycle,org.apache.cxf.catalog,org.apa
 che.cxf.configuration.jsse;version="2.5",org.apache.cxf.configuration.s
 pring,org.apache.cxf.endpoint,org.apache.cxf.headers,org.apache.cxf.int
 erceptor,org.apache.cxf.management.counters;version="2.5",org.apache.cx
 f.message,org.apache.cxf.phase,org.apache.cxf.resource,org.apache.cxf.s
 ervice.factory,org.apache.cxf.service.model,org.apache.cxf.transport,or
 g.apache.cxf.transport.common.gzip,org.apache.cxf.transport.http,org.ap
 ache.cxf.transport.http.policy,org.apache.cxf.workqueue,org.apache.cxf.
 ws.rm.persistence,org.apache.cxf.wsdl11,org.osgi.framework;version="1.6
 .0",org.slf4j;version="1.6",org.springframework.beans.factory.config;ve
 rsion="3.0",com.sap.esb.camel.security.cms,org.apache.camel.spi,com.sap
 .esb.webservice.audit.log,com.sap.esb.camel.endpoint.configurator.api,c
 om.sap.esb.camel.jdbc.idempotency.reorg,javax.sql,org.apache.camel.proc
 essor.idempotent.jdbc,org.osgi.service.blueprint;version="[1.0.0,2.0.0)
 "`);

  const steps = [
    "Shapes Used",
    "Connector Details",
    "Transfer Details",
    "Reuse Resources",
    "Create Flow",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "iflowName") {
      // When iflowName changes, also update iflowId (replace spaces with underscores)
      setFormData((prev) => ({
        ...prev,
        iflowName: value,
        iflowId: value.replace(/\s+/g, "_")
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to validate and auto-fill sequence mapping
  const validateSequenceMapping = () => {
    const mappedShapes = processedShapes.filter(s => s.cpiAlternative && s.cpiAlternative !== "NA" && s.cpiAlternative !== "exceptionSubprocess");
    const currentMapping = { ...revisedSequenceMapping };
    
    mappedShapes.forEach((shape, index) => {
      const shapeIndex = processedShapes.indexOf(shape) + 1;
      if (!currentMapping[shapeIndex] || !currentMapping[shapeIndex].stepSeq) {
        currentMapping[shapeIndex] = {
          cpialternative: shape.cpiAlternative,
          stepSeq: (index + 1).toString(),
          originalShape: shape.originalType,
          userlabel: shape.userlabel
        };
      }
    });
    
    setRevisedSequenceMapping(currentMapping);
    return currentMapping;
  };

  const StepOne = () => {
    return (
      <div>
        <div className="p-4">
          {processedShapes.length > 0 ? (
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Step No</th>
                  <th className="border p-2">Shape Lable</th>
                  <th className="border p-2">Original Type</th>
                  <th className="border p-2">CPI Alternative</th>
                  <th className="border p-2">Revised Sequence</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {processedShapes.map((shape, idx) => {
                  const cpiAlternative = shape.cpiAlternative;
                  const currentSequence = revisedSequenceMapping[idx+1]?.stepSeq || "";
                  const isMapped = cpiAlternative && cpiAlternative !== "NA";
                  const isCatchErrors = shape.originalType === 'catcherrors' || cpiAlternative === 'exceptionSubprocess';
                  return (
                    <tr key={idx}>
                      <td className="border p-2 text-center">{shape.stepNumber}</td>
                      <td className="border p-2">{shape.userlabel}</td>
                      <td className="border p-2">{shape.originalType}</td>
                      <td className="border p-2">
                        {isMapped ? (
                          <span className="text-green-600 font-medium">{cpiAlternative}</span>
                        ) : (
                          <span className="text-red-600">No Alternative</span>
                        )}
                      </td>
                      <td className="border p-2">
                        {isMapped ? (
                          isCatchErrors ? (
                            <span className="text-gray-400" title="Exception subprocess is not sequenced">N/A</span>
                          ) : (
                            <input
                              type="number"
                              min="1"
                              value={currentSequence}
                              onChange={e => {
                                const value = e.target.value;
                                setRevisedSequenceMapping(prev => ({
                                  ...prev,
                                  [idx+1]: {
                                    cpialternative: cpiAlternative,
                                    stepSeq: value,
                                    originalShape: shape.originalType,
                                    userlabel: shape.userlabel
                                  }
                                }));
                              }}
                              style={{ width: "80px" }}
                              placeholder="Seq #"
                              className="border p-1 rounded"
                              disabled={isCatchErrors}
                            />
                          )
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="border p-2">
                        {isMapped ? (
                          isCatchErrors ? (
                            <span className="text-blue-600">Exception Subprocess</span>
                          ) : (
                            <span className="text-green-600">✓ Mapped</span>
                          )
                        ) : (
                          <span className="text-red-600">✗ No Mapping</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-4">
              <p className="text-gray-500">No shapes detected in the process data.</p>
              <p className="text-sm text-gray-400 mt-2">
                Please ensure the Boomi process data contains valid shape information.
              </p>
            </div>
          )}
          
          {processedShapes.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <h4 className="font-medium text-blue-800 mb-2">Shape Mapping Summary:</h4>
              <ul className="text-sm text-blue-700">
                <li>• Total shapes detected: {processedShapes.length}</li>
                <li>• Successfully mapped: {processedShapes.filter(s => s.cpiAlternative && s.cpiAlternative !== "NA").length}</li>
                <li>• No mapping available: {processedShapes.filter(s => !s.cpiAlternative || s.cpiAlternative === "NA").length}</li>
                <li>• Set revised sequence numbers to control the order of shapes in the generated IFlow</li>
              </ul>
              <div className="mt-3">
                <button 
                  onClick={validateSequenceMapping}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Auto-fill Sequence Numbers
                </button>
                <span className="text-xs text-blue-600 ml-2">
                  Automatically assign sequence numbers to mapped shapes
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const StepTwo = () => {
    return (
      <div className="connectorTable">
        <table border="1" style={{ marginBottom: "16px" }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Action</th>
              <th>Id</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(boomiConnectors) && boomiConnectors.length > 0 ? (
              boomiConnectors.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.connectorType || ""}</td>
                  <td>{row.actionType || ""}</td>
                  <td>{row.connectionId || ""}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  No Connector Details
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {stepButtonStatus.CDStatus ? (
          "Connector Details Fetched Successfully!"
        ) : (
          <button onClick={getConnectorDetails}> GetDetails </button>
        )}
      </div>
    );
  };
  const StepThree = () => {
    return (
      <>
        {stepButtonStatus.CCDStatus ? (
          "Connector Details Mapped Successfully!"
        ) : (
          <div>
            {/* Sender and Receiver Select Inputs */}
            <div style={{ marginBottom: "1em", display: "flex" }}>
              <label>
                Sender:&nbsp;
                <select
                  value={connectors.sender || ""}
                  onChange={(e) =>
                    setConnectors((prev) => ({
                      ...prev,
                      sender: Array.isArray(prev.sender)
                        ? [...prev.sender, e.target.value]
                        : prev.sender
                        ? [prev.sender, e.target.value]
                        : [e.target.value],
                    }))
                  }
                >
                  <option value="">Select Sender</option>
                  <option value="Timer">Timer</option>
                  {boomiConnectors.map((row, idx) => (
                    <option key={idx} value={row.connectorType || ""}>
                      {row.connectorType || `Sender ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </label>
              &nbsp;&nbsp;
              <label>
                Receiver:&nbsp;
                <select
                  value={connectors.receiver || ""}
                  onChange={(e) =>
                    setConnectors((prev) => ({
                      ...prev,
                      receiver: Array.isArray(prev.receiver)
                        ? [...prev.receiver, e.target.value]
                        : prev.receiver
                        ? [prev.receiver, e.target.value]
                        : [e.target.value],
                    }))
                  }
                >
                  <option value="">Select Receiver</option>
                  {boomiConnectors.map((row, idx) => (
                    <option key={idx} value={row.connectorType || ""}>
                      {row.connectorType || `Receiver ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button onClick={classifyConnectorData}>Apply</button>
          </div>
        )}
      </>
    );
  };
  const StepFour = () => {
    return (
      <div className="reuseResourcesTable">
        {stepButtonStatus.RRStatus ? (
          "Resources reused Successfully!"
        ) : (
          <div>
            <h3>Reusable Resources</h3>
            <p>- Message mappings / Scripts / XSLTs can be reuse with some adjustment! </p>
            <h3>Detected :</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f4f4f4" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Resource Name</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Resource Type</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(reuseResources) && reuseResources.length > 0 ? (
                  reuseResources.map((resource, idx) => (
                    <tr key={idx}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {resource.userlabel || "N/A"}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {resource.type || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "12px" }}>
                      No reusable resources detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <p>
          Note: Resources like Passwords/certificates are not
          directly migrated in this process, need manual intervention.
        </p>
      </div>
    );
  };

  const CompleteStep = () => {
    // Prepare ordered shapes based on revised sequence mapping
    const orderedShapes = [];
    if (Object.keys(revisedSequenceMapping).length > 0) {
      const sortedEntries = Object.entries(revisedSequenceMapping)
        .sort(([, a], [, b]) => parseInt(a.stepSeq) - parseInt(b.stepSeq));
      sortedEntries.forEach(([key, value]) => {
        const shape = processedShapes.find(s => s.cpiAlternative === value.cpialternative && (s.userlabel === value.userlabel || !value.userlabel));
        if (shape) {
          orderedShapes.push({ ...shape, sequence: value.stepSeq });
        }
      });
    } else {
      processedShapes.forEach((shape, index) => {
        orderedShapes.push({ ...shape, sequence: (index + 1).toString() });
      });
    }

    // Prepare sender and receiver connectors
    const senderRows = (connectors.sender || []).map((sender, idx) => ({
      type: 'Sender',
      name: sender,
      sequence: idx + 1
    }));
    const receiverRows = (connectors.receiver || []).map((receiver, idx) => ({
      type: 'Receiver',
      name: receiver,
      sequence: orderedShapes.length + senderRows.length + idx + 1
    }));

    // Sequence for shapes starts after senders
    const shapeRows = orderedShapes.map((shape, idx) => ({
      type: 'Shape',
      name: shape.userlabel,
      cpiAlternative: shape.cpiAlternative,
      originalType: shape.originalType,
      sequence: senderRows.length + idx + 1
    }));

    // Combine all rows for display
    const finalRows = [
      ...senderRows,
      ...shapeRows,
      ...receiverRows
    ];

    return (
      <div className="dependenciesTable">
        <h3>Dependencies:</h3>
        <table className="dependenciesTable" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Sub Process Lable</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Sub Process ID</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(subProcesses) && subProcesses.length > 0 ? (
              subProcesses
                .filter((step) => step && step.processId)
                .map((step, idx) => (
                  <tr key={idx}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {step.userlabel || "N/A"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {step.processId || "N/A"}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={2} style={{ textAlign: "center", padding: "12px" }}>
                  No sub process dependencies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h3>Final Sequence for IFlow:</h3>
        <table className="finalSequenceTable" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Sequence</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name / Label</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Original Shape Type</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>CPI Alternative</th>
            </tr>
          </thead>
          <tbody>
            {finalRows.map((row, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{row.sequence}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.type}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.type === 'Shape' ? row.originalType : ''}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.cpiAlternative || (row.type === 'Sender' ? 'Sender Connector' : row.type === 'Receiver' ? 'Receiver Connector' : '')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>All Done...Ready to Migrate!</h3>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
          <Box sx={{ flex: "1 1 auto" }} />
        </Box>
      </div>
    );
  };

  const optionalStep = (step) => {
    return step === 3;
  };

  const skipStep = (step) => {
    return skip.has(step);
  };

  const handleStepNext = () => {
    let newSkipped = skip;
    if (skipStep(activeStepCount)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStepCount);
    }
    setActiveStepCount((prevActiveStep) => prevActiveStep + 1);
    setSkip(newSkipped);
  };

  const handleStepBack = () => {
    setActiveStepCount((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepSkip = () => {
    setActiveStepCount((prevActiveStep) => prevActiveStep + 1);
    setSkip((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStepCount);
      return newSkipped;
    });
  };

  const handleStepReset = () => {
    setActiveStepCount(0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      case 3:
        return <StepFour />;
      case 4:
        return <CompleteStep />;
      default:
        return <div>IFlow Created Successfully!</div>;
    }
  };

  useEffect(() => {
    setBoomiProcessData(SpecificProcess);
    if (boomiProcessData) {
      const parts = boomiProcessData.split("\n\n");
      const firstPartData =
        parts[0]
          ?.split("\n")
          .filter((line) => line.trim() !== "")
          .map((line) => line.split(",").map((cell) => cell.trim())) || [];
      const secondPartData =
        parts[1]?.split("\n").map((line) => line.split(",")) || [];

      setFirstPart(firstPartData);
      setSecondPart(secondPartData);

      const senderConnectors = [];
      const receiverConnectors = [];
      let counter = 0;
      const processedShapes = [];

      // Process connector actions first
      secondPartData.slice(1).forEach((line) => {
        const row = line;
        let shapeType = row[3];
        const configuration = row.slice(4).join(",");

        if (shapeType === "connectoraction" || shapeType === "start") {
          const actionTypeMatch = configuration.match(/@actionType:([^,]+)/);
          const connectorTypeMatch = configuration.match(
            /@connectorType:([^,]+)/
          );
          const connectionIdMatch = configuration.match(
            /@connectionId:([^,]+)/
          );

          // Extract values if matches are found
          if (actionTypeMatch && connectorTypeMatch && connectionIdMatch) {
            const actionType = actionTypeMatch[1].trim();
            const connectorType = connectorTypeMatch[1].trim();
            const connectionId = connectionIdMatch[1].trim();

            // Create a connector object
            const connectorObj = {
              actionType,
              connectorType,
              connectionId,
            };

            // Store in boomiConnectors state as an array of objects
            setBoomiConnectors((prev) => {
              // If prev is an array, append; if not, start new array
              if (Array.isArray(prev)) {
                return [...prev, connectorObj];
              } else {
                return [connectorObj];
              }
            });
          }
        }
      });

      // Process all shapes including non-connector shapes
      secondPartData.slice(1).forEach((line) => {
        const row = line;
        let shapeType = row[3];
        const configuration = row.slice(4).join(",");

        // --- NEW LOGIC FOR MULTISTEP DATAPROCESS ---
        if (shapeType === "dataprocess") {
          // Try to extract all steps from the configuration
          // Example: dataprocess:[step:[[...],[...],[...]]]
          const stepsMatch = configuration.match(/dataprocess:\[step:\[(.*)\]\]/);
          if (stepsMatch && stepsMatch[1]) {
            // Split steps by '], [' (handles both single and multi-step)
            const stepsRaw = stepsMatch[1]
              .replace(/\], \[/g, "]|[") // temp delimiter
              .replace(/^\[/, "")
              .replace(/\]$/, "");
            const stepsArr = stepsRaw.split("]|[");
            stepsArr.forEach((stepStr, stepIdx) => {
              // Extract @name
              const nameMatch = stepStr.match(/@name:([^,\]]+)/);
              const stepName = nameMatch ? nameMatch[1].trim() : `dataprocess_step_${stepIdx+1}`;
              // Try to find userlabel from firstPart data
              let userlabel = stepName;
              if (firstPartData.length > 1) {
                const matchingRow = firstPartData.find(row =>
                  row[2] === stepName || row[1] === stepName
                );
                if (matchingRow && matchingRow[1] && matchingRow[1] !== stepName) {
                  userlabel = matchingRow[1];
                }
              }
              // Map to CPI alternative
              const cpiAlternative = shapesMappings[stepName];
              processedShapes.push({
                originalType: stepName,
                userlabel: userlabel,
                cpiAlternative: cpiAlternative,
                configuration: stepStr,
                stepNumber: counter + 1
              });
              setShapeArray((prevShapeArray) => [...prevShapeArray, cpiAlternative]);
              counter++;
            });
            return; // skip the rest of the logic for this dataprocess row
          }
        }
        // --- END NEW LOGIC ---

        if (shapeType === "dataprocess") {
          const match = configuration.match(/@name:([^,]+)/);
          if (match) {
            shapeType = match[1];
          }
        }

        const invalidShapes = ["connectoraction", "start", "stop"];

        // Check if the shapeType is valid and not a connector action
        if (!invalidShapes.includes(shapeType) && shapeType != undefined) {
          // Get CPI alternative from shapesMappings
          const cpiAlternative = shapesMappings[shapeType];
          // Try to find userlabel from firstPart data
          let userlabel = shapeType; // Default to shape type
          if (firstPartData.length > 1) {
            const matchingRow = firstPartData.find(row =>
              row[2] === shapeType || // Match by shape type in column 2
              row[1] === shapeType    // Match by shape name in column 1
            );
            if (matchingRow && matchingRow[1] && matchingRow[1] !== shapeType) {
              userlabel = matchingRow[1];
            }
          }
          if (cpiAlternative && cpiAlternative !== "NA") {
            processedShapes.push({
              originalType: shapeType,
              userlabel: userlabel,
              cpiAlternative: cpiAlternative,
              configuration: configuration,
              stepNumber: counter + 1
            });
            setShapeArray((prevShapeArray) => [...prevShapeArray, cpiAlternative]);
          } else {
            // Only warn if not handled by the multi-step logic above
            if (shapeType !== "dataprocess") {
              console.warn(`No CPI alternative found for shape type: ${shapeType}`);
            }
          }
        }

        if (shapeType !== "connectoraction" && shapeType !== "catcherrors") {
          counter++;
        }

        // Handle connector actions for sender/receiver classification
        if (shapeType === "connectoraction") {
          const actionTypeMatch = configuration.match(/@actionType:([^,]+)/);
          const connectorTypeMatch = configuration.match(
            /@connectorType:([^,]+)/
          );
          if (actionTypeMatch && connectorTypeMatch) {
            const actionType = actionTypeMatch[1].trim().toUpperCase();
            const connectorType = connectorTypeMatch[1].trim();

            if (
              actionType === "GET" ||
              actionType === "EXECUTE" ||
              actionType === "QUERY"
            ) {
              senderConnectors.push(shapesMappings[connectorType]);
            } else if (
              actionType === "SEND" ||
              actionType === "CREATE" ||
              actionType === "UPDATE"
            ) {
              receiverConnectors.push(shapesMappings[connectorType]);
            }
          }
        }
      });

      setShapeCounter(counter);
      setDynamicName(secondPartData[1] ? secondPartData[1][1] : "Test01");
      setConnectors({
        sender: senderConnectors,
        receiver: receiverConnectors,
      });
      // Store processed shapes in state
      setProcessedShapes(processedShapes);
    }
    getSubprocessesdependencies();
    getReusableResources();
  }, [SpecificProcess]);

  useEffect(() => {
    setScriptsArray(scriptsDetails || []);
    setXsltArray(xsltDetails || []);
    setMapArray(mapDetails || []);
  }, [scriptsDetails, xsltDetails, mapDetails]);

  const TemplateData = {
    manifestdata: `Manifest-Version: 1.0\nBundle-ManifestVersion: 2\nBundle-Name: ${dynamicName}\nBundle-SymbolicName: ${dynamicName}; singleton:=true\nBundle-Version: 1.0.1\nSAP-BundleType: IntegrationFlow\nSAP-NodeType: IFLMAP\nSAP-RuntimeProfile: iflmap\n${ipackge}\nImport-Service: com.sap.esb.webservice.audit.log.AuditLogger,com.sap.esb.security.KeyManagerFactory;multiple:=false,com.sap.esb.security.TrustManagerFactory;multiple:=false,javax.sql.DataSource;multiple:=false;filter=\"(dataSourceName=default)\",org.apache.cxf.ws.rm.persistence.RMStore;multiple:=false,com.sap.esb.camel.security.cms.SignatureSplitter;multiple:=false\nOrigin-Bundle-Name: ${dynamicName}\nOrigin-Bundle-SymbolicName: ${dynamicName}\n`,
    projectData: `<?xml version=\"1.0\" encoding=\"UTF-8\"?><projectDescription>\n   <name>${dynamicName}</name>\n   <comment/>\n   <projects/>\n   <buildSpec>\n      <buildCommand>\n         <name>org.eclipse.jdt.core.javabuilder</name>\n         <arguments/>\n      </buildCommand>\n   </buildSpec>\n   <natures>\n      <nature>org.eclipse.jdt.core.javanature</nature>\n      <nature>com.sap.ide.ifl.project.support.project.nature</nature>\n      <nature>com.sap.ide.ifl.bsn</nature>\n   </natures>\n</projectDescription>`,
    parameters: `<?xml version="1.0" encoding="UTF-8" standalone="no"?><parameters><param_references/></parameters>`,
  };

  const buildDefaultProjectFiles = () => {
    const currentDate = new Date();
    const day = currentDate.toLocaleString("en-US", { weekday: "short" });
    const month = currentDate.toLocaleString("en-US", { month: "short" });
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const formattedDateTime = `${day} ${month} ${date} ${hours}:${minutes}:${seconds} UTC ${year}`;
    const MIfileContent = `#Store metainfo properties\n#${formattedDateTime}\ndescription\n`;
    const blob = new Blob([MIfileContent], { type: "text/plain" });
    setMetaInfoFileContent(blob);

    const PM1 = `#${formattedDateTime}`;
    const blob1 = new Blob([PM1], { type: "text/plain" });
    setPM1Content(blob1);

    const projectDataContent = TemplateData.projectData;
    const blob2 = new Blob([projectDataContent], { type: "text/xml" });
    setProjectXmlFile(blob2);

    const parametersContent = TemplateData.parameters;
    const blob3 = new Blob([parametersContent], { type: "text/xml" });
    setPM2Content(blob3);

    const MFfileContent = TemplateData.manifestdata;
    const blob4 = new Blob([MFfileContent], { type: "text/xml" });
    setMFContent(blob4);
  };

  // Function to create collaboration part
  const createCollaboration = () => {
    const extensionElements = SourceXML[2].Collaboration.ExtensinElements;
    const participants = `${SourceXML[2].participants.Sender}${SourceXML[2].participants.Receiver}${SourceXML[2].participants.IntegrationProcess}`;
    let messageFlow = "";
    let messageFlowCounter = 1;

    function updateMessageFlowIds(xmlString, messageFlowCounter) {
      const options = {
        ignoreAttributes: false, // Parse attributes as well
        attributeNamePrefix: "@_", // Prefix for attribute names
      };

      // Parse XML string to JSON object
      const parser = new XMLParser(options);
      let jsonObj = parser.parse(xmlString);

      // Example manipulation: Update callActivity id attribute
      if (
        jsonObj["bpmn2:messageFlow"] &&
        jsonObj["bpmn2:messageFlow"]["@_id"]
      ) {
        jsonObj["bpmn2:messageFlow"][
          "@_id"
        ] = `${jsonObj["bpmn2:messageFlow"]["@_id"]}${messageFlowCounter}`;
        messageFlowCounter += 1;
      }

      // Convert JSON object back to XML string
      const builder = new XMLBuilder(options);
      const updatedXML = builder.build(jsonObj);

      return { updatedXML, messageFlowCounter };
    }

    connectors.sender.forEach((senderConnector) => {
      let sourceXML = SourceXML[1].SenderAdaptors[senderConnector];
      // update the connector config details
      let updatedSourceXML = "";

      if (senderConnector == "ftp") {
        updatedSourceXML = FTP_Sender(
          sourceXML,
          updatedConnectorDetails.sender
        );
      } else if (senderConnector == "sftp") {
        updatedSourceXML = SFTP_Sender(
          sourceXML,
          updatedConnectorDetails.sender
        );
      } else {
        updatedSourceXML = sourceXML;
      }

      let result = updateMessageFlowIds(updatedSourceXML, messageFlowCounter);
      messageFlow += result.updatedXML;
      messageFlowCounter = result.messageFlowCounter;
    });

    connectors.receiver.forEach((receiverConnector) => {
      let sourceXML = SourceXML[1].ReceiverAdaptors[receiverConnector];

      // update the connector config details
      let updatedSourceXML = "";

      if (receiverConnector == "http") {
        updatedSourceXML = HTTP_Receiver(
          sourceXML,
          updatedConnectorDetails.receiver
        );
      } else if (receiverConnector == "sftp") {
        updatedSourceXML = SFTP_Receiver(
          sourceXML,
          updatedConnectorDetails.receiver
        );
      } else if (receiverConnector == "mail") {
        updatedSourceXML = MAIL_Receiver(
          sourceXML,
          updatedConnectorDetails.receiver
        );
      } else {
        updatedSourceXML = sourceXML;
      }

      let result = updateMessageFlowIds(updatedSourceXML, messageFlowCounter);
      messageFlow += result.updatedXML;
      messageFlowCounter = result.messageFlowCounter;
    });

    return `<bpmn2:collaboration id="Collaboration_1" name="Default Collaboration">${extensionElements}${participants}${messageFlow}</bpmn2:collaboration>`;
  };

  const createProcess = () => {
    setIsLoading(true);
    const extensionElements = SourceXML[3].IntegrationProcess.extensionElements;
    let events = `${SourceXML[0].events.StartEvent}${SourceXML[0].events.EndEvent}`;

    function StartEventUpdate(events) {
      const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      };

      const parser = new XMLParser(options);
      const builder = new XMLBuilder(options);

      // Parse the XML events string to a JSON object
      let jsonObj = parser.parse(events);

      // Locate the startEvent element and update its outgoing element
      if (jsonObj["bpmn2:startEvent"]) {
        jsonObj["bpmn2:startEvent"]["bpmn2:outgoing"] = `SequenceFlow_1`;
      }

      // Convert the JSON object back to an XML string
      let updatedEvents = builder.build(jsonObj);

      return updatedEvents;
    }

    function EndEventUpdate(events, counter) {
      const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      };

      const parser = new XMLParser(options);
      const builder = new XMLBuilder(options);

      // Parse the XML events string to a JSON object
      let jsonObj = parser.parse(events);

      // Locate the endEvent element and update its incoming element
      if (jsonObj["bpmn2:endEvent"]) {
        jsonObj["bpmn2:endEvent"]["bpmn2:incoming"] = `SequenceFlow_${counter}`;
      }

      // Convert the JSON object back to an XML string
      let updatedEvents = builder.build(jsonObj);

      return updatedEvents;
    }

    // Update StartEvent outgoing and EndEvent incoming
    events = StartEventUpdate(events);
    events = EndEventUpdate(events, shapeArray.length + 1);

    let palleteItems = "";
    let callActivityCounter = 1;
    let scriptCounter = 1;
    let xsltCounter = 1;

    function updatePalleteItemsIds(xmlString, callActivityCounter, shape, scriptCounter, xsltCounter) {
      const options = {
        ignoreAttributes: false, // Parse attributes as well
        attributeNamePrefix: "@_", // Prefix for attribute names
      };

      // Parse XML string to JSON object
      const parser = new XMLParser(options);
      let jsonObj = parser.parse(xmlString);

      // Example manipulation: Update callActivity id attribute
      if (
        jsonObj["bpmn2:callActivity"] &&
        jsonObj["bpmn2:callActivity"]["@_id"]
      ) {
        jsonObj["bpmn2:callActivity"][
          "@_id"
        ] = `${jsonObj["bpmn2:callActivity"]["@_id"]}${callActivityCounter}`;

        jsonObj["bpmn2:callActivity"][
          "bpmn2:incoming"
        ] = `${jsonObj["bpmn2:callActivity"]["bpmn2:incoming"]}${callActivityCounter}`;
        jsonObj["bpmn2:callActivity"]["bpmn2:outgoing"] = `${
          jsonObj["bpmn2:callActivity"]["bpmn2:outgoing"]
        }${callActivityCounter + 1}`;

        // Update name based on shape userlabel
        if (shape && shape.userlabel) {
          jsonObj["bpmn2:callActivity"]["@_name"] = shape.userlabel;
        }

        // Handle script and XSLT specific updates
        if (shape && shape.cpiAlternative === 'groovyScript') {
          // Find script property and update it
          if (jsonObj["bpmn2:callActivity"]["bpmn2:extensionElements"] &&
              jsonObj["bpmn2:callActivity"]["bpmn2:extensionElements"]["ifl:property"]) {
            const properties = jsonObj["bpmn2:callActivity"]["bpmn2:extensionElements"]["ifl:property"];
            if (Array.isArray(properties)) {
              properties.forEach(prop => {
                if (prop.key === 'script') {
                  // Map to actual script from scriptsArray
                  const scriptIndex = scriptCounter - 1;
                  if (scriptsArray && scriptsArray[scriptIndex]) {
                    const scriptObj = scriptsArray[scriptIndex];
                    let extension = "";
                    if (scriptObj.language === "groovy") {
                      extension = ".groovy";
                    } else if (scriptObj.language === "javascript") {
                      extension = ".js";
                    }
                    prop.value = `script${scriptCounter}${extension}`;
                  } else {
                    prop.value = `script${scriptCounter}.groovy`;
                  }
                }
              });
            } else if (properties.key === 'script') {
              // Map to actual script from scriptsArray
              const scriptIndex = scriptCounter - 1;
              if (scriptsArray && scriptsArray[scriptIndex]) {
                const scriptObj = scriptsArray[scriptIndex];
                let extension = "";
                if (scriptObj.language === "groovy") {
                  extension = ".groovy";
                } else if (scriptObj.language === "javascript") {
                  extension = ".js";
                }
                properties.value = `script${scriptCounter}${extension}`;
              } else {
                properties.value = `script${scriptCounter}.groovy`;
              }
            }
          }
          scriptCounter++;
        } else if (shape && shape.cpiAlternative === 'xsltMapping') {
          // Find XSLT mapping properties and update them
          if (jsonObj["bpmn2:callActivity"]["bpmn2:extensionElements"] &&
              jsonObj["bpmn2:callActivity"]["bpmn2:extensionElements"]["ifl:property"]) {
            const properties = jsonObj["bpmn2:callActivity"]["bpmn2:extensionElements"]["ifl:property"];
            if (Array.isArray(properties)) {
              properties.forEach(prop => {
                if (prop.key === 'mappinguri') {
                  // Map to actual XSLT from xsltArray
                  const xsltIndex = xsltCounter - 1;
                  if (xsltArray && xsltArray[xsltIndex]) {
                    const xsltObj = xsltArray[xsltIndex];
                    prop.value = `dir://mapping/xslt/src/main/resources/mapping/XSLTMapping${xsltCounter}.xsl`;
                  } else {
                    prop.value = `dir://mapping/xslt/src/main/resources/mapping/XSLTMapping${xsltCounter}.xsl`;
                  }
                } else if (prop.key === 'mappingname') {
                  // Map to actual XSLT name from xsltArray
                  const xsltIndex = xsltCounter - 1;
                  if (xsltArray && xsltArray[xsltIndex]) {
                    const xsltObj = xsltArray[xsltIndex];
                    prop.value = xsltObj.name || `XSLTMapping${xsltCounter}`;
                  } else {
                    prop.value = `XSLTMapping${xsltCounter}`;
                  }
                } else if (prop.key === 'mappingpath') {
                  // Map to actual XSLT path from xsltArray
                  const xsltIndex = xsltCounter - 1;
                  if (xsltArray && xsltArray[xsltIndex]) {
                    const xsltObj = xsltArray[xsltIndex];
                    prop.value = `src/main/resources/mapping/${xsltObj.name || `XSLTMapping${xsltCounter}`}`;
                  } else {
                    prop.value = `src/main/resources/mapping/XSLTMapping${xsltCounter}`;
                  }
                }
              });
            } else if (properties.key === 'mappinguri') {
              // Map to actual XSLT from xsltArray
              const xsltIndex = xsltCounter - 1;
              if (xsltArray && xsltArray[xsltIndex]) {
                const xsltObj = xsltArray[xsltIndex];
                properties.value = `dir://mapping/xslt/src/main/resources/mapping/XSLTMapping${xsltCounter}.xsl`;
              } else {
                properties.value = `dir://mapping/xslt/src/main/resources/mapping/XSLTMapping${xsltCounter}.xsl`;
              }
            } else if (properties.key === 'mappingname') {
              // Map to actual XSLT name from xsltArray
              const xsltIndex = xsltCounter - 1;
              if (xsltArray && xsltArray[xsltIndex]) {
                const xsltObj = xsltArray[xsltIndex];
                properties.value = xsltObj.name || `XSLTMapping${xsltCounter}`;
              } else {
                properties.value = `XSLTMapping${xsltCounter}`;
              }
            } else if (properties.key === 'mappingpath') {
              // Map to actual XSLT path from xsltArray
              const xsltIndex = xsltCounter - 1;
              if (xsltArray && xsltArray[xsltIndex]) {
                const xsltObj = xsltArray[xsltIndex];
                properties.value = `src/main/resources/mapping/${xsltObj.name || `XSLTMapping${xsltCounter}`}`;
              } else {
                properties.value = `src/main/resources/mapping/XSLTMapping${xsltCounter}`;
              }
            }
          }
          xsltCounter++;
        }

        callActivityCounter += 1;
      }
      // Convert JSON object back to XML string
      // Convert JSON object back to XML string
      const builder = new XMLBuilder(options);
      const updatedXML = builder.build(jsonObj);

      return { updatedXML, callActivityCounter, scriptCounter, xsltCounter };
    }

    // Use revised sequence mapping to determine shape order
    const orderedShapes = [];
    
    // If revised sequence mapping exists, use it for ordering
    if (Object.keys(revisedSequenceMapping).length > 0) {
      // Sort by step sequence number
      const sortedEntries = Object.entries(revisedSequenceMapping)
        .sort(([,a], [,b]) => parseInt(a.stepSeq) - parseInt(b.stepSeq));
      
      sortedEntries.forEach(([key, value]) => {
        // Find the corresponding shape from processedShapes
        const shape = processedShapes.find(s => s.cpiAlternative === value.cpialternative);
        if (shape) {
          orderedShapes.push(shape);
        }
      });
    } else {
      // Fallback to original order
      orderedShapes.push(...processedShapes);
    }

    // --- NEW: Handle exception subprocess ---
    const hasExceptionSubprocess = processedShapes.some(
      (shape) => shape.originalType === 'catcherrors' || shape.cpiAlternative === 'exceptionSubprocess'
    );
    let exceptionSubprocessXML = '';
    if (hasExceptionSubprocess) {
      exceptionSubprocessXML = SourceXML[2].participants.exceptionSubprocess;
    }
    // --- END NEW ---

    // Generate XML for each shape in the correct order, skipping exceptionSubprocess
    orderedShapes.forEach((shape) => {
      const cpiAlternative = shape.cpiAlternative;
      if (cpiAlternative === 'exceptionSubprocess') return; // skip from main sequence
      let sourceXML = SourceXML[0].palleteItems[cpiAlternative];
      
      if (sourceXML) {
        let result = updatePalleteItemsIds(sourceXML, callActivityCounter, shape, scriptCounter, xsltCounter);
        palleteItems += result.updatedXML;
        callActivityCounter = result.callActivityCounter;
        scriptCounter = result.scriptCounter;
        xsltCounter = result.xsltCounter;
      } else {
        console.warn(`No XML template found for CPI alternative: ${cpiAlternative}`);
        // Create a basic callActivity as fallback
        const fallbackXML = `<bpmn2:callActivity id="CallActivity_${callActivityCounter}" name="${cpiAlternative}">
          <bpmn2:extensionElements>
            <ifl:property>
              <key>componentVersion</key>
              <value>1.0</value>
            </ifl:property>
            <ifl:property>
              <key>activityType</key>
              <value>${cpiAlternative}</value>
            </ifl:property>
          </bpmn2:extensionElements>
          <bpmn2:incoming>SequenceFlow_${callActivityCounter}</bpmn2:incoming>
          <bpmn2:outgoing>SequenceFlow_${callActivityCounter + 1}</bpmn2:outgoing>
        </bpmn2:callActivity>`;
        palleteItems += fallbackXML;
        callActivityCounter += 1;
      }
    });

    function updateSequenceFlowIds(
      xmlString,
      sequenceFlowCounter,
      requireData,
      prevShapeId,
      nextShapeId
    ) {
      const options = {
        ignoreAttributes: false, // Parse attributes as well
        attributeNamePrefix: "@_", // Prefix for attribute names
      };

      // Parse XML string to JSON object
      const parser = new XMLParser(options);
      let jsonObj = parser.parse(xmlString);
      const RD = parser.parse(requireData, options);

      // Build a map of elements with their IDs and incoming/outgoing values
      const elementMap = {};
      if (RD.definitions) {
        Object.keys(RD.definitions).forEach((key) => {
          const element = RD.definitions[key];
          if (Array.isArray(element)) {
            element.forEach((item) => {
              if (item["@_id"]) {
                elementMap[item["@_id"]] = item;
              }
            });
          } else if (element["@_id"]) {
            elementMap[element["@_id"]] = element;
          }
        });
      }

      // Update sequenceFlow id attribute
      if (jsonObj && jsonObj["bpmn2:sequenceFlow"]) {
        jsonObj["bpmn2:sequenceFlow"]["@_id"] = `SequenceFlow_${sequenceFlowCounter}`;
        // Set sourceRef and targetRef robustly
        if (prevShapeId) {
          jsonObj["bpmn2:sequenceFlow"]["@_sourceRef"] = prevShapeId;
        } else {
          // fallback: try to infer from elementMap
          const id = jsonObj["bpmn2:sequenceFlow"]["@_id"];
          Object.values(elementMap).forEach((parent) => {
            if (parent["bpmn2:outgoing"] && parent["bpmn2:outgoing"] === id) {
              jsonObj["bpmn2:sequenceFlow"]["@_sourceRef"] = parent["@_id"];
            }
          });
        }
        if (nextShapeId) {
          jsonObj["bpmn2:sequenceFlow"]["@_targetRef"] = nextShapeId;
        } else {
          // fallback: try to infer from elementMap
          const id = jsonObj["bpmn2:sequenceFlow"]["@_id"];
          Object.values(elementMap).forEach((parent) => {
            if (parent["bpmn2:incoming"] && parent["bpmn2:incoming"] === id) {
              jsonObj["bpmn2:sequenceFlow"]["@_targetRef"] = parent["@_id"];
            }
          });
        }
        sequenceFlowCounter += 1;
      }

      // Convert JSON object back to XML string
      const builder = new XMLBuilder(options);
      const updatedXML = builder.build(jsonObj);

      return { updatedXML, sequenceFlowCounter };
    }

    let sequenceFlows = "";
    let sequenceFlowCounter = 1;
    const requireData = `<definitions>${palleteItems}${events}</definitions>`;
    // Generate sequence flows based on ordered shapes
    const totalShapes = orderedShapes.length;
    // Build a list of shape IDs for sequence flow linking
    const shapeIds = orderedShapes.map((_, i) => `CallActivity_${i + 1}`);
    // Add start and end event IDs
    shapeIds.unshift("StartEvent_1");
    shapeIds.push("EndEvent_1");
    for (let i = 0; i < shapeIds.length - 1; i++) {
      let result = updateSequenceFlowIds(
        SourceXML[0].sequenceFlow,
        sequenceFlowCounter,
        requireData,
        shapeIds[i],
        shapeIds[i + 1]
      );
      sequenceFlows += result.updatedXML;
      sequenceFlowCounter = result.sequenceFlowCounter;
    }
    setIsLoading(false);
    // Insert exception subprocess after extensionElements and before palleteItems
    return `<bpmn2:process id="Process_1" name="Integration Process">${extensionElements}${exceptionSubprocessXML}${events}${palleteItems}${sequenceFlows}</bpmn2:process>`;
  };

  // Function to create BPMPlane_1 part
  const createBPMPlane_1 = () => {
    let bpmnShapes = SourceXML[4].BPMNDiagram.defaultBPMNShape;
    // Use revised sequence mapping to determine shape order
    const orderedShapes = [];
    if (Object.keys(revisedSequenceMapping).length > 0) {
      const sortedEntries = Object.entries(revisedSequenceMapping)
        .sort(([,a], [,b]) => parseInt(a.stepSeq) - parseInt(b.stepSeq));
      sortedEntries.forEach(([key, value]) => {
        const shape = processedShapes.find(s => s.cpiAlternative === value.cpialternative);
        if (shape) {
          orderedShapes.push(shape);
        }
      });
    } else {
      orderedShapes.push(...processedShapes);
    }
    // Generate BPMN shapes for each ordered shape
    orderedShapes.forEach((shape, index) => {
      const bpmnElement = `CallActivity_${index + 1}`;
      const id = `BPMNShape_CallActivity_${index + 1}`;
      bpmnShapes += `\n          <bpmndi:BPMNShape bpmnElement="${bpmnElement}" id="${id}">\n              <dc:Bounds height="60.0" width="100.0" x="412.0" y="132.0"/>\n          </bpmndi:BPMNShape>`;
    });
    // --- Add Exception Subprocess BPMNShape/BPMNEdge if present, using correct IDs ---
    const hasExceptionSubprocess = processedShapes.some(
      (shape) => shape.originalType === 'catcherrors' || shape.cpiAlternative === 'exceptionSubprocess'
    );
    let bpmnExceptionShapes = '';
    let bpmnExceptionEdges = '';
    if (hasExceptionSubprocess) {
      // Use IDs matching the process section
      bpmnExceptionShapes = `\n            <bpmndi:BPMNShape bpmnElement=\"SubProcess_1\" id=\"BPMNShape_SubProcess_1\">\n                <dc:Bounds height=\"140.0\" width=\"400.0\" x=\"283.0\" y=\"230.0\"/>\n            </bpmndi:BPMNShape>\n            <bpmndi:BPMNShape bpmnElement=\"StartEvent_13\" id=\"BPMNShape_StartEvent_13\">\n                <dc:Bounds height=\"32.0\" width=\"32.0\" x=\"316.0\" y=\"276.0\"/>\n            </bpmndi:BPMNShape>\n            <bpmndi:BPMNShape bpmnElement=\"EndEvent_14\" id=\"BPMNShape_EndEvent_14\">\n                <dc:Bounds height=\"32.0\" width=\"32.0\" x=\"603.0\" y=\"276.0\"/>\n            </bpmndi:BPMNShape>`;
      // Set sourceElement and targetElement to correct event IDs
      bpmnExceptionEdges = `\n            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_15\" id=\"BPMNEdge_SequenceFlow_15\" sourceElement=\"BPMNShape_StartEvent_13\" targetElement=\"BPMNShape_EndEvent_14\">\n                <di:waypoint x=\"332.0\" xsi:type=\"dc:Point\" y=\"292.0\"/>\n                <di:waypoint x=\"619.0\" xsi:type=\"dc:Point\" y=\"292.0\"/>\n            </bpmndi:BPMNEdge>`;
    }
    let bpmnEdges = SourceXML[4].BPMNDiagram.defaultBPMNEdge;
    const totalShapes = orderedShapes.length;
    // Build a list of shape IDs for sequence flow linking
    const shapeIds = orderedShapes.map((_, i) => `CallActivity_${i + 1}`);
    shapeIds.unshift("StartEvent_1");
    shapeIds.push("EndEvent_1");
    for (let i = 0; i < shapeIds.length - 1; i++) {
      const bpmnElement = `SequenceFlow_${i + 1}`;
      const id = `BPMNEdge_SequenceFlow_${i + 1}`;
      bpmnEdges += `\n          <bpmndi:BPMNEdge bpmnElement=\"${bpmnElement}\" id=\"${id}\" sourceElement=\"BPMNShape_${shapeIds[i]}\" targetElement=\"BPMNShape_${shapeIds[i + 1]}\">\n                <di:waypoint x=\"308.0\" xsi:type=\"dc:Point\" y=\"160.0\"/>\n                <di:waypoint x=\"462.0\" xsi:type=\"dc:Point\" y=\"160.0\"/>\n          </bpmndi:BPMNEdge>`;
    }
    // Insert exception shapes/edges at the end
    return `<bpmndi:BPMNPlane bpmnElement="Collaboration_1" id="BPMNPlane_1">${bpmnShapes}${bpmnExceptionShapes}${bpmnEdges}${bpmnExceptionEdges}</bpmndi:BPMNPlane>`;
  };

  // Function to create BPMNDiagram part
  const createBPMNDiagram = (bpmPlane_1) => {
    return `<bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Default Collaboration Diagram">${bpmPlane_1}</bpmndi:BPMNDiagram>`;
  };

  const generateIflowXML = () => {
    setIsLoading(true);
    const defaultXMLCode = `<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:ifl="http:///com.sap.ifl.model/Ifl.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1">`;
    const collaboration = createCollaboration();
    const process = createProcess();
    const bpmPlane_1 = createBPMPlane_1();
    const bpmnDiagram = createBPMNDiagram(bpmPlane_1);

    alert("Generating Iflow XML...");

    let iflowXMLCode = `${defaultXMLCode}${collaboration}${process}${bpmnDiagram}</bpmn2:definitions>`;
    // Ensure all messageEventDefinition tags are self-closing
    iflowXMLCode = iflowXMLCode.replace(/<bpmn2:messageEventDefinition>\s*<\/bpmn2:messageEventDefinition>/g, '<bpmn2:messageEventDefinition/>');
    // Ensure all sequenceFlow tags are self-closing
    iflowXMLCode = iflowXMLCode.replace(/<bpmn2:sequenceFlow([^>]*)>\s*<\/bpmn2:sequenceFlow>/g, '<bpmn2:sequenceFlow$1/>');
    setIsLoading(false);
    return iflowXMLCode;
  };

  const getConnectorDetails = async () => {
    if (selectedProcess) {
      alert(`Fetching Metadata for Process ID: ${selectedProcess}`);
      console.log(boomiaccountId, selectedProcess);
      try {
        setIsLoading(true);
        const url =
          "https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getcomponentsdetails";
        const response = await axios.get(url, {
          params: {
            boomiaccountId: boomiaccountId,
            selectedProcess: selectedProcess,
          },
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        setConnectorDetails(response.data);
        setStepButtonStatus({
          CDStatus: true,
          CCDStatus: false,
          RRStatus: false,
        });
      } catch (error) {
        console.error("Error fetching processes:", error);
        alert(
          "Something Went wrong!...Please check the Account ID or Associated Credentials!"
        );
      }
      setIsLoading(false);
    } else {
      alert("Please enter Boomi Account ID.");
    }
  };

  const classifyConnectorData = () => {
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    };

    const senderType = connectors.sender[0];
    const receiverType = connectors.receiver[0];

    const parser = new XMLParser(options);
    const builder = new XMLBuilder(options);

    // Parse XML to JSON
    let jsonObjectConnectorData = parser.parse(connectorDetails);

    // Extract components
    const components =
      jsonObjectConnectorData["multimap:Messages"]["multimap:Message1"][
        "bns:Component"
      ];

    let newUpdatedConnectorDetails = {
      sender: "",
      receiver: "",
    };

    components.forEach((element) => {
      const elementXml = builder.build({ "bns:Component": element });
      if (element["@_subType"] === senderType) {
        newUpdatedConnectorDetails.sender += elementXml;
      } else if (element["@_subType"] === receiverType) {
        newUpdatedConnectorDetails.receiver += elementXml;
      }
    });
    setUpdatedConnectorDetails(newUpdatedConnectorDetails);
    setStepButtonStatus({
      CDStatus: true,
      CCDStatus: true,
      RRStatus: false,
    });
  };

  const ProceedForMigration = () => {
    setIsLoading(true);
    
    // Validate and auto-fill sequence mapping if needed
    const validatedMapping = validateSequenceMapping();
    
    const defualtProjectFiles = buildDefaultProjectFiles();
    const xmlContent = generateIflowXML();
    const blob = new Blob([xmlContent], { type: "text/xml" });
    setIflowXML(blob);
    setProceedClicked(true);
    handleStepNext();
    setIsLoading(false);
  };

  const DownloadZip = () => {
    const zip = new JSZip();

    // Create folders and add files
    zip.file("metainfo.prop", MetaInfofileContent);
    zip.file(".project", projectxmlFile);
    zip
      .folder("src")
      .folder("main")
      .folder("resources")
      .folder("scenarioflows")
      .folder("integrationflow")
      .file(`${dynamicName}.iflw`, iflowXML);
    zip.folder("META-INF").file("MANIFEST.MF", MFContent);
    zip
      .folder("src")
      .folder("main")
      .folder("resources")
      .file("parameters.prop", PM1Content);
    zip
      .folder("src")
      .folder("main")
      .folder("resources")
      .file("parameters.propdef", PM2Content);

    // Add scripts to the zip
    if (Array.isArray(scriptsArray) && scriptsArray.length > 0) {
      const scriptFolder = zip.folder("src").folder("main").folder("resources").folder("script");
      scriptsArray.forEach((scriptObj) => {
        if (scriptObj && scriptObj.name && scriptObj.script) {
          let extension = ".groovy";
          if (scriptObj.language === "javascript") extension = ".js";
          scriptFolder.file(`${scriptObj.name}${extension}`, scriptObj.script);
        }
      });
    }

    // Add XSLTs to the mapping folder in the zip
    if (Array.isArray(xsltArray) && xsltArray.length > 0) {
      const mappingFolder = zip.folder("src").folder("main").folder("resources").folder("mapping");
      xsltArray.forEach((xsltObj) => {
        if (xsltObj && xsltObj.name && xsltObj.xslt) {
          mappingFolder.file(`${xsltObj.name}.xsl`, xsltObj.xslt);
        }
      });
    }

    // Add map files and XSDs from mapArray
    if (Array.isArray(mapArray) && mapArray.length > 0) {
      const mappingFolder = zip.folder("src").folder("main").folder("resources").folder("mapping");
      const xsdFolder = zip.folder("src").folder("main").folder("resources").folder("xsd");
      mapArray.forEach((mapObj) => {
        // Add .mmap file
        if (mapObj && mapObj.name && mapObj.mapping) {
          mappingFolder.file(`${mapObj.name}`, mapObj.mapping);
        }
        // Add sourceProfile XSD
        if (mapObj && mapObj.sourceProfile && mapObj.sourceProfile.name && mapObj.sourceProfile.xsd) {
          xsdFolder.file(`${mapObj.sourceProfile.name}`, mapObj.sourceProfile.xsd);
        }
        // Add targetProfile XSD
        if (mapObj && mapObj.targetProfile && mapObj.targetProfile.name && mapObj.targetProfile.xsd) {
          xsdFolder.file(`${mapObj.targetProfile.name}`, mapObj.targetProfile.xsd);
        }
      });
    }

    zip.folder("src").folder("main").folder("resources").folder("json");
    zip.folder("src").folder("main").folder("resources").folder("mapping");
    zip.folder("src").folder("main").folder("resources").folder("xsd");
    zip.folder("src").folder("main").folder("resources").folder("edmx");
    zip.folder("src").folder("main").folder("resources").folder("wsdl");

    // Generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${dynamicName}.zip`);
    });
  };

  const submitFormData = async (e) => {
    e.preventDefault();

    const zip = new JSZip();

    // Create folders and add files
    zip.file("metainfo.prop", MetaInfofileContent);
    zip.file(".project", projectxmlFile);
    zip
      .folder("src")
      .folder("main")
      .folder("resources")
      .folder("scenarioflows")
      .folder("integrationflow")
      .file(`${dynamicName}.iflw`, iflowXML);
    zip.folder("META-INF").file("MANIFEST.MF", MFContent);
    zip
      .folder("src")
      .folder("main")
      .folder("resources")
      .file("parameters.prop", PM1Content);
    zip
      .folder("src")
      .folder("main")
      .folder("resources")
      .file("parameters.propdef", PM2Content);

    // Add scripts to the zip
    if (Array.isArray(scriptsArray) && scriptsArray.length > 0) {
      const scriptFolder = zip.folder("src").folder("main").folder("resources").folder("script");
      scriptsArray.forEach((scriptObj) => {
        if (scriptObj && scriptObj.name && scriptObj.script) {
          let extension = ".groovy";
          if (scriptObj.language === "javascript") extension = ".js";
          scriptFolder.file(`${scriptObj.name}${extension}`, scriptObj.script);
        }
      });
    }

    // Add XSLTs to the mapping folder in the zip
    if (Array.isArray(xsltArray) && xsltArray.length > 0) {
      const mappingFolder = zip.folder("src").folder("main").folder("resources").folder("mapping");
      xsltArray.forEach((xsltObj) => {
        if (xsltObj && xsltObj.name && xsltObj.xslt) {
          mappingFolder.file(`${xsltObj.name}.xsl`, xsltObj.xslt);
        }
      });
    }

    // Add map files and XSDs from mapArray
    if (Array.isArray(mapArray) && mapArray.length > 0) {
      const mappingFolder = zip.folder("src").folder("main").folder("resources").folder("mapping");
      const xsdFolder = zip.folder("src").folder("main").folder("resources").folder("xsd");
      mapArray.forEach((mapObj) => {
        // Add .mmap file
        if (mapObj && mapObj.name && mapObj.mapping) {
          mappingFolder.file(`${mapObj.name}`, mapObj.mapping);
        }
        // Add sourceProfile XSD
        if (mapObj && mapObj.sourceProfile && mapObj.sourceProfile.name && mapObj.sourceProfile.xsd) {
          xsdFolder.file(`${mapObj.sourceProfile.name}`, mapObj.sourceProfile.xsd);
        }
        // Add targetProfile XSD
        if (mapObj && mapObj.targetProfile && mapObj.targetProfile.name && mapObj.targetProfile.xsd) {
          xsdFolder.file(`${mapObj.targetProfile.name}`, mapObj.targetProfile.xsd);
        }
      });
    }

    zip.generateAsync({ type: "blob" }).then((content) => {

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Zip = reader.result.split(",")[1]; // Extract Base64 part

        // Ensure base64 is not empty and update state
        if (base64Zip) {
          setFormData((prevState) => ({
            ...prevState,
            artifactContent: base64Zip,
          }));
        } else {
          console.error("Base64 encoding failed or is empty.");
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading Blob:", error);
      };

      // Read the Blob as a data URL
      reader.readAsDataURL(content);
    });

    const apiUrl = "http://localhost:5000/artifact/migrate"; // Replace with the actual API endpoint

    try {
      setIsLoading(true);
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setIsLoading(false);
        setPopupMessage("Migrated successfully!");
        setShowPopup(true);
        //clear all states
        handleCloseModal();
        setisMigrate(false);
        alert("Iflow Migrated successfully!");
       
        return { success: true, message: "Form submitted successfully!" };
        
      } 
    } catch (error) {
      setIsLoading(false);
      const errorData = error.response.data.error.error.message.value;
      console.error("API Error:", errorData);
      setPopupMessage(errorData);
      setShowPopup(true);
      return {
        success: false,
        message: "An error occurred while submitting the form.",
      };
      
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setShapeArray([]);
    setProcessedShapes([]);
    setBoomiProcessData(SpecificProcess); // Reset to initial value
    setFirstPart([]); // Reset to initial value
    setSecondPart([]); // Reset to initial value
    setConnectors({ sender: [], receiver: [] }); // Reset to initial value
    setShapeArray([]); // Reset to initial value
    setShapeCounter(0); // Reset to initial value
    handleStepReset();
    setScriptsArray([]);
    setXsltArray([]);
    setRevisedSequenceMapping({});
    setUpdatedConnectorDetails({ sender: "", receiver: "" });
    setConnectorDetails("");
    setStepButtonStatus({ CDStatus: false, CCDStatus: false, RRStatus: false });
    setProceedClicked(false);
    setIflowXML(null);
    setFormData({ iflowName: "", iflowId: "", packageId: "", cpiHostName: "", accessTokenUri: "", clientId: "", clientSecret: "" });
    setShowPopup(false);
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Migrating: {secondPart[1] && secondPart[1][1]} </h3>
            </div>
            <div className="modal-content">
              <div style={{ width: "100%" }}>
                <Stepper activeStep={activeStepCount} alternativeLabel>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (skipStep(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {activeStepCount === steps.length ? (
                  <div>
                    <CompleteStep />
                  </div>
                ) : (
                  <div>
                    <div className="centerContainer">
                      {renderStepContent(activeStepCount)}
                    </div>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 1 }}>
                      <Button
                        color="primary"
                        disabled={activeStepCount === 0}
                        onClick={handleStepBack}
                        sx={{ mr: 1 }}
                      >
                        Previous
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {optionalStep(activeStepCount) && (
                        <Button
                          color="primary"
                          onClick={handleStepSkip}
                          sx={{ mr: 1 }}
                        >
                          Skip
                        </Button>
                      )}
                      {activeStepCount === steps.length - 1 ? (
                        <button onClick={ProceedForMigration}>
                          Proceed for Iflow
                        </button>
                      ) : (
                        <Button onClick={handleStepNext}> Next </Button>
                      )}
                    </Box>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} id="cancelbtn">
                Cancel
              </button>
              {proceedClicked && (
                <>
                  <button onClick={DownloadZip} id="cancelbtn">
                    Download ZIP
                  </button>
                  <button
                    onClick={() => setisMigrate((prevState) => !prevState)}
                  >
                    Migrate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isMigrate && (
        <div className="modal-overlay">
          <form className="form-container" onSubmit={submitFormData}>
            <div class="form-row">
              <label>
                IFlow Name:
                <input
                  type="text"
                  name="iflowName"
                  value={formData.iflowName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div class="form-row">
              <label>
                IFlow ID:
                <input
                  type="text"
                  name="iflowId"
                  value={formData.iflowId}
                  disabled
                />
              </label>
            </div>
            <div class="form-row">
              <label>
                Package ID:
                <input
                  type="text"
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div class="form-row">
              <label>
                CPI Host Name:
                <input
                  type="text"
                  name="cpiHostName"
                  value={formData.cpiHostName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div class="form-row">
              <label>
                Access Token URI:
                <input
                  type="text"
                  name="accessTokenUri"
                  value={formData.accessTokenUri}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div class="form-row">
              <label>
                Client ID:
                <input
                  type="text"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div class="form-row">
              <label>
                Client Secret:
                <input
                  type="password"
                  name="clientSecret"
                  value={formData.clientSecret}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div class="form-actions">
              <button
                type="button"
                onClick={() => setisMigrate((prevState) => !prevState)}
              >
                Cancel
              </button>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}

      {/* Popup for success or failure message */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
