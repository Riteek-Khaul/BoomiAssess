import React, { useEffect, useState } from 'react';
import {SourceXML} from './CPISourceXML'

const IflowXML = () => {

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

// Main function to generate the complete Iflow XML code
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


// Execute the function to get the iFlow XML code
const iflowXMLCode = generateIflowXML();
console.log(iflowXMLCode);


  return (
    <div>
       {
          iflowXMLCode 
       }
    </div>
  )
}

export default IflowXML





// const collaboration="ExtensinElements + participants(sender/reciver/integration process) + messageflow ( adaptors )";
// const process="ExtensinElements + Events(start/end) + callactivity(all pallete items) + sequenceFlow(arrow)";
// const BPMPlane_1="BPMNShape * (participants+Events+callactivity) + BPMNEdge * (sequenceFlow+messageflow)";
// const BPMNDiagram="BPMPlane_1+BPMPlane_2";
// const IflowXMLCode = "default Tag + collaboration + process + BPMPlane_1 + BPMNDiagram ";