
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

export function HTTP_Receiver(sourceXML, targetConnectorData) {
  const options = {
    ignoreAttributes: false, // Parse attributes as well
    attributeNamePrefix: "@_", // Prefix for attribute names
  };

  // Parse XML string to JSON object
  const parser = new XMLParser(options);
  let jsonObjSourceXML = parser.parse(sourceXML);
  let jsonObjectConnectorData = parser.parse(targetConnectorData);

   // Extract components
   const components = jsonObjectConnectorData['bns:Component'];
   
   if (components.length < 2) {
     throw new Error("Expected at least two bns:Component elements");
   }

    // Extract data from the first component
  const firstComponent = components[1];
  const componentName = firstComponent['@_name'];
  const httpMethod = firstComponent['bns:object']['Operation']['Configuration']['HttpSendAction']['@_methodType'];

  // Extract data from the second component
  const secondComponent = components[0];
  const address = secondComponent['bns:object']['HttpSettings']['@_url'];
  const authenticationType = secondComponent['bns:object']['HttpSettings']['@_authenticationType'];
  const userName = secondComponent['bns:object']['HttpSettings']['AuthSettings']['@_user'];

  const targetXML = `
    <bpmn2:messageFlow id="MessageFlow_" name="${componentName}" sourceRef="EndEvent_1" targetRef="Participant_2">
      <bpmn2:extensionElements>
        ${Object.entries(jsonObjSourceXML['bpmn2:messageFlow']['bpmn2:extensionElements']['ifl:property']).map(([, prop]) => {
          const key = prop['key'];
          const value = prop['value'];

          switch (key) {
            case 'Name':
              return `
                <ifl:property>
                  <key>Name</key>
                  <value>${componentName}</value>
                </ifl:property>
              `;
            case 'httpMethod':
              return `
                <ifl:property>
                  <key>httpMethod</key>
                  <value>${httpMethod}</value>
                </ifl:property>
              `;
            case 'httpAddressWithoutQuery':
              return `
                <ifl:property>
                  <key>httpAddressWithoutQuery</key>
                  <value>${address}</value>
                </ifl:property>
              `;
            case 'authenticationMethod':
              return `
                <ifl:property>
                  <key>authenticationMethod</key>
                  <value>${authenticationType}</value>
                </ifl:property>
              `;
            case 'credentialName':
              return `
                <ifl:property>
                  <key>credentialName</key>
                  <value>${userName}</value>
                </ifl:property>
              `;
            default:
              return `
                <ifl:property>
                  <key>${key}</key>
                  <value>${value}</value>
                </ifl:property>
              `;
          }
        }).join('')}
      </bpmn2:extensionElements>
    </bpmn2:messageFlow>
  `;

  // Convert JSON object back to XML string
  const builder = new XMLBuilder(options);
  const updatedSourceXML = builder.build(parser.parse(targetXML));

  return updatedSourceXML;
}

