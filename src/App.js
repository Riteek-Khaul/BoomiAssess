import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SuccessPage from './SuccessPage';
import CreateFile from './CreateFile';
import ResourceDownloader from './Resource';
import IflowXML from './IflowXML';
import GeneratePDF from './GeneratePDF';
import CalSubPro from './tests/CalSubPro';

function App(){

  return (
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<CreateFile />} />
        <Route path="/resource" element={<ResourceDownloader />} />
        <Route path="/buildXml" element={<IflowXML />} />
        <Route path="/pdf" element={<GeneratePDF />} />
        <Route path="/calsubpro" element={<CalSubPro />} />
      </Routes>
  );
}

export default App;

