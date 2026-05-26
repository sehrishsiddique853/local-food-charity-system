import React from 'react';
import '../styles/sections/Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">
          Share Food.
          <br />
          <span className="hero-accent">Share Hope.</span>
        </h1>
        <p className="hero-description">
          Connecting generous donors with verified NGOs to reduce food waste and feed those in need.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">
            <span className="btn-icon">🥘</span>
            Donate Food
          </button>
          <button className="btn btn-secondary">
            <span className="btn-icon">🤝</span>
            Join as NGO
          </button>
        </div>
      </div>

      {/* Right side image placeholder */}
      <div className="hero-image">
        <div className="image-placeholder">
          <img src="/hero-image.jpg" alt="Food donation" />
        </div>
      </div>

      {/* Features */}
      <div className="hero-features">
        <div className="feature">
          <span className="feature-icon">✓</span>
          <span>Verified NGOs</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <span>Secure Platform</span>
        </div>
        <div className="feature">
          <span className="feature-icon">📍</span>
          <span>Real-time Tracking</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
