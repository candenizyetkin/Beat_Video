
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Detail from './Detail';
import './App.css';
import beatLogo from './beat_logo.svg';

function App() {
  return (
    <Router>
      <div style={{ position: 'fixed', top: 24, left: 24, zIndex: 1000 }}>
        <Link to="/">
          <img src={beatLogo} alt="Logo" style={{ width: 56, height: 56, cursor: 'pointer', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;
