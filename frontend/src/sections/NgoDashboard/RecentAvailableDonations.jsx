import { Link } from 'react-router-dom';
import { donationStatusClasses, donationStatusLabels } from '../../constants/donationConstants';
import { formatDate, formatQuantity, getDonationImage } from '../../utils/donationUtils';

const RecentAvailableDonations = ({
  donations,
  isLoading,
  title = 'Recent Available Donations',
  viewAllHref = '',
}) => (
  <article className="dashboard-panel recent-panel" id="available-donations">
    <div className="panel-heading">
      <h2>{title}</h2>
      {viewAllHref && <Link to={viewAllHref}>View All</Link>}
    </div>

    <div className="donation-list">
      {isLoading && <p className="empty-state">Loading available donations...</p>}
      {!isLoading && donations.length === 0 && (
        <p className="empty-state">No available donations right now.</p>
      )}
      {donations.map((donation) => (
        <article className="donation-row ngo-donation-row" key={donation._id}>
          <img src={getDonationImage(donation)} alt={donation.foodTitle} />
          <div className="donation-copy">
            <strong>{donation.foodTitle}</strong>
            <p>
              {formatQuantity(donation.quantity)}
              <span>•</span>
              {donation.pickupAddress?.address || donation.donor?.location?.address || 'Address not available'}
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

export default RecentAvailableDonations;
