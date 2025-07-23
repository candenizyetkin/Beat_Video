
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Detail from './Detail';
import Navbar from './Navbar';
import './css/header.css';
import './css/card.css';
import './css/filter.css';
import './css/overlay.css';

import './css/imdb-input.css';
import beatLogo from './beat_logo.svg';

function App() {
  const [theme, setTheme] = React.useState(() => document.body.getAttribute('data-theme') || 'dark');

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <Navbar onThemeToggle={handleThemeToggle} theme={theme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;
