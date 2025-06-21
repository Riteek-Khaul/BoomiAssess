import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Home from './Pages/Home';
import Extract from './Pages/Extract';
import Evaluate from './Pages/Evaluate';
import Migrate from './Pages/Migrate';
import SuccessPage from './SuccessPage';
import CreateFile from './CreateFile';
import ResourceDownloader from './Resource';
import IflowXML from './IflowXML';
import GeneratePDF from './GeneratePDF';
import CalSubPro from './tests/CalSubPro';
import MigrateToCI from './tests/MigrateToCI';
import Help from './Pages/Help';
import BoomiToXSDConverter from './BoomiToXSDConverter';
import BoomiProcessTable from './BoomiProcessTable';

function App(){

  return (
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/" element={<Home />} />
        <Route path='/Home' element={<Home />} />
        <Route path="/Extract" element={<Extract />} />
        <Route path="/Evaluate" element={<Evaluate />} />
        <Route path="/Migrate" element={<Migrate />} />
        <Route path="/help" element={<Help />} />
        <Route path="/convert-map" element={<BoomiToXSDConverter />} />
        <Route path='/resources-download' element={< ResourceDownloader />} />
        <Route path='/boomi-process-table' element={< BoomiProcessTable />} />
      </Routes>
  );
}

export default App;

