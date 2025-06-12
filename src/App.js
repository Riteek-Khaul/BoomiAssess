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
import BoomiToXSDConverter from './BoomiToXSDConverter';
import BoomiProcessTable from './BoomiProcessTable';

function App(){

  return (
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/convert-map" element={<BoomiToXSDConverter />} />
        <Route path='/resources-download' element={< ResourceDownloader />} />
        <Route path='/boomi-process-table' element={< BoomiProcessTable />} />
      </Routes>
  );
}

export default App;

