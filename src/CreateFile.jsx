import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {SourceXML} from './CPISourceXML';

function CreateFiles() {
  const [MetaInfofileContent, setMetaInfoFileContent] = useState('');
  const [MFContent, setMFContent] = useState('');
  const [projectxmlFile, setProjectXmlFile] = useState(null);
  const [dynamicName, setDynamicName] = useState('Test01');
  const [PM1Content, setPM1Content] = useState('');
  const [PM2Content, setPM2Content] = useState('');
  const [iflowXML, setIflowXML] = useState('');


  const TemplateData = {
    "manifestdata": `Manifest-Version: 1.0\nBundle-ManifestVersion: 2\nBundle-Name: ${dynamicName}\nBundle-SymbolicName: ${dynamicName}; singleton:=true\nBundle-Version: 1.0.1\nSAP-BundleType: IntegrationFlow\nSAP-NodeType: IFLMAP\nSAP-RuntimeProfile: iflmap\nImport-Package: com.sap.esb.application.services.cxf.interceptor,com.sap.esb.security,com.sap.it.op.agent.api,com.sap.it.op.agent.collector.camel,com.sap.it.op.agent.collector.cxf,com.sap.it.op.agent.mpl,javax.jms,javax.jws,javax.wsdl,javax.xml.bind.annotation,javax.xml.namespace,javax.xml.ws,org.apache.camel;version=\"2.8\",org.apache.camel.builder;version=\"2.8\",org.apache.camel.builder.xml;version=\"2.8\",org.apache.camel.component.cxf,org.apache.camel.model;version=\"2.8\",org.apache.camel.processor;version=\"2.8\",org.apache.camel.processor.aggregate;version=\"2.8\",org.apache.camel.spring.spi;version=\"2.8\",org.apache.commons.logging,org.apache.cxf.binding,org.apache.cxf.binding.soap,org.apache.cxf.binding.soap.spring,org.apache.cxf.bus,org.apache.cxf.bus.resource,org.apache.cxf.bus.spring,org.apache.cxf.buslifecycle,org.apache.cxf.catalog,org.apache.cxf.configuration.jsse;version=\"2.5\",org.apache.cxf.configuration.spring,org.apache.cxf.endpoint,org.apache.cxf.headers,org.apache.cxf.interceptor,org.apache.cxf.management.counters;version=\"2.5\",org.apache.cxf.message,org.apache.cxf.phase,org.apache.cxf.resource,org.apache.cxf.service.factory,org.apache.cxf.service.model,org.apache.cxf.transport,org.apache.cxf.transport.common.gzip,org.apache.cxf.transport.http,org.apache.cxf.transport.http.policy,org.apache.cxf.workqueue,org.apache.cxf.ws.rm.persistence,org.apache.cxf.wsdl11,org.osgi.framework;version=\"1.6.0\",org.slf4j;version=\"1.6\",org.springframework.beans.factory.config;version=\"3.0\",com.sap.esb.camel.security.cms,org.apache.camel.spi,com.sap.esb.webservice.audit.log,com.sap.esb.camel.endpoint.configurator.api,com.sap.esb.camel.jdbc.idempotency.reorg,javax.sql,org.apache.camel.processor.idempotent.jdbc,org.osgi.service.blueprint;version=\"[1.0.0,2.0.0)\"\nImport-Service: com.sap.esb.webservice.audit.log.AuditLogger,com.sap.esb.security.KeyManagerFactory;multiple:=false,com.sap.esb.security.TrustManagerFactory;multiple:=false,javax.sql.DataSource;multiple:=false;filter=\"(dataSourceName=default)\",org.apache.cxf.ws.rm.persistence.RMStore;multiple:=false,com.sap.esb.camel.security.cms.SignatureSplitter;multiple:=false\nOrigin-Bundle-Name: ${dynamicName}\nOrigin-Bundle-SymbolicName: ${dynamicName}\n`,
    "projectData": `<?xml version=\"1.0\" encoding=\"UTF-8\"?><projectDescription>\n   <name>${dynamicName}</name>\n   <comment/>\n   <projects/>\n   <buildSpec>\n      <buildCommand>\n         <name>org.eclipse.jdt.core.javabuilder</name>\n         <arguments/>\n      </buildCommand>\n   </buildSpec>\n   <natures>\n      <nature>org.eclipse.jdt.core.javanature</nature>\n      <nature>com.sap.ide.ifl.project.support.project.nature</nature>\n      <nature>com.sap.ide.ifl.bsn</nature>\n   </natures>\n</projectDescription>`,
    "parameters":`<?xml version="1.0" encoding="UTF-8" standalone="no"?><parameters><param_references/></parameters>`
  };

  useEffect(() => {
    const currentDate = new Date();
    const day = currentDate.toLocaleString('en-US', { weekday: 'short' });
    const month = currentDate.toLocaleString('en-US', { month: 'short' });
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const formattedDateTime = `${day} ${month} ${date} ${hours}:${minutes}:${seconds} UTC ${year}`;
    const MIfileContent = `#Store metainfo properties\n#${formattedDateTime}\ndescription\n`;
    const blob = new Blob([MIfileContent], { type: 'text/plain' });
    setMetaInfoFileContent(blob);

    const PM1 = `#${formattedDateTime}`;
    const blob1 = new Blob([PM1], { type: 'text/plain' });
    setPM1Content(blob1)
  }, []);

  useEffect(() => {
    const xmlContent =TemplateData.projectData;
    const blob = new Blob([xmlContent], { type: 'text/xml' });
    setProjectXmlFile(blob);
  }, []);

  useEffect(() => {
    const xmlContent =TemplateData.parameters;
    const blob = new Blob([xmlContent], { type: 'text/xml' });
    setPM2Content(blob);
  }, []);

  useEffect(() => {
    const MFfileContent =TemplateData.manifestdata;
    const blob = new Blob([MFfileContent], { type: 'text/xml' });
    setMFContent(blob);
  }, []);

  // Function to create collaboration part
const createCollaboration = () => {
  const extensionElements = SourceXML[2].Collaboration.ExtensinElements;
  const participants = `${SourceXML[2].participants.Sender}${SourceXML[2].participants.Receiver}${SourceXML[2].participants.IntegrationProcess}`;
  const messageFlow = `${SourceXML[1].SenderAdaptors.sftp}${SourceXML[1].ReceiverAdaptors.sftp}`;
  return `<bpmn2:collaboration id="Collaboration_1" name="Default Collaboration">${extensionElements}${participants}${messageFlow}</bpmn2:collaboration>`;
};

// Function to create process part
const createProcess = () => {
  const extensionElements = SourceXML[3].IntegrationProcess.extensionElements;
  const events = `${SourceXML[0].events.StartEvent}${SourceXML[0].events.EndEvent}`;
  const callActivity = `${SourceXML[0].palleteItems.contentModifier}${SourceXML[0].palleteItems.messageMapping}${SourceXML[0].palleteItems.RequestReply}`;
  const sequenceFlow = SourceXML[0].sequenceFlow;
  return `<bpmn2:process id="Process_1" name="Integration Process">${extensionElements}${events}${callActivity}${sequenceFlow} </bpmn2:process>`;
};

// Function to create BPMPlane_1 part
const createBPMPlane_1 = () => {
  const bpmnShape = `${SourceXML[4].BPMNDiagram.BPMNShape}`;
  const bpmnEdge  =  `${SourceXML[4].BPMNDiagram.B}`;
  return `<bpmndi:BPMNPlane bpmnElement="Collaboration_1" id="BPMNPlane_1">${bpmnShape}${bpmnEdge}</bpmndi:BPMNPlane>`;
};

// Function to create BPMNDiagram part
const createBPMNDiagram = (bpmPlane_1, bpmPlane_2) => {
  return `<bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Default Collaboration Diagram">${bpmPlane_1}${bpmPlane_2}</bpmndi:BPMNDiagram>`;
};


const generateIflowXML = () => {
  const defaultXMLCode = `<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:ifl="http:///com.sap.ifl.model/Ifl.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1">`
  const collaboration = createCollaboration();
  const process = createProcess();
  const bpmPlane_1 = createBPMPlane_1();
  const bpmPlane_2 = ""; // Assuming BPMPlane_2 is not defined in the requirement
  const bpmnDiagram = createBPMNDiagram(bpmPlane_1, bpmPlane_2);

  const iflowXMLCode = `${defaultXMLCode}${collaboration}${process}${bpmnDiagram}</bpmn2:definitions>`;
  return iflowXMLCode;
};

const iflowXMLCode = generateIflowXML();

  useEffect(() => {
    const xmlContent =iflowXMLCode;
    const blob = new Blob([xmlContent], { type: 'text/xml' });
    setIflowXML(blob);
  }, []);

  const createZip = () => {
    const zip = new JSZip();
    
    // Create folders and add files
    zip.file("metainfo.prop", MetaInfofileContent);
    zip.file(".project", projectxmlFile);
    zip.folder("src").folder("main").folder("resources").folder("scenarioflows").folder("integrationflow").file(`${dynamicName}.iflw`, iflowXML);
    zip.folder("META-INF").file("MANIFEST.MF", MFContent);
    zip.folder("src").folder("main").folder("resources").file("parameters.prop", PM1Content)
    zip.folder("src").folder("main").folder("resources").file("parameters.propdef", PM2Content)

    // Generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      const base64Zip = btoa(String.fromCharCode.apply(null, new Uint8Array(content)));
      saveAs(content, `${dynamicName}.zip`);
    });
  };


  return (
    <div>
      <input
        type="text"
        value={dynamicName}
        onChange={(e) => setDynamicName(e.target.value)}
        placeholder="Enter a dynamic name"
      />
     <button onClick={createZip}>Download ZIP</button>
     
    </div>
  );
}

export default CreateFiles;