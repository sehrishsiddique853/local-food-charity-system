import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { ROUTES } from '../constants/routes';

const Navbar = ({ variant = 'transparent', actionSlot = null }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLight = variant === 'light';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  const homeHref = `${ROUTES.home}#home`;

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
          <div className="logo-icon">
            <img src="/website_logo.png" alt="FoodBridge logo" />
          </div>

          <div className="logo-content">
            <div>
              <span className="logo-text">Food</span>
              <span className="logo-text-accent">Bridge</span>
            </div>
            <span className="logo-subtitle">Food Donation Network</span>
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
            <Link to={ROUTES.about} onClick={closeMobileMenu}>About Us</Link>
          </li>
          <li>
            <Link to={ROUTES.donorRegister} onClick={closeMobileMenu}>Donate</Link>
          </li>
          <li>
            <Link to={ROUTES.ngoRegister} onClick={closeMobileMenu}>Request</Link>
          </li>
          <li>
            <Link to={ROUTES.contact} onClick={closeMobileMenu}>Contact Us</Link>
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
