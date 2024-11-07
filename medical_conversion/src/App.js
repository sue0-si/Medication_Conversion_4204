
import './App.css';
import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Copyright from './Components/copyright';
import Home from './Pages/Home';
import MedicationLookup from './Pages/MedicationSearch';
import DrugDetail from './Pages/DrugDetail.js';
import PoIvConversion from './Pages/PoIvConversion';
import PoIvConversionResults from './Pages/PoIvConversionResults';
import AltConversion from './Pages/AltConversion';
import AltConversionResults from './Pages/AltConversionResults.js';
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
                  <Route path="/po-iv" element={<PoIvConversion />} />
                  <Route path="/po-iv/:medicationName" element={<PoIvConversionResults resultsType={"po-iv"} />} />
                  <Route path="/alt" element={<AltConversion />} />
                  <Route path="/alt/:medicationName" element={<AltConversionResults resultsType={"alt"}/> } />
                  </Routes>
          </Router>
          <Copyright/>
    </div>
  );
}

export default App;
