import React, { useState, useEffect } from "react";
import "./Modal.css";
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
        <button onClick={getConnectorDetails}> GetDetails </button>
      </div>
    );
  };
  const StepThree = () => (
    <button onClick={classifyConnectorData}>Classify Details</button>
  );
  const StepFour = () => {
    return (
      <div>
        <button onClick={ReuseScripts} id="cancelbtn">
          Reuse Resources
        </button>
        <p>
          Note: Resources like Message mappings/User Credentials/certificates
          are not directly migrated in this process, need manual intervention.
        </p>
      </div>
    );
  };

  const CompleteStep = () => (
    <div>
      <h3>Please proceed for Iflow Creation! </h3>
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

  const Migrate = async () => {
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

    // Generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      const base64Zip = btoa(
        String.fromCharCode.apply(null, new Uint8Array(content))
      );
    });

    try {
      const url =
        "https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/api/v1/IntegrationDesigntimeArtifacts";
      const body = {
        Name: "Migrated_02",
        Id: "Migrated_02",
        PackageId: "BoomiMigratedProcessIFlows",
        ArtifactContent:
          "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",
      };
      const response = await axios.post(url, body, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      console.log(response.data);
      alert("Process Migrated Successfully!");
      handleClose();
    } catch (error) {
      console.error("Error fetching processes:", error);
      alert(
        "Something Went wrong...Please check the Account ID or Associated Credentials!"
      );
    }
  };

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
                  <div>
                    {renderStepContent(activeStepCount)}
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
                  <button onClick={Migrate}>Migrate</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
