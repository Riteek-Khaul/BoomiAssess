export const SourceXML = [
  {
    palleteItems: {
      contentModifier: `<bpmn2:callActivity id="CallActivity_5" name="Content Modifier 1">
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>bodyType</key>
                    <value>constant</value>
                </ifl:property>
                <ifl:property>
                    <key>propertyTable</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>headerTable</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>wrapContent</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>componentVersion</key>
                    <value>1.6</value>
                </ifl:property>
                <ifl:property>
                    <key>activityType</key>
                    <value>Enricher</value>
                </ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::FlowstepVariant/cname::Enricher/version::1.6.0</value>
                </ifl:property>
            </bpmn2:extensionElements>
            <bpmn2:incoming>SequenceFlow_3</bpmn2:incoming>
            <bpmn2:outgoing>SequenceFlow_6</bpmn2:outgoing>
        </bpmn2:callActivity>`,
      messageMapping: "",
      RequestReply:`<bpmn2:serviceTask id="ServiceTask_8" name="Request Reply 1">
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>componentVersion</key>
                    <value>1.0</value>
                </ifl:property>
                <ifl:property>
                    <key>activityType</key>
                    <value>ExternalCall</value>
                </ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::FlowstepVariant/cname::ExternalCall/version::1.0.4</value>
                </ifl:property>
            </bpmn2:extensionElements>
            <bpmn2:incoming>SequenceFlow_6</bpmn2:incoming>
            <bpmn2:outgoing>SequenceFlow_9</bpmn2:outgoing>
        </bpmn2:serviceTask>`
    },
    events:{
        StartEvent:`<bpmn2:startEvent id="StartEvent_2" name="Start">
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>componentVersion</key>
                    <value>1.0</value>
                </ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::FlowstepVariant/cname::MessageStartEvent/version::1.0</value>
                </ifl:property>
            </bpmn2:extensionElements>
            <bpmn2:outgoing>SequenceFlow_3</bpmn2:outgoing>
            <bpmn2:messageEventDefinition/>
        </bpmn2:startEvent>`,
        EndEvent:`<bpmn2:endEvent id="EndEvent_2" name="End">
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>componentVersion</key>
                    <value>1.1</value>
                </ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::FlowstepVariant/cname::MessageEndEvent/version::1.1.0</value>
                </ifl:property>
            </bpmn2:extensionElements>
            <bpmn2:incoming>SequenceFlow_9</bpmn2:incoming>
            <bpmn2:messageEventDefinition/>
        </bpmn2:endEvent>`  
    },
    sequenceFlow:` <bpmn2:sequenceFlow id="SequenceFlow_9" sourceRef="ServiceTask_8" targetRef="EndEvent_2"/>`
  },
  {
    SenderAdaptors: {
      https: "",
      sftp: `<bpmn2:messageFlow id="MessageFlow_4" name="SFTP" sourceRef="Participant_1" targetRef="StartEvent_2">
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>disconnect</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>fileName</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>Description</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>maximumReconnectAttempts</key>
                    <value>3</value>
                </ifl:property>
                <ifl:property>
                    <key>stepwise</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>ComponentNS</key>
                    <value>sap</value>
                </ifl:property>
                <ifl:property>
                    <key>privateKeyAlias</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>location_id</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>recursive</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>Name</key>
                    <value>SFTP</value>
                </ifl:property>
                <ifl:property>
                    <key>TransportProtocolVersion</key>
                    <value>1.13.1</value>
                </ifl:property>
                <ifl:property>
                    <key>flatten</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>ComponentSWCVName</key>
                    <value>external</value>
                </ifl:property>
                <ifl:property>
                    <key>path</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>proxyPort</key>
                    <value>8080</value>
                </ifl:property>
                <ifl:property>
                    <key>noop</key>
                    <value>delete</value>
                </ifl:property>
                <ifl:property>
                    <key>doneFileName</key>
                    <value>{file:name}.done</value>
                </ifl:property>
                <ifl:property>
                    <key>file.move</key>
                    <value>.archive</value>
                </ifl:property>
                <ifl:property>
                    <key>host</key>
                    <value>sftp://example.com</value>
                </ifl:property>
                <ifl:property>
                    <key>connectTimeout</key>
                    <value>10000</value>
                </ifl:property>
                <ifl:property>
                    <key>file_sorting_criteria</key>
                    <value>sort_by_none</value>
                </ifl:property>
                <ifl:property>
                    <key>maxMessagesPerPoll</key>
                    <value>20</value>
                </ifl:property>
                <ifl:property>
                    <key>fastExistsCheck</key>
                    <value>1</value>
                </ifl:property>
                <ifl:property>
                    <key>MessageProtocol</key>
                    <value>File</value>
                </ifl:property>
                <ifl:property>
                    <key>ComponentSWCVId</key>
                    <value>1.13.1</value>
                </ifl:property>
                <ifl:property>
                    <key>direction</key>
                    <value>Sender</value>
                </ifl:property>
                <ifl:property>
                    <key>authentication</key>
                    <value>public_key</value>
                </ifl:property>
                <ifl:property>
                    <key>file_sorting_direction</key>
                    <value>sort_direction_asc</value>
                </ifl:property>
                <ifl:property>
                    <key>ComponentType</key>
                    <value>SFTP</value>
                </ifl:property>
                <ifl:property>
                    <key>credential_name</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>proxyProtocol</key>
                    <value>socks5</value>
                </ifl:property>
                <ifl:property>
                    <key>readLock</key>
                    <value>none</value>
                </ifl:property>
                <ifl:property>
                    <key>idempotentRepository</key>
                    <value>database</value>
                </ifl:property>
                <ifl:property>
                    <key>proxyType</key>
                    <value>none</value>
                </ifl:property>
                <ifl:property>
                    <key>proxyAlias</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>componentVersion</key>
                    <value>1.13</value>
                </ifl:property>
                <ifl:property>
                    <key>reconnectDelay</key>
                    <value>1000</value>
                </ifl:property>
                <ifl:property>
                    <key>proxyHost</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>system</key>
                    <value>Sender</value>
                </ifl:property>
                <ifl:property>
                    <key>scheduleKey</key>
                    <value>&lt;row&gt;&lt;cell&gt;dayValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;monthValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;yearValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;dateType&lt;/cell&gt;&lt;cell&gt;DAILY&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;secondValue&lt;/cell&gt;&lt;cell&gt;0&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;minutesValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;hourValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;toInterval&lt;/cell&gt;&lt;cell&gt;24&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;fromInterval&lt;/cell&gt;&lt;cell&gt;0&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;OnEverySecond&lt;/cell&gt;&lt;cell&gt;10&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;timeType&lt;/cell&gt;&lt;cell&gt;TIME_SECOND_INTERVAL&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;timeZone&lt;/cell&gt;&lt;cell&gt;( UTC 0:00 ) Greenwich Mean Time(Etc/GMT)&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;throwExceptionOnExpiry&lt;/cell&gt;&lt;cell&gt;true&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;second&lt;/cell&gt;&lt;cell&gt;0/10&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;minute&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;hour&lt;/cell&gt;&lt;cell&gt;0-24&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;day_of_month&lt;/cell&gt;&lt;cell&gt;?&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;month&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;dayOfWeek&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;year&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;startAt&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;endAt&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;attributeBehaviour&lt;/cell&gt;&lt;cell&gt;isRunOnceRequired,isScheduleOnDayRequired,isScheduleRecurRequired&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;triggerType&lt;/cell&gt;&lt;cell&gt;cron&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;noOfSchedules&lt;/cell&gt;&lt;cell&gt;1&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;schedule1&lt;/cell&gt;&lt;cell&gt;0/10+*+0-23+?+*+*+*&amp;amp;trigger.timeZone=Etc/GMT&lt;/cell&gt;&lt;/row&gt;</value>
                </ifl:property>
                <ifl:property>
                    <key>allowDeprecatedAlgorithms</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>TransportProtocol</key>
                    <value>SFTP</value>
                </ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::AdapterVariant/cname::sap:SFTP/tp::SFTP/mp::File/direction::Sender/version::1.13.1</value>
                </ifl:property>
                <ifl:property>
                    <key>MessageProtocolVersion</key>
                    <value>1.13.1</value>
                </ifl:property>
                <ifl:property>
                    <key>file_lock_timeout</key>
                    <value>15</value>
                </ifl:property>
                <ifl:property>
                    <key>username</key>
                    <value>ABC</value>
                </ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:messageFlow>`,
      ftp:""
    },
    ReceiverAdaptors: {
        http: "",
        sftp: `<bpmn2:messageFlow id="MessageFlow_11" name="SFTP" sourceRef="ServiceTask_8" targetRef="Participant_2">
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>disconnect</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>fileName</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>Description</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>maximumReconnectAttempts</key>
                    <value>3</value>
                </ifl:property>
                <ifl:property>
                    <key>stepwise</key>
                    <value>1</value>
                </ifl:property>
                <ifl:property>
                    <key>fileExist</key>
                    <value>Override</value>
                </ifl:property>
                <ifl:property>
                    <key>ComponentNS</key>
                    <value>sap</value>
                </ifl:property>
                <ifl:property>
                    <key>autoCreate</key>
                    <value>1</value>
                </ifl:property>
                <ifl:property>
                    <key>privateKeyAlias</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>location_id</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>Name</key>
                    <value>SFTP</value>
                </ifl:property>
                <ifl:property>
                    <key>TransportProtocolVersion</key>
                    <value>1.13.1</value>
                </ifl:property>
                <ifl:property>
                    <key>flatten</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>sftpSecEnabled</key>
                    <value>1</value>
                </ifl:property>
                <ifl:property>
                    <key>useTempFile</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>ComponentSWCVName</key>
                    <value>external</value>
                </ifl:property>
                <ifl:property>
                    <key>path</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>proxyPort</key>
                    <value>8080</value>
                </ifl:property>
                <ifl:property>
                    <key>host</key>
                    <value>sftp://example.com</value>
                </ifl:property>
                <ifl:property>
                    <key>connectTimeout</key>
                    <value>10000</value>
                </ifl:property>
                <ifl:property>
                    <key>fastExistsCheck</key>
                    <value>1</value>
                </ifl:property>
                <ifl:property>
                    <key>MessageProtocol</key>
                    <value>File</value>
                </ifl:property>
                <ifl:property>
                    <key>ComponentSWCVId</key>
                    <value>1.13.1</value>
                </ifl:property>
                <ifl:property>
                    <key>direction</key>
                    <value>Receiver</value>
                </ifl:property>
                <ifl:property>
                    <key>authentication</key>
                    <value>public_key</value>
                </ifl:property>
                <ifl:property>
                    <key>ComponentType</key>
                    <value>SFTP</value>
                </ifl:property>
                <ifl:property>
                    <key>fileAppendTimeStamp</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>credential_name</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>proxyProtocol</key>
                    <value>socks5</value>
                </ifl:property>
                <ifl:property>
                    <key>proxyType</key>
                    <value>none</value>
                </ifl:property>
                <ifl:property>
                    <key>proxyAlias</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>componentVersion</key>
                    <value>1.13</value>
                </ifl:property>
                <ifl:property>
                    <key>reconnectDelay</key>
                    <value>1000</value>
                </ifl:property>
                <ifl:property>
                    <key>proxyHost</key>
                    <value/>
                </ifl:property>
                <ifl:property>
                    <key>system</key>
                    <value>Receiver</value>
                </ifl:property>
                <ifl:property>
                    <key>tempFileName</key>
                    <value>{file:name}.tmp</value>
                </ifl:property>
                <ifl:property>
                    <key>allowDeprecatedAlgorithms</key>
                    <value>0</value>
                </ifl:property>
                <ifl:property>
                    <key>TransportProtocol</key>
                    <value>SFTP</value>
                </ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::AdapterVariant/cname::sap:SFTP/tp::SFTP/mp::File/direction::Receiver/version::1.13.1</value>
                </ifl:property>
                <ifl:property>
                    <key>MessageProtocolVersion</key>
                    <value>1.13.1</value>
                </ifl:property>
                <ifl:property>
                    <key>username</key>
                    <value>XYZ</value>
                </ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:messageFlow>`,
         ftp:""
      },
  },
  {
    Collaboration: {
      ExtensinElements: `<bpmn2:extensionElements>
            <ifl:property>
                <key>namespaceMapping</key>
                <value>sampleNamespace</value>
            </ifl:property>
            <ifl:property>
                <key>httpSessionHandling</key>
                <value>None</value>
            </ifl:property>
            <ifl:property>
                <key>accessControlMaxAge</key>
                <value/>
            </ifl:property>
            <ifl:property>
                <key>returnExceptionToSender</key>
                <value>true</value>
            </ifl:property>
            <ifl:property>
                <key>log</key>
                <value>All events</value>
            </ifl:property>
            <ifl:property>
                <key>corsEnabled</key>
                <value>false</value>
            </ifl:property>
            <ifl:property>
                <key>exposedHeaders</key>
                <value/>
            </ifl:property>
            <ifl:property>
                <key>componentVersion</key>
                <value>1.2</value>
            </ifl:property>
            <ifl:property>
                <key>allowedHeaderList</key>
                <value>*</value>
            </ifl:property>
            <ifl:property>
                <key>ServerTrace</key>
                <value>false</value>
            </ifl:property>
            <ifl:property>
                <key>allowedOrigins</key>
                <value/>
            </ifl:property>
            <ifl:property>
                <key>accessControlAllowCredentials</key>
                <value>false</value>
            </ifl:property>
            <ifl:property>
                <key>allowedHeaders</key>
                <value/>
            </ifl:property>
            <ifl:property>
                <key>allowedMethods</key>
                <value/>
            </ifl:property>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::IFlowVariant/cname::IFlowConfiguration/version::1.2.4</value>
            </ifl:property>
       </bpmn2:extensionElements>`,
    },
    participants: {
      Sender: `<bpmn2:participant id="Participant_1" ifl:type="EndpointSender" name="Sender">
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>enableBasicAuthentication</key>
                    <value>false</value>
                </ifl:property>
                <ifl:property>
                    <key>ifl:type</key>
                    <value>EndpointSender</value>
                </ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:participant>`,
      Receiver: `<bpmn2:participant id="Participant_2" ifl:type="EndpointRecevier" name="Receiver">
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>ifl:type</key>
                    <value>EndpointRecevier</value>
                </ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:participant>`,
      IntegrationProcess: `<bpmn2:participant id="Participant_Process_1" ifl:type="IntegrationProcess" name="Integration Process" processRef="Process_1">
            <bpmn2:extensionElements/>
        </bpmn2:participant>`,
    },
  },
  {
    IntegrationProcess:{
        extensionElements:`<bpmn2:extensionElements>
            <ifl:property>
                <key>transactionTimeout</key>
                <value>30</value>
            </ifl:property>
            <ifl:property>
                <key>componentVersion</key>
                <value>1.2</value>
            </ifl:property>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::FlowElementVariant/cname::IntegrationProcess/version::1.2.1</value>
            </ifl:property>
            <ifl:property>
                <key>transactionalHandling</key>
                <value>Not Required</value>
            </ifl:property>
        </bpmn2:extensionElements>`,
        BPMNEdge:`<bpmndi:BPMNEdge bpmnElement="SequenceFlow_3" id="BPMNEdge_SequenceFlow_3" sourceElement="BPMNShape_StartEvent_2" targetElement="BPMNShape_CallActivity_5">
                <di:waypoint x="308.0" xsi:type="dc:Point" y="160.0"/>
                <di:waypoint x="462.0" xsi:type="dc:Point" y="160.0"/>
            </bpmndi:BPMNEdge>`
    }
  },
  {
    BPMNDiagram:{
        BPMNShape:`<bpmndi:BPMNShape bpmnElement="EndEvent_2" id="BPMNShape_EndEvent_2">
                <dc:Bounds height="32.0" width="32.0" x="703.0" y="142.0"/>
            </bpmndi:BPMNShape>`,
            BPMNEdge:`<bpmndi:BPMNEdge bpmnElement="MessageFlow_11" id="BPMNEdge_MessageFlow_11" sourceElement="BPMNShape_ServiceTask_8" targetElement="BPMNShape_Participant_2">
                <di:waypoint x="612.0" xsi:type="dc:Point" y="162.0"/>
                <di:waypoint x="636.0" xsi:type="dc:Point" y="340.0"/>
            </bpmndi:BPMNEdge>`
    }
  }

];


// SourceXML=[
//     {
//       palleteItems:{
//       contentModifier:"",
//       messageMapping:"",
//       RequestReply:""  
//     },
//        events:{
//          StartEvent:"",
//          EndEvent:"",
//     },
//      sequenceFlow:""
//     },
//     {
//       SenderAdaptors: {
//         https: "",
//         sftp:"",
//         FTP:""
//     },
//      ReceiverAdaptors: {
//        http: "",
//        sftp:"",
//        FTP:""
//      },
//     },
//     {
//       Collaboration:{
//         ExtensinElements:""
//       },
//       participants: {
//       Sender:"",
//       Receiver:"",
//       IntegrationProcess:""
//     },
//   },
//     {
//       IntegrationProcess:{
//         extensionElements:"",
//         BPMNEdge:""
//       },
//     },
//      {
//       BPMNDiagram:{
//         BPMNShape:""
//          }
//     }
//   ];