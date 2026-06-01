import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const DonationCtaCard = () => (
  <section className="surplus-card" id="post-donation">
    <span className="surplus-icon">♡</span>
    <div>
      <h2>Make a Difference Today!</h2>
      <p>Every donation brings hope and happiness to someone in need.</p>
    </div>
    <Link className="surplus-button" to={ROUTES.postDonation}>
      <span>＋</span>
      Post New Donation
    </Link>
  </section>
);

export default DonationCtaCard;