export function FTP_Sender(sourceXML,targetConnectorData){

    const options = {
        ignoreAttributes: false, // Parse attributes as well
        attributeNamePrefix: "@_", // Prefix for attribute names
      };
    
      // Parse XML string to JSON object
      const parser = new XMLParser(options);
      let jsonObjSourceXML = parser.parse(sourceXML);
      let jsonObjectConnectorData = parser.parse(targetConnectorData);
    
       // Extract components
       const components = jsonObjectConnectorData['bns:Component'];
       
       console.log(components)
       
       if (components.length < 2) {
         throw new Error("Expected at least two bns:Component elements");
       }
    
        // Extract data from the first component
      const firstComponent = components[1];
      const componentName = firstComponent['@_name'];
      const path = firstComponent['bns:object']['Operation']['Configuration']['FTPGetAction']['@_remoteDirectory'];
      const fileName = firstComponent['bns:object']['Operation']['Configuration']['FTPGetAction']['@_fileToMove'];
      const ArchieveDir = firstComponent['bns:object']['Operation']['Archiving']['@_directory'];
    
      // Extract data from the second component
      const secondComponent = components[0];
      const connectionMode = secondComponent['bns:object']['FTPSettings']['@_connectionMode'];
      const host = secondComponent['bns:object']['FTPSettings']['@_host'];
      const port = secondComponent['bns:object']['FTPSettings']['@_port'];
      const userName = secondComponent['bns:object']['FTPSettings']['AuthSettings']['@_user'];
    
      const targetXML = `
        <bpmn2:messageFlow id="MessageFlow_" name="${componentName}" sourceRef="Participant_1" targetRef="StartEvent_1">
            <bpmn2:extensionElements>
            ${Object.entries(jsonObjSourceXML['bpmn2:messageFlow']['bpmn2:extensionElements']['ifl:property']).map(([, prop]) => {
              const key = prop['key'];
              const value = prop['value'];
    
              switch (key) {
                case 'Name':
                  return `
                    <ifl:property>
                      <key>Name</key>
                      <value>${componentName}</value>
                    </ifl:property>
                  `;
                case 'fileName':
                  return `
                    <ifl:property>
                      <key>fileName</key>
                      <value>${fileName}</value>
                    </ifl:property>
                  `;
                case 'path':
                  return `
                    <ifl:property>
                      <key>path</key>
                      <value>${path}</value>
                    </ifl:property>
                  `;
                case 'host':
                  return `
                    <ifl:property>
                      <key>host</key>
                      <value>${host}</value>
                    </ifl:property>
                  `;
                case 'file.move':
                    return `
                      <ifl:property>
                        <key>file.move</key>
                        <value>${ArchieveDir}</value>
                      </ifl:property>
                    `;
                case 'credential_name':
                  return `
                    <ifl:property>
                      <key>credential_name</key>
                      <value>${userName}</value>
                    </ifl:property>
                  `;
                case 'scheduleKey':
                    return `
                      <ifl:property>
                        <key>scheduleKey</key>
                        <value>&lt;row&gt;&lt;cell&gt;dayValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;monthValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;yearValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;dateType&lt;/cell&gt;&lt;cell&gt;DAILY&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;secondValue&lt;/cell&gt;&lt;cell&gt;0&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;minutesValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;hourValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;toInterval&lt;/cell&gt;&lt;cell&gt;24&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;fromInterval&lt;/cell&gt;&lt;cell&gt;0&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;OnEverySecond&lt;/cell&gt;&lt;cell&gt;10&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;timeType&lt;/cell&gt;&lt;cell&gt;TIME_SECOND_INTERVAL&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;timeZone&lt;/cell&gt;&lt;cell&gt;( UTC 0:00 ) Greenwich Mean Time(Etc/GMT)&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;throwExceptionOnExpiry&lt;/cell&gt;&lt;cell&gt;true&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;second&lt;/cell&gt;&lt;cell&gt;0/10&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;minute&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;hour&lt;/cell&gt;&lt;cell&gt;0-24&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;day_of_month&lt;/cell&gt;&lt;cell&gt;?&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;month&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;dayOfWeek&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;year&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;startAt&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;endAt&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;attributeBehaviour&lt;/cell&gt;&lt;cell&gt;isRunOnceRequired,isScheduleOnDayRequired,isScheduleRecurRequired&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;triggerType&lt;/cell&gt;&lt;cell&gt;cron&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;noOfSchedules&lt;/cell&gt;&lt;cell&gt;1&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;schedule1&lt;/cell&gt;&lt;cell&gt;0/10+*+0-23+?+*+*+*&amp;amp;trigger.timeZone=Etc/GMT&lt;/cell&gt;&lt;/row&gt;</value>
                      </ifl:property>
                    `;
                default:
                  return `
                    <ifl:property>
                      <key>${key}</key>
                      <value>${value}</value>
                    </ifl:property>
                  `;
              }
            }).join('')}
          </bpmn2:extensionElements>
        </bpmn2:messageFlow>
      `;
    
      // Convert JSON object back to XML string
      const builder = new XMLBuilder(options);
      const updatedSourceXML = builder.build(parser.parse(targetXML));
    
      return updatedSourceXML;
}

