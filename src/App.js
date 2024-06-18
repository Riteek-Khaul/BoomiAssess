import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SuccessPage from './SuccessPage';
import CreateFile from './CreateFile';
import ResourceDownloader from './Resource';
import IflowXML from './IflowXML';

function App(){

  return (
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<CreateFile />} />
        <Route path="/resource" element={<ResourceDownloader />} />
        <Route path="/buildXml" element={<IflowXML />} />
      </Routes>
  );
}

export default App;

