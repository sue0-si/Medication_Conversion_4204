
import './App.css';
import NavBar from './NavBar.js';
import * as React from 'react';

import Dashboard from './NavBarSide';
import Copyright from './copyright';


function App() {
    const [mode] = React.useState('light');
  return (
    <div className="app-container">
          {/*<NavBar mode={mode} />*/}
          <Dashboard />
          <Copyright/>
    </div>
  );
}

export default App;
