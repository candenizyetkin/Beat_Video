import React from 'react';
import { Link } from 'react-router-dom';
import beatLogo from './beat_logo.svg';
import './css/navbar.css';

export default function Navbar({ onThemeToggle, theme }) {
  return (
    <nav className="main-navbar">
      <div className="navbar-content">
        <div className="navbar-logo-area">
          <Link to="/" className="navbar-logo-link blue-text" aria-label="Anasayfa">
            <img src={beatLogo} alt="Beat Video Logo" className="navbar-logo-img blue-text" />
          </Link>
        </div>
        <div className="navbar-actions">
          
        </div>
      </div>
    </nav>
  );
}
