import React from 'react'

const IflowXML = () => {

    const collaboration="ExtensinElements + participants(sender/reciver/integration process) + messageflow ( adaptors )";
    const process="ExtensinElements + Events(start/end) + callactivity(all pallete items) + sequenceFlow(arrow)";
    const BPMPlane_1="BPMNShape * (participants+Events+callactivity) + BPMNEdge * (sequenceFlow+messageflow)";
    const BPMNDiagram="BPMPlane_1+BPMPlane_2";
    const IflowXMLCode = "default Tag + collaboration + process + BPMPlane_1 + BPMNDiagram ";


  return (
    <div>
       {
          IflowXML
       }
    </div>
  )
}

export default IflowXML