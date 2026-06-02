import { Link } from 'react-router-dom';
import PostDonationCard from '../../components/PostDonationCard';
import { ROUTES } from '../../constants/routes';

const DonationCtaCard = () => (
  <PostDonationCard
    title="Make a Difference Today!"
    description="Every donation brings hope and happiness to someone in need."
    titleId="dashboard-post-donation-title"
  >
    <div className="post-card-actions">
      <Link className="post-primary-link" to={ROUTES.postDonation}>
        <span>＋</span>
        Post New Donation
      </Link>
    </div>
  </PostDonationCard>
);

export default DonationCtaCard;
