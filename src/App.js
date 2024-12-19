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
import MigrateToCI from './tests/MigrateToCI';
import Help from './Help';

function App(){

  return (
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/help" element={<Help />} />
      </Routes>
  );
}

export default App;

