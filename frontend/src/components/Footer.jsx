import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { ROUTES } from '../constants/routes';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        {/* Left Section - Logo and Description */}
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">🥗</div>
            <div>
              <span className="logo-text">Local</span>
              <span className="logo-text-accent">Food</span>
            </div>
          </div>
          <p className="footer-description">
            Together we can make a difference and create a world with zero hunger.
          </p>
          <div className="social-links">
            <a href="#facebook" className="social-icon">f</a>
            <a href="#twitter" className="social-icon">𝕏</a>
            <a href="#instagram" className="social-icon">📷</a>
            <a href="#linkedin" className="social-icon">in</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to={`${ROUTES.home}#home`}>Home</Link></li>
            <li><Link to={`${ROUTES.home}#about`}>About Us</Link></li>
            <li><Link to={ROUTES.donorRegister}>Donate Food</Link></li>
            <li><Link to={ROUTES.ngoRegister}>Request Food</Link></li>
            <li><Link to={ROUTES.register}>Register</Link></li>
            <li><Link to={ROUTES.login}>Sign In</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#faq">FAQs</a></li>
            <li><a href="#guidelines">Guidelines</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul>
            <li>📞 +92 300 1234567</li>
            <li>📧 info@localfoodcharity.org</li>
            <li>📍 Islamabad, Pakistan</li>
          </ul>
          <div className="footer-badge">
            Made with ❤️ for a better world
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2026 Local Food Charity System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
