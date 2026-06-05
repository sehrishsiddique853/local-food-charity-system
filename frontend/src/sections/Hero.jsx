import { Link } from 'react-router-dom';
import '../styles/sections/Hero.css';
import { ROUTES } from '../constants/routes';

const featureIcons = {
  verified: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.4-2.8 8.4-7 10-4.2-1.6-7-5.6-7-10V6l7-3z" />
      <path d="M8.5 12.2l2.2 2.2 4.8-5" />
    </svg>
  ),
  secure: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 10V8a4.5 4.5 0 0 1 9 0v2" />
      <path d="M6 10h12v9H6z" />
      <path d="M12 14v2" />
    </svg>
  ),
  tracking: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 13.7-5.6" />
      <path d="M18 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6" />
      <path d="M6 20v-4h4" />
    </svg>
  ),
};

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Share Food.
            <br />
            Share <span className="hero-accent">Hope.</span>
          </h1>

          <p className="hero-description">
            Connecting generous donors with verified NGOs to reduce food waste
            and feed those in need.
          </p>

          <div className="hero-buttons">
            <Link className="btn btn-primary" to={ROUTES.donorRegister}>
              <span className="btn-icon">♡</span>
              Donate Food
            </Link>

            <Link className="btn btn-secondary" to={ROUTES.ngoRegister}>
              <span className="btn-icon">♧</span>
              Join as NGO
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-features">
        <div className="feature">
          <span className="feature-icon">{featureIcons.verified}</span>
          <span>Verified NGOs</span>
        </div>

        <div className="feature">
          <span className="feature-icon">{featureIcons.secure}</span>
          <span>Secure Platform</span>
        </div>

        <div className="feature">
          <span className="feature-icon">{featureIcons.tracking}</span>
          <span>Real-time Tracking</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
