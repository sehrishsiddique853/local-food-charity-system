import { Link } from 'react-router-dom';
import '../styles/sections/AboutUs.css';
import { ROUTES } from '../constants/routes';

const AboutUs = () => {
  return (
    <section className="about-us" id="about">
      <div className="about-container">
        <div className="about-image">
          <div className="image-placeholder">
            <img src="/home-page-ani.png" alt="Food donation volunteers" />
          </div>
        </div>
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We are a team of people working to reduce food waste and help those in need by connecting donors with verified NGOs through a transparent and reliable platform.
          </p>
          <Link className="learn-more-btn" to={ROUTES.about}>
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
