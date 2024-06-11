import { useState, useEffect } from 'react';


function CreateFiles() {
  const [MetaInfofileContent, setMetaInfoFileContent] = useState('');
  const [MFContent, setMFContent] = useState('');
  const [projectxmlFile, setProjectXmlFile] = useState(null);
  const [dynamicName, setDynamicName] = useState('');
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
    const MIfileContent = `#Store metaifo properties\n#${formattedDateTime}\ndescription\n`;
    const blob = new Blob([MIfileContent], { type: 'text/plain' });
    setMetaInfoFileContent(blob);

    const PM1 = `#${formattedDateTime}`;
    const blob1 = new Blob([PM1], { type: 'text/plain' });
    setPM1Content(blob1)
  }, [MetaInfofileContent,PM1Content]);


  useEffect(() => {
    const xmlContent =TemplateData.projectData;
    const blob = new Blob([xmlContent], { type: 'text/xml' });
    setProjectXmlFile(blob);
  }, [dynamicName]);

  useEffect(() => {
    const xmlContent =TemplateData.parameters;
    const blob = new Blob([xmlContent], { type: 'text/xml' });
    setPM2Content(blob);
  }, [dynamicName]);

  useEffect(() => {
    const MFfileContent =TemplateData.manifestdata;
    const blob = new Blob([MFfileContent], { type: 'text/xml' });
    setMFContent(blob);
  }, [dynamicName]);

  useEffect(() => {
    const xmlContent =TemplateData.projectData;
    const blob = new Blob([xmlContent], { type: 'text/xml' });
    setIflowXML(blob);
  }, [dynamicName]);

  const handleMetaInfoDownload = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(MetaInfofileContent);
    link.download = 'metaifo.prop';
    link.click();
  };

  const handlePM1Download = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(PM1Content);
    link.download = 'parameters.prop';
    link.click();
  };

  const handlePM2Download = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(PM2Content);
    link.download = 'parameters.propdef';
    link.click();
  };

  const handleProjectXMLDownload = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(projectxmlFile);
    link.download = `${dynamicName}.project`;
    link.click();
  };

  const handleMFDownload = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(MFContent);
    link.download = `${dynamicName}.MF`;
    link.click();
  };

  const handleIflowXMLDownload = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(iflowXML);
    link.download = `${dynamicName}.iflw`;
    link.click();
  };

  return (
    <div>
      <button onClick={handleMetaInfoDownload}> metaifo.prop</button>
      <button onClick={handleProjectXMLDownload}> ${dynamicName}.project</button>
      <button onClick={handleMFDownload}> ${dynamicName}.MF</button>
      <button onClick={handlePM1Download}> parameters.prop</button>
      <button onClick={handlePM2Download}> parameters.propdef</button>
      <button onClick={handleIflowXMLDownload}> ${dynamicName}.iflw</button>
      <input
        type="text"
        value={dynamicName}
        onChange={(e) => setDynamicName(e.target.value)}
        placeholder="Enter a dynamic name"
      />
    </div>
  );
}

export default CreateFiles;