import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Component/Layout';
import Index from './Component/Index.jsx';
import UpdateLead from './Component/UpdateLead.jsx';
import BREBypass from './Component/BREBypass.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="update-lead" element={<UpdateLead />} />
          <Route path="bre-bypass" element={<BREBypass />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
