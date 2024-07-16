
import './App.css';
import NavBar from './NavBar.js';
import * as React from 'react';

import Dashboard from './Dashboard';
import Copyright from './copyright';


function App() {
    const [mode] = React.useState('light');
  return (
    <div className="app-container">
          {/*<NavBar mode={mode} />*/}
          <Dashboard heading='Home'>
          <h1>Conversion Application</h1>
          </Dashboard>
          <Copyright/>
    </div>
  );
}

export default App;
