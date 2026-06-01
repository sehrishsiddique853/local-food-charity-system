import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { ROUTES } from '../constants/routes';

const Navbar = ({ variant = 'transparent', actionSlot = null }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = variant === 'light';
  const homeHref = `${ROUTES.home}#home`;
  const aboutHref = `${ROUTES.home}#about`;
  const contactHref = `${ROUTES.home}#contact`;

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
        <Link to={homeHref} className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-icon">🥗</div>

          <div className="logo-content">
            <div>
              <span className="logo-text">Local</span>
              <span className="logo-text-accent">Food</span>
            </div>
            <span className="logo-subtitle">Charity System</span>
          </div>
        </Link>

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
            <Link to={homeHref} className={!isLight ? 'active' : ''} onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to={aboutHref} onClick={closeMobileMenu}>About Us</Link>
          </li>
          <li>
            <Link to={ROUTES.donorRegister} onClick={closeMobileMenu}>Donate</Link>
          </li>
          <li>
            <Link to={ROUTES.ngoRegister} onClick={closeMobileMenu}>Request</Link>
          </li>
          <li>
            <Link to={contactHref} onClick={closeMobileMenu}>Contact Us</Link>
          </li>
          <li className="mobile-login">
            <Link to={ROUTES.login} onClick={closeMobileMenu}>Sign In</Link>
          </li>
        </ul>

        {/* Desktop Action */}
        {actionSlot || (
          <Link className="login-btn" to={ROUTES.login}>
            <span className="login-icon">♡</span>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