export function SFTP_Receiver(sourceXML,targetConnectorData){

    const options = {
        ignoreAttributes: false, // Parse attributes as well
        attributeNamePrefix: "@_", // Prefix for attribute names
      };
    
      // Parse XML string to JSON object
      const parser = new XMLParser(options);
      let jsonObjSourceXML = parser.parse(sourceXML);
      let jsonObjectConnectorData = parser.parse(targetConnectorData);
    
       // Extract components
       const components = jsonObjectConnectorData['bns:Component'];
       
       if (components.length < 2) {
         throw new Error("Expected at least two bns:Component elements");
       }
    
        // Extract data from the first component
      const firstComponent = components[1];
      const componentName = firstComponent['@_name'];
      const ArchieveDir = firstComponent['bns:object']['Operation']['Archiving']['@_directory'];
      const path = firstComponent['bns:object']['Operation']['Configuration']['SFTPSendAction']['@_remoteDirectory'];
      const moveToDirectory = firstComponent['bns:object']['Operation']['Configuration']['SFTPSendAction']['@_moveToDirectory'];
    
      // Extract data from the second component
      const secondComponent = components[0];
      const host = secondComponent['bns:object']['SFTPSettings']['@_host'];
      const port = secondComponent['bns:object']['SFTPSettings']['@_port'];
      const userName = secondComponent['bns:object']['SFTPSettings']['AuthSettings']['@_user'];
    
      const targetXML = `
        <bpmn2:messageFlow id="MessageFlow_" name="${componentName}" sourceRef="EndEvent_1" targetRef="Participant_2">
            <bpmn2:extensionElements>
            ${Object.entries(jsonObjSourceXML['bpmn2:messageFlow']['bpmn2:extensionElements']['ifl:property']).map(([, prop]) => {
              const key = prop['key'];
              const value = prop['value'];
    
              switch (key) {
                case 'Name':
                  return `
                    <ifl:property>
                      <key>Name</key>
                      <value>${componentName}</value>
                    </ifl:property>
                  `;
                case 'fileName':
                  return `
                    <ifl:property>
                      <key>fileName</key>
                      <value></value>
                    </ifl:property>
                  `;
                case 'path':
                  return `
                    <ifl:property>
                      <key>path</key>
                      <value>${path}</value>
                    </ifl:property>
                  `;
                case 'host':
                  return `
                    <ifl:property>
                      <key>host</key>
                      <value>${host}</value>
                    </ifl:property>
                  `;
                case 'credentialName':
                  return `
                    <ifl:property>
                      <key>credentialName</key>
                      <value>${userName}</value>
                    </ifl:property>
                  `;
                default:
                  return `
                    <ifl:property>
                      <key>${key}</key>
                      <value>${value}</value>
                    </ifl:property>
                  `;
              }
            }).join('')}
          </bpmn2:extensionElements>
        </bpmn2:messageFlow>
      `;
    
      // Convert JSON object back to XML string
      const builder = new XMLBuilder(options);
      const updatedSourceXML = builder.build(parser.parse(targetXML));
    
      return updatedSourceXML;
}

