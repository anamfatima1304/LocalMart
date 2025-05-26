// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <i className="fas fa-store"></i>
        <span>LocalMart</span>
      </div>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#audience">For Who</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div className="auth-buttons">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
