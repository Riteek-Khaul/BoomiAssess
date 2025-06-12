import React, { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';

const BoomiXSDGenerator = () => {
  const [sourceXSD, setSourceXSD] = useState('');
  const [targetXSD, setTargetXSD] = useState('');
  const [sourceProfileName, setSourceProfileName] = useState('SourceSchema');
  const [targetProfileName, setTargetProfileName] = useState('TargetSchema');

  const getXSDataType = (dataType) => {
    switch (dataType) {
      case 'number': return 'xs:decimal';
      case 'character': return 'xs:string';
      case 'date': return 'xs:date';
      default: return 'xs:string';
    }
  };

  const generateXSD = (profile) => {
    const root = profile?.['bns:object']?.XMLProfile?.DataElements?.XMLElement;
    if (!root) return '';

    const buildElement = (element) => {
      const name = element.name;
      const minOccurs = element.minOccurs || 1;
      const maxOccurs = (element.maxOccurs === '-1' || element.maxOccurs === -1) ? 'unbounded' : element.maxOccurs || 1;
      const children = element.XMLElement;
      const isLeaf = !children;

      const occurs = `${minOccurs !== 1 ? ` minOccurs="${minOccurs}"` : ''}${maxOccurs !== 1 ? ` maxOccurs="${maxOccurs}"` : ''}`;

      if (isLeaf) {
        const type = getXSDataType(element.dataType);
        return `<xs:element name="${name}" type="${type}"${occurs}/>`;
      } else {
        const childrenArray = Array.isArray(children) ? children : [children];
        const nestedElements = childrenArray.map(buildElement).join('\n');

        return `
<xs:element name="${name}"${occurs}>
  <xs:complexType>
    <xs:sequence>
${nestedElements}
    </xs:sequence>
  </xs:complexType>
</xs:element>
        `.trim();
      }
    };

    const xsdBody = buildElement(root);

    return `
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified">
${xsdBody}
</xs:schema>
    `.trim();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const xmlContent = e.target.result;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        allowBooleanAttributes: true,
        parseAttributeValue: true,
        ignoreDeclaration: false,
      });

      const parsed = parser.parse(xmlContent);

      const messages = parsed['multimap:Messages']?.['multimap:Message1'];
      if (!messages) return;

      const components = Array.isArray(messages['bns:Component']) ? messages['bns:Component'] : [messages['bns:Component']];
      if (components.length < 2) return;

      // Extract profile names
      setSourceProfileName(components[0]?.name || 'SourceSchema');
      setTargetProfileName(components[1]?.name || 'TargetSchema');

      setSourceXSD(generateXSD(components[0]));
      setTargetXSD(generateXSD(components[1]));
    };

    reader.readAsText(file);
  };

  const downloadXSD = (xsd, filename) => {
    const blob = new Blob([xsd], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 font-mono">
      <h2 className="text-xl font-bold mb-4">Boomi Profile to XSD Generator</h2>
      <input type="file" accept=".xml" onChange={handleFileUpload} className="mb-4" />

      {sourceXSD && (
        <div className="mb-4">
          <h3 className="font-semibold">Source XSD</h3>
          <textarea value={sourceXSD} rows={15} className="w-full border p-2 text-sm" readOnly />
          <button
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
            onClick={() => downloadXSD(sourceXSD, `${sourceProfileName}.xsd`)}
          >
            Download Source XSD
          </button>
        </div>
      )}

      {targetXSD && (
        <div className="mb-4">
          <h3 className="font-semibold">Target XSD</h3>
          <textarea value={targetXSD} rows={15} className="w-full border p-2 text-sm" readOnly />
          <button
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
            onClick={() => downloadXSD(targetXSD, `${targetProfileName}.xsd`)}
          >
            Download Target XSD
          </button>
        </div>
      )}
    </div>
  );
};

export default BoomiXSDGenerator;
