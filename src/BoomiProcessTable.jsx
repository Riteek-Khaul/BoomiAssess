import React, { useState } from 'react';

const BoomiProcessTable = () => {
  const [shapes, setShapes] = useState([]);
  const [error, setError] = useState(null);

  const parseBoomiProcess = (xmlStr) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');
      const shapeElements = Array.from(xmlDoc.getElementsByTagName('shape'));

      // Create shape map by name for reference
      const shapeMap = {};
      shapeElements.forEach((shape, index) => {
        const name = shape.getAttribute('name');
        shapeMap[name] = {
          stepNo: index + 1,
          name,
          type: shape.getAttribute('shapetype'),
          userlabel: shape.getAttribute('userlabel') || '',
          source: null,
          target: null,
        };
      });

      // Determine target and source
      shapeElements.forEach((shape) => {
        const name = shape.getAttribute('name');
        const dragpoint = shape.getElementsByTagName('dragpoint')[0];
        if (dragpoint) {
          const targetName = dragpoint.getAttribute('toShape');
          if (shapeMap[name]) shapeMap[name].target = targetName;
          if (shapeMap[targetName]) shapeMap[targetName].source = name;
        }
      });

      setShapes(Object.values(shapeMap));
      setError(null);
    } catch (e) {
      setError('Failed to parse XML. Please check your input.');
      console.error(e);
    }
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      parseBoomiProcess(event.target.result);
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Boomi Process Shape Sequence</h2>
      <input type="file" accept=".xml" onChange={handleFileChange} className="mb-4" />
      {error && <p className="text-red-500">{error}</p>}
      {shapes.length > 0 && (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Step No</th>
              <th className="border p-2">Shape Name</th>
              <th className="border p-2">Shape Type</th>
              <th className="border p-2">Source</th>
              <th className="border p-2">Target</th>
            </tr>
          </thead>
          <tbody>
            {shapes.map((shape, idx) => (
              <tr key={idx}>
                <td className="border p-2 text-center">{shape.stepNo}</td>
                <td className="border p-2">{shape.userlabel || shape.name}</td>
                <td className="border p-2">{shape.type}</td>
                <td className="border p-2">{shape.source || '—'}</td>
                <td className="border p-2">{shape.target || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BoomiProcessTable;
