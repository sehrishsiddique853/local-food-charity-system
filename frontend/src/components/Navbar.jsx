import { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = ({ variant = 'transparent', actionSlot = null }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = variant === 'light';
  const homeHref = isLight ? '/#home' : '#home';
  const aboutHref = isLight ? '/#about' : '#about';
  const contactHref = isLight ? '/#contact' : '#contact';

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isLight ? 'navbar-light' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href={homeHref} className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-icon">🥗</div>

          <div className="logo-content">
            <div>
              <span className="logo-text">Local</span>
              <span className="logo-text-accent">Food</span>
            </div>
            <span className="logo-subtitle">Charity System</span>
          </div>
        </a>

        {/* Mobile Menu Button */}
        <button
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <a href={homeHref} className={!isLight ? 'active' : ''} onClick={closeMobileMenu}>
              Home
            </a>
          </li>
          <li>
            <a href={aboutHref} onClick={closeMobileMenu}>About Us</a>
          </li>
          <li>
            <a href="/register?role=donor" onClick={closeMobileMenu}>Donate</a>
          </li>
          <li>
            <a href="/register?role=ngo" onClick={closeMobileMenu}>Request</a>
          </li>
          <li>
            <a href={contactHref} onClick={closeMobileMenu}>Contact Us</a>
          </li>
          <li className="mobile-login">
            <a href="/login" onClick={closeMobileMenu}>Sign In</a>
          </li>
        </ul>

        {/* Desktop Action */}
        {actionSlot || (
          <a className="login-btn" href="/login">
            <span className="login-icon">♡</span>
            Sign In
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
