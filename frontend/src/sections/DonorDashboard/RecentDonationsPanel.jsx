import { Link } from 'react-router-dom';
import { donationStatusClasses, donationStatusLabels } from '../../constants/donationConstants';
import { ROUTES } from '../../constants/routes';
import { formatDate, formatQuantity, getDonationImage } from '../../utils/donationUtils';

const RecentDonationsPanel = ({ donations, isLoading }) => (
  <article className="dashboard-panel recent-panel" id="my-donations">
    <div className="panel-heading">
      <h2>Recent Donations</h2>
      <Link to={ROUTES.myDonations}>View All</Link>
    </div>

    <div className="donation-list">
      {isLoading && <p className="empty-state">Loading your donations...</p>}
      {!isLoading && donations.length === 0 && (
        <p className="empty-state">No donations yet. Post your first donation.</p>
      )}
      {donations.map((donation) => (
        <article className="donation-row" key={donation._id}>
          <img src={getDonationImage(donation)} alt={donation.foodTitle} />
          <div className="donation-copy">
            <strong>{donation.foodTitle}</strong>
            <p>
              {formatQuantity(donation.quantity)}
              <span>•</span>
              {donation.pickupAddress?.address || 'Address not available'}
            </p>
          </div>
          <span className={`status-pill ${donationStatusClasses[donation.status] || 'available'}`}>
            {donationStatusLabels[donation.status] || donation.status}
          </span>
          <time>{formatDate(donation.createdAt)}</time>
        </article>
      ))}
    </div>
  </article>
);

export default RecentDonationsPanel;
