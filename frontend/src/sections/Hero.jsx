import '../styles/sections/Hero.css';

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
            <a className="btn btn-primary" href="/register?role=donor">
              <span className="btn-icon">♡</span>
              Donate Food
            </a>

            <a className="btn btn-secondary" href="/register?role=ngo">
              <span className="btn-icon">♧</span>
              Join as NGO
            </a>
          </div>
        </div>
      </div>

      <div className="hero-features">
        <div className="feature">
          <span className="feature-icon">✓</span>
          <span>Verified NGOs</span>
        </div>

        <div className="feature">
          <span className="feature-icon">⌂</span>
          <span>Secure Platform</span>
        </div>

        <div className="feature">
          <span className="feature-icon">↻</span>
          <span>Real-time Tracking</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
