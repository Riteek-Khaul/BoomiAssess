import React, { useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

const BpmnDiagramViewer = ({ diagramXML }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const viewer = new BpmnViewer({ container: containerRef.current });

    viewer.importXML(diagramXML).catch(err => {
      console.error('Error rendering BPMN diagram:', err);
    });

    return () => viewer.destroy(); // cleanup on unmount
  }, [diagramXML]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px', border: '1px solid #ccc' }} />;
};

export default BpmnDiagramViewer;