export function SFTP_Sender(sourceXML,targetConnectorData){

    const options = {
        ignoreAttributes: false, // Parse attributes as well
        attributeNamePrefix: "@_", // Prefix for attribute names
      };
    
      // Parse XML string to JSON object
      const parser = new XMLParser(options);
      let jsonObjSourceXML = parser.parse(sourceXML);
      let jsonObjectConnectorData = parser.parse(targetConnectorData);
    
       // Extract components
       const components = jsonObjectConnectorData['bns:Component'];
       
       if (components.length < 2) {
         throw new Error("Expected at least two bns:Component elements");
       }
    
        // Extract data from the first component
      const firstComponent = components[1];
      const componentName = firstComponent['@_name'];
      const ArchieveDir = firstComponent['bns:object']['Operation']['Archiving']['@_directory'];
      const path = firstComponent['bns:object']['Operation']['Configuration']['SFTPGetAction']['@_remoteDirectory'];
      const fileName = firstComponent['bns:object']['Operation']['Configuration']['SFTPGetAction']['@_fileToMove'];
      const moveToDirectory = firstComponent['bns:object']['Operation']['Configuration']['SFTPGetAction']['@_moveToDirectory'];
    
      // Extract data from the second component
      const secondComponent = components[0];
      const host = secondComponent['bns:object']['SFTPSettings']['@_host'];
      const port = secondComponent['bns:object']['SFTPSettings']['@_port'];
      const userName = secondComponent['bns:object']['SFTPSettings']['AuthSettings']['@_user'];
    
      const targetXML = `
        <bpmn2:messageFlow id="MessageFlow_" name="${componentName}" sourceRef="Participant_1" targetRef="StartEvent_1">
            <bpmn2:extensionElements>
            ${Object.entries(jsonObjSourceXML['bpmn2:messageFlow']['bpmn2:extensionElements']['ifl:property']).map(([, prop]) => {
              const key = prop['key'];
              const value = prop['value'];
    
              switch (key) {
                case 'Name':
                  return `
                    <ifl:property>
                      <key>Name</key>
                      <value>${componentName}</value>
                    </ifl:property>
                  `;
                case 'fileName':
                  return `
                    <ifl:property>
                      <key>fileName</key>
                      <value>${fileName}</value>
                    </ifl:property>
                  `;
                case 'path':
                  return `
                    <ifl:property>
                      <key>path</key>
                      <value>${path}</value>
                    </ifl:property>
                  `;
                case 'host':
                  return `
                    <ifl:property>
                      <key>host</key>
                      <value>${host}</value>
                    </ifl:property>
                  `;
                case 'credentialName':
                  return `
                    <ifl:property>
                      <key>credentialName</key>
                      <value>${userName}</value>
                    </ifl:property>
                  `;
                default:
                  return `
                    <ifl:property>
                      <key>${key}</key>
                      <value>${value}</value>
                    </ifl:property>
                  `;
              }
            }).join('')}
          </bpmn2:extensionElements>
        </bpmn2:messageFlow>
      `;
    
      // Convert JSON object back to XML string
      const builder = new XMLBuilder(options);
      const updatedSourceXML = builder.build(parser.parse(targetXML));
    
      return updatedSourceXML;
}

export function MAIL_Receiver(sourceXML,targetConnectorData){

  const options = {
      ignoreAttributes: false, // Parse attributes as well
      attributeNamePrefix: "@_", // Prefix for attribute names
    };
  
    // Parse XML string to JSON object
    const parser = new XMLParser(options);
    let jsonObjSourceXML = parser.parse(sourceXML);
    let jsonObjectConnectorData = parser.parse(targetConnectorData);
  
     // Extract components
     const components = jsonObjectConnectorData['bns:Component'];
     
     if (components.length < 2) {
       throw new Error("Expected at least two bns:Component elements");
     }
  
      // Extract data from the first component
    const firstComponent = components[1];
    const componentName = firstComponent['@_name'];
    const ArchieveDir = firstComponent['bns:object']['Operation']['Archiving']['@_directory'];
    const bodyContentType = firstComponent['bns:object']['Operation']['Configuration']['MailSendAction']['@_bodyContentType'];
    const dataContentType = firstComponent['bns:object']['Operation']['Configuration']['MailSendAction']['@_dataContentType'];
    const disposition = firstComponent['bns:object']['Operation']['Configuration']['MailSendAction']['@_disposition'];
    const from = firstComponent['bns:object']['Operation']['Configuration']['MailSendAction']['@_from'];
    const to = firstComponent['bns:object']['Operation']['Configuration']['MailSendAction']['@_to'];
    const subject = firstComponent['bns:object']['Operation']['Configuration']['MailSendAction']['@_subject'];
  
    // Extract data from the second component
    const secondComponent = components[0];
    const host = secondComponent['bns:object']['MailSettings']['@_host'];
    const port = secondComponent['bns:object']['MailSettings']['@_port'];
    const userName = secondComponent['bns:object']['MailSettings']['AuthSettings']['@_user'];
  
    const targetXML = `
      <bpmn2:messageFlow id="MessageFlow_" name="${componentName}" sourceRef="EndEvent_1" targetRef="Participant_2" >
        <bpmn2:extensionElements>
          ${Object.entries(jsonObjSourceXML['bpmn2:messageFlow']['bpmn2:extensionElements']['ifl:property']).map(([, prop]) => {
            const key = prop['key'];
            const value = prop['value'];
  
            switch (key) {
              case 'Name':
                return `
                  <ifl:property>
                    <key>Name</key>
                    <value>${componentName}</value>
                  </ifl:property>
                `;
              case 'content_type':
                return `
                  <ifl:property>
                    <key>content_type</key>
                    <value>${dataContentType}</value>
                  </ifl:property>
                `;
              case 'subject':
                return `
                  <ifl:property>
                    <key>subject</key>
                    <value>${subject}</value>
                  </ifl:property>
                `;
              case 'server':
                return `
                  <ifl:property>
                    <key>server</key>
                    <value>${host}</value>
                  </ifl:property>
                `;
                case 'from':
                return `
                  <ifl:property>
                    <key>from</key>
                    <value>${from}</value>
                  </ifl:property>
                `;
                case 'to':
                return `
                  <ifl:property>
                    <key>to</key>
                    <value>${to}</value>
                  </ifl:property>
                `;
              case 'user':
                return `
                  <ifl:property>
                    <key>user</key>
                    <value>${userName}</value>
                  </ifl:property>
                `;
              default:
                return `
                  <ifl:property>
                    <key>${key}</key>
                    <value>${value}</value>
                  </ifl:property>
                `;
            }
          }).join('')}
        </bpmn2:extensionElements>
      </bpmn2:messageFlow>
    `;
  
    // Convert JSON object back to XML string
    const builder = new XMLBuilder(options);
    const updatedSourceXML = builder.build(parser.parse(targetXML));
  
    return updatedSourceXML;
}

