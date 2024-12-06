import React, { useState, useEffect } from "react";
import "./Modal.css";
import './MigrateToCI.css';
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
}) => {
  const [boomiProcessData, setBoomiProcessData] = useState(SpecificProcess);
  const [firstPart, setFirstPart] = useState([]);
  const [secondPart, setSecondPart] = useState([]);
  const [APiDetails, setApiDetails] = useState({
    selectedProcess: selectedProcess,
    boomiaccountId: boomiaccountId,
  });
  const [isMigrate,setisMigrate] = useState(false);
  const [scriptsArray, setScriptsArray] = useState([]);
  const [connectors, setConnectors] = useState({ sender: [], receiver: [] });
  const [shapeArray, setShapeArray] = useState([]);
  const [shapeCounter, setShapeCounter] = useState(0);
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
    artifactContent:"",
    cpiHostName: "",
    accessTokenUri: "",
    clientId: "",
    clientSecret: "",
  });

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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const StepOne = () => {
    return (
      <div className="tables-container">
        <table border="1">
          <thead>
            <tr>
              <th>Shape/Connector</th>
              <th>CPI Alternative</th>
            </tr>
          </thead>
          <tbody>
            {firstPart.slice(1).map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <React.Fragment key={cellIndex}>
                      <td>{cell}</td>
                      <td>{shapesMappings[cell] || "No Alternative"}</td>
                    </React.Fragment>
                  ) : null
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const StepTwo = () => {
    return (
      <div className="connectorTable">
        <table border="1">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({
              length: Math.max(
                connectors.sender.length,
                connectors.receiver.length
              ),
            }).map((_, index) => (
              <tr key={index}>
                <td>{connectors.sender[index] || ""}</td>
                <td>{connectors.receiver[index] || ""}</td>
              </tr>
            ))}
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
          <button onClick={classifyConnectorData}>Classify Details</button>
        )}
      </>
    );
  };
  const StepFour = () => {
    return (
      <div>
        {stepButtonStatus.RRStatus ? (
          "Resources reused Successfully!"
        ) : (
          <button onClick={ReuseScripts}> Reuse Resources </button>
        )}
       
        <p>
          Note: Resources like Message mappings/User Credentials/certificates
          are not directly migrated in this process, need manual intervention.
        </p>
      </div>
    );
  };

  const CompleteStep = () => (
    <div>
      <h3>All Done! </h3>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
        <Box sx={{ flex: "1 1 auto" }} />
      </Box>
    </div>
  );

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
        parts[0]?.split("\n").map((line) => line.split(",")) || [];
      const secondPartData =
        parts[1]?.split("\n").map((line) => line.split(",")) || [];

      setFirstPart(firstPartData);
      setSecondPart(secondPartData);

      const senderConnectors = [];
      const receiverConnectors = [];
      let counter = 0;

      secondPartData.slice(1).forEach((line) => {
        const row = line;
        let shapeType = row[3];
        const configuration = row.slice(4).join(",");

        if (shapeType === "dataprocess") {
          const match = configuration.match(/@name:([^,]+)/);
          shapeType = match[1];
        }

        const invalidShapes = ["connectoraction", "start", "stop"];

        // Check if the shapeType is valid
        if (!invalidShapes.includes(shapeType) && shapeType != undefined) {
          setShapeArray((prevShapeArray) => [...prevShapeArray, shapeType]);
        }

        if (shapeType !== "connectoraction" && shapeType !== "catcherrors") {
          counter++;
        }

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
      setDynamicName(secondPartData[1][1]);
      setConnectors({
        sender: senderConnectors,
        receiver: receiverConnectors,
      });
    }
  }, [SpecificProcess]);

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
    const extensionElements = SourceXML[3].IntegrationProcess.extensionElements;
    let events = `${SourceXML[0].events.StartEvent}${SourceXML[0].events.EndEvent}`;

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

    events = EndEventUpdate(events, shapeArray.length + 1);

    let palleteItems = "";
    let callActivityCounter = 1;

    function updatePalleteItemsIds(xmlString, callActivityCounter) {
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

        callActivityCounter += 1;
      }
      // Convert JSON object back to XML string
      // Convert JSON object back to XML string
      const builder = new XMLBuilder(options);
      const updatedXML = builder.build(jsonObj);

      return { updatedXML, callActivityCounter };
    }

    shapeArray.forEach((ele) => {
      let sourceXML = SourceXML[0].palleteItems[shapesMappings[ele]];
      let result = updatePalleteItemsIds(sourceXML, callActivityCounter);
      palleteItems += result.updatedXML;
      callActivityCounter = result.callActivityCounter;
    });

    function updateSequenceFlowIds(
      xmlString,
      sequenceFlowCounter,
      requireData
    ) {
      const options = {
        ignoreAttributes: false, // Parse attributes as well
        attributeNamePrefix: "@_", // Prefix for attribute names
      };

      // Parse XML string to JSON object
      const parser = new XMLParser(options);
      let jsonObj = parser.parse(xmlString);
      const RD = parser.parse(requireData, options);

      const elementMap = {};

      // Build a map of elements with their IDs and incoming/outgoing values
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

      // Example manipulation: Update sequenceFlow id attribute
      if (jsonObj && jsonObj["bpmn2:sequenceFlow"]) {
        jsonObj["bpmn2:sequenceFlow"][
          "@_id"
        ] = `${jsonObj["bpmn2:sequenceFlow"]["@_id"]}${sequenceFlowCounter}`;

        const id = jsonObj["bpmn2:sequenceFlow"]["@_id"];

        // Find and update sourceRef and targetRef
        Object.values(elementMap).forEach((parent) => {
          if (parent["bpmn2:outgoing"] && parent["bpmn2:outgoing"] === id) {
            jsonObj["bpmn2:sequenceFlow"]["@_sourceRef"] = parent["@_id"];
          }
          if (parent["bpmn2:incoming"] && parent["bpmn2:incoming"] === id) {
            jsonObj["bpmn2:sequenceFlow"]["@_targetRef"] = parent["@_id"];
          }
        });

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

    for (let i = 1; i <= shapeArray.length + 1; i++) {
      let result = updateSequenceFlowIds(
        SourceXML[0].sequenceFlow,
        sequenceFlowCounter,
        requireData
      );
      sequenceFlows += result.updatedXML;
      sequenceFlowCounter = result.sequenceFlowCounter;
    }

    return `<bpmn2:process id="Process_1" name="Integration Process">${extensionElements}${events}${palleteItems}${sequenceFlows}</bpmn2:process>`;
  };

  // Function to create BPMPlane_1 part
  const createBPMPlane_1 = () => {
    let bpmnShapes = SourceXML[4].BPMNDiagram.defaultBPMNShape;

    for (let i = 1; i <= shapeArray.length; i++) {
      const bpmnElement = `CallActivity_${i}`;
      const id = `BPMNShape_CallActivity_${i}`;

      // Construct each BPMNShape element with updated attributes
      bpmnShapes += `
          <bpmndi:BPMNShape bpmnElement="${bpmnElement}" id="${id}">
              <dc:Bounds height="60.0" width="100.0" x="412.0" y="132.0"/>
          </bpmndi:BPMNShape>
      `;
    }

    let bpmnEdges = SourceXML[4].BPMNDiagram.defaultBPMNEdge;

    for (let i = 1; i <= shapeArray.length + 1; i++) {
      const bpmnElement = `SequenceFlow_${i}`;
      const id = `BPMNEdge_SequenceFlow_${i}`;

      // Construct each BPMNShape element with updated attributes
      bpmnEdges += `
          <bpmndi:BPMNEdge bpmnElement="${bpmnElement}" id="${id}" sourceElement="" targetElement="">
                <di:waypoint x="308.0" xsi:type="dc:Point" y="160.0"/>
                <di:waypoint x="462.0" xsi:type="dc:Point" y="160.0"/>
          </bpmndi:BPMNEdge>
      `;
    }
    return `<bpmndi:BPMNPlane bpmnElement="Collaboration_1" id="BPMNPlane_1">${bpmnShapes}${bpmnEdges}</bpmndi:BPMNPlane>`;
  };

  // Function to create BPMNDiagram part
  const createBPMNDiagram = (bpmPlane_1) => {
    return `<bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Default Collaboration Diagram">${bpmPlane_1}</bpmndi:BPMNDiagram>`;
  };

  const generateIflowXML = () => {
    const defaultXMLCode = `<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:ifl="http:///com.sap.ifl.model/Ifl.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1">`;
    const collaboration = createCollaboration();
    const process = createProcess();
    const bpmPlane_1 = createBPMPlane_1();
    const bpmnDiagram = createBPMNDiagram(bpmPlane_1);

    const iflowXMLCode = `${defaultXMLCode}${collaboration}${process}${bpmnDiagram}</bpmn2:definitions>`;
    return iflowXMLCode;
  };

  const getConnectorDetails = async () => {
    if (selectedProcess) {
      alert(`Fetching Metadata for Process ID: ${selectedProcess}`);
      console.log(boomiaccountId, selectedProcess);
      try {
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
        })
      } catch (error) {
        console.error("Error fetching processes:", error);
        alert(
          "Something Went wrong!...Please check the Account ID or Associated Credentials!"
        );
      }
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
    })
  };

  const ProceedForMigration = () => {
    const defualtProjectFiles = buildDefaultProjectFiles();
    const xmlContent = generateIflowXML();
    const blob = new Blob([xmlContent], { type: "text/xml" });
    setIflowXML(blob);
    setProceedClicked(true);
    handleStepNext();
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

    zip.folder("src").folder("main").folder("resources").folder("json");

    zip.folder("src").folder("main").folder("resources").folder("mapping");

    if (scriptsArray.length > 0) {
      scriptsArray.forEach((scriptObj, i) => {
        let extension = "";
        if (scriptObj.language === "groovy") {
          extension = ".groovy";
        } else if (scriptObj.language === "javascript") {
          extension = ".js";
        }
        zip
          .folder("src")
          .folder("main")
          .folder("resources")
          .folder("script")
          .file(`script${i + 1}${extension}`, scriptObj.scriptBlobContent);
      });
    }

    zip.folder("src").folder("main").folder("resources").folder("xsd");

    zip.folder("src").folder("main").folder("resources").folder("edmx");

    zip.folder("src").folder("main").folder("resources").folder("wsdl");

    // Generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${dynamicName}.zip`);
    });
  };

  const submitFormData =async(e) =>{
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

    zip.generateAsync({ type: "blob" }).then((content) => {
      console.log("Generated Blob:", content); // Debugging step
    
      const reader = new FileReader();
    
      reader.onloadend = () => {
        const base64Zip = reader.result.split(",")[1]; // Extract Base64 part
        console.log("Base64 Encoded Zip:", base64Zip); // Debugging step
    
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
    
    const apiUrl = "http://localhost:5000/migrate"; // Replace with the actual API endpoint
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("API Response:", responseData);
        return { success: true, message: "Form submitted successfully!" };
        setPopupMessage("Migrated successfully!");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        return { success: false, message: errorData.message || "Form submission failed." };
        setPopupMessage("Migration failed. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      return { success: false, message: "An error occurred while submitting the form." };
    }
  }

  const ReuseScripts = async () => {
    if (selectedProcess) {
      alert(`Fetching Metadata for Process ID: ${selectedProcess}`);
      try {
        const url =
          "https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getallscripts";
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
        setScriptsArray(response.data);
        console.log(response);
        if (scriptsArray.length > 0) {
          const updatedScriptsArray = scriptsArray.map((scriptObj) => {
            let mimeType;
            if (scriptObj.language === "groovy") {
              mimeType = "application/x-groovy";
            } else if (scriptObj.language === "javascript") {
              mimeType = "application/javascript";
            } else {
              mimeType = "text/plain"; // Default fallback MIME type
            }

            const blob = new Blob([scriptObj.script], { type: mimeType });
            return { ...scriptObj, scriptBlobContent: blob };
          });
          console.log(updatedScriptsArray);
          setScriptsArray(updatedScriptsArray);
          setStepButtonStatus({
            CDStatus: true,
            CCDStatus: true,
            RRStatus: true,
          })
        }
      } catch (error) {
        console.error("Error fetching scripts:", error);
        alert(
          "Something Went wrong!...Please check the Account ID/processID or Associated Credentials!"
        );
      }
    } else {
      alert("Please enter Process ID.");
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setShapeArray([]);
    setBoomiProcessData(SpecificProcess); // Reset to initial value
    setFirstPart([]); // Reset to initial value
    setSecondPart([]); // Reset to initial value
    setConnectors({ sender: [], receiver: [] }); // Reset to initial value
    setShapeArray([]); // Reset to initial value
    setShapeCounter(0); // Reset to initial value
    handleStepReset();
  };

  // console.log(shapeArray);
  // console.log(firstPart);
  // console.log(connectors);
  // console.log(shapeCounter);
  // console.log(dynamicName);
  console.log(connectorDetails);
  console.log(updatedConnectorDetails);

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
                  <div >
                    <div className="centerContainer">
                    {renderStepContent(activeStepCount)}
                    </div>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
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
                  <button onClick={() => setisMigrate((prevState) => !prevState)}>Migrate</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      { 
        isMigrate && (
          <div className="app-container">
          <h1>CPI Configuration Form</h1>
          <form className="form-container" onSubmit={submitFormData}>
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
            <label>
              IFlow ID:
              <input
                type="text"
                name="iflowId"
                value={formData.iflowId}
                onChange={handleChange}
                required
              />
            </label>
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
            <button type="submit">Submit</button>
          </form>
    
          {/* Popup for success or failure message */}
          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <p>{popupMessage}</p>
                <button onClick={closePopup}>Close</button>
              </div>
            </div>
          )}
        </div>
        )
      }

    </>
  );
};

export default Modal;
