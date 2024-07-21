
import './App.css';
import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Dashboard from './Dashboard';
import Copyright from './copyright';
import Home from './Home';
import MedicationLookup from './MedicationSearch';
import DrugDetail from './DrugDetail.js';


function App() {
    const [mode] = React.useState('light');
  return (
    <div className="app-container">
          {/*<NavBar mode={mode} />*/}
          <Router>
              <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/medication-information" element={<MedicationLookup />} />
                  <Route path="/medication-information/:medication-name" element={<DrugDetail />} />
                  </Routes>
          </Router>
          <Copyright/>
    </div>
  );
}

export default App;
