import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const AboutPageHero = () => {
  return (
    <section className="about-page-hero">
      <div className="about-page-copy">
        <span className="about-page-eyebrow">About FoodBridge</span>
        <h1>Connecting surplus food with verified local support.</h1>
        <p>
          FoodBridge is built to make food donation coordination
          simpler, more transparent, and more useful for donors, NGOs, and
          administrators.
        </p>
        <div className="about-page-actions">
          <Link className="about-page-primary-link" to={ROUTES.donorRegister}>
            Donate Food
          </Link>
          <Link className="about-page-secondary-link" to={ROUTES.ngoRegister}>
            Request Food
          </Link>
        </div>
      </div>

      <div className="about-page-image">
        <img src="/home-page-ani.png" alt="Volunteers coordinating food donation" />
      </div>
    </section>
  );
};

export default AboutPageHero;
