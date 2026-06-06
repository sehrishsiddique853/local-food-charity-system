import { Link } from 'react-router-dom';
import { formatDate, formatQuantity } from '../../utils/donationUtils';

const BookedDonationsPanel = ({
  donations,
  isLoading,
  title = 'Booked Donations',
  viewAllHref = '',
  collectingDonationId = '',
  onMarkCollected,
}) => (
  <article className="dashboard-panel booked-panel" id="booked-donations">
    <div className="panel-heading">
      <h2>{title}</h2>
      {viewAllHref && <Link to={viewAllHref}>View All</Link>}
    </div>

    <div className="booked-donation-list">
      {isLoading && <p className="empty-state compact">Loading booked donations...</p>}
      {!isLoading && donations.length === 0 && (
        <p className="empty-state compact">No booked donations yet.</p>
      )}
      {donations.map((donation) => (
        <article className="booked-donation-row" key={donation._id}>
          <div>
            <strong>{donation.foodTitle}</strong>
            <p>{formatQuantity(donation.quantity)}</p>
          </div>
          <div className="booked-donation-actions">
            <time>{formatDate(donation.updatedAt || donation.createdAt)}</time>
            {onMarkCollected && (
              <button
                type="button"
                onClick={() => onMarkCollected(donation._id)}
                disabled={collectingDonationId === donation._id}
              >
                {collectingDonationId === donation._id ? 'Updating...' : 'Mark Collected'}
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  </article>
);

export default BookedDonationsPanel;