export function Test(sourceXML,targetConnectorData){

  const options = {
      ignoreAttributes: false, // Parse attributes as well
      attributeNamePrefix: "@_", // Prefix for attribute names
    };
  
    // Parse XML string to JSON object
    const parser = new XMLParser(options);
    let jsonObjSourceXML = parser.parse(sourceXML);
    let jsonObjectConnectorData = parser.parse(targetConnectorData);
  
     // Extract components
     const components = jsonObjectConnectorData['bns:Component'];
     
     if (components.length < 2) {
       throw new Error("Expected at least two bns:Component elements");
     }
  
      // Extract data from the first component
    const firstComponent = components[1];
    const componentName = firstComponent['@_name'];
    const path = firstComponent['bns:object']['Operation']['Configuration']['FTPGetAction']['@_remoteDirectory'];
    const fileName = firstComponent['bns:object']['Operation']['Configuration']['FTPGetAction']['@_fileToMove'];
    const ArchieveDir = firstComponent['bns:object']['Operation']['Archiving']['@_directory'];
  
    // Extract data from the second component
    const secondComponent = components[0];
    const connectionMode = secondComponent['bns:object']['FTPSettings']['@_connectionMode'];
    const host = secondComponent['bns:object']['FTPSettings']['@_host'];
    const port = secondComponent['bns:object']['FTPSettings']['@_port'];
    const userName = secondComponent['bns:object']['FTPSettings']['AuthSettings']['@_user'];
  
    const targetXML = `
      <bpmn2:messageFlow id="MessageFlow_" name="${componentName}" sourceRef="Participant_1" targetRef="StartEvent_1">
          <bpmn2:extensionElements>
          ${Object.entries(jsonObjSourceXML['bpmn2:messageFlow']['bpmn2:extensionElements']['ifl:property']).map(([, prop]) => {
            const key = prop['key'];
            const value = prop['value'];
  
            switch (key) {
              case 'Name':
                return `
                  <ifl:property>
                    <key>Name</key>
                    <value>${componentName}</value>
                  </ifl:property>
                `;
              case 'fileName':
                return `
                  <ifl:property>
                    <key>fileName</key>
                    <value>${fileName}</value>
                  </ifl:property>
                `;
              case 'path':
                return `
                  <ifl:property>
                    <key>path</key>
                    <value>${path}</value>
                  </ifl:property>
                `;
              case 'host':
                return `
                  <ifl:property>
                    <key>host</key>
                    <value>${host}</value>
                  </ifl:property>
                `;
              case 'credentialName':
                return `
                  <ifl:property>
                    <key>credentialName</key>
                    <value>${userName}</value>
                  </ifl:property>
                `;
              default:
                return `
                  <ifl:property>
                    <key>${key}</key>
                    <value>${value}</value>
                  </ifl:property>
                `;
            }
          }).join('')}
        </bpmn2:extensionElements>
      </bpmn2:messageFlow>
    `;
  
    // Convert JSON object back to XML string
    const builder = new XMLBuilder(options);
    const updatedSourceXML = builder.build(parser.parse(targetXML));
  
    return updatedSourceXML;
}