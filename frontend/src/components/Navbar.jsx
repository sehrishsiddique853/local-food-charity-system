import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">🥗</div>
          <div>
            <span className="logo-text">Local</span>
            <span className="logo-text-accent">Food</span>
            <div className="logo-subtitle">Charity System</div>
          </div>
        </div>

        {/* Hamburger Menu Icon */}
        <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Menu Items */}
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={closeMobileMenu}>Home</a></li>
          <li><a href="#about" onClick={closeMobileMenu}>About Us</a></li>
          <li><a href="#donate" onClick={closeMobileMenu}>Donate</a></li>
          <li><a href="#request" onClick={closeMobileMenu}>Request</a></li>
          <li><a href="#volunteer" onClick={closeMobileMenu}>Volunteer</a></li>
          <li><a href="#contact" onClick={closeMobileMenu}>Contact Us</a></li>
          <li className="mobile-login"><a href="#login" onClick={closeMobileMenu}>Login</a></li>
        </ul>

        {/* Login Button (Desktop Only) */}
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
