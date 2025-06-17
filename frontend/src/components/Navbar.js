// src/components/Navbar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const handleContactClick = () => {
    // Scroll to #contact on the CURRENT page, no navigation
    scrollToSection('contact');
  };

  return (
    <nav className="navbar sticky-navbar">
      <div className="logo">
        <i className="fas fa-store"></i>
        <span>LocalMart</span>
      </div>
      <ul className="nav-links">
        <li>
          <button onClick={() => handleNavClick('features')} className="nav-button">
            Features
          </button>
        </li>
        <li>
          <button onClick={() => handleNavClick('audience')} className="nav-button">
            For Who
          </button>
        </li>
        <li>
          <button onClick={handleContactClick} className="nav-button">
            Contact
          </button>
        </li>
      </ul>
      <div className="auth-buttons">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
