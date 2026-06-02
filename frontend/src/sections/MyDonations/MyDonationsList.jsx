import { Link } from 'react-router-dom';
import { donationStatusClasses, donationStatusLabels } from '../../constants/donationConstants';
import { ROUTES } from '../../constants/routes';
import { formatDate, formatQuantity, getDonationImage } from '../../utils/donationUtils';

const statusOrder = ['all', 'available', 'requested', 'booked', 'collected', 'expired'];

const statusLabels = {
  all: 'All',
  available: 'Available',
  requested: 'Requested',
  booked: 'Booked',
  collected: 'Collected',
  expired: 'Expired',
};

const MyDonationsList = ({
  donations,
  totals,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => (
  <section className="my-donations-panel" id="my-donations-list">
    <div className="my-donations-heading">
      <div>
        <h2>Posted Donations</h2>
        <p>Track every donation you posted and manage available items.</p>
      </div>
      <Link className="post-primary-link" to={ROUTES.postDonation}>
        <span>＋</span>
        Post Donation
      </Link>
    </div>

    <div className="donation-status-summary" aria-label="Donation status summary">
      {statusOrder.map((status) => (
        <span className={`summary-chip ${status}`} key={status}>
          {statusLabels[status]}
          <strong>{totals[status] || 0}</strong>
        </span>
      ))}
    </div>

    {isLoading && <p className="empty-state">Loading your donations...</p>}

    {!isLoading && donations.length === 0 && (
      <div className="my-donations-empty">
        <h3>No donations posted yet</h3>
        <p>Your posted donations will appear here once you share surplus food.</p>
        <Link className="post-primary-link" to={ROUTES.postDonation}>Post Your First Donation</Link>
      </div>
    )}

    {!isLoading && donations.length > 0 && (
      <div className="my-donations-list">
        {donations.map((donation) => {
          const canManage = donation.status === 'available';

          return (
            <article className="my-donation-card" key={donation._id}>
              <img src={getDonationImage(donation)} alt={donation.foodTitle} />

              <div className="my-donation-copy">
                <strong>{donation.foodTitle}</strong>
                <p>
                  {formatQuantity(donation.quantity)}
                  <span>•</span>
                  {donation.pickupAddress?.address || 'Address not available'}
                </p>
                <small>Posted {formatDate(donation.createdAt)}</small>
              </div>

              <span className={`status-pill ${donationStatusClasses[donation.status] || 'available'}`}>
                {donationStatusLabels[donation.status] || donation.status}
              </span>

              <div className="donation-actions" aria-label={`${donation.foodTitle} actions`}>
                <button type="button" onClick={() => onView(donation)}>View</button>
                <button type="button" disabled={!canManage} onClick={() => onEdit(donation)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  disabled={!canManage}
                  onClick={() => onDelete(donation)}
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    )}
  </section>
);

export default MyDonationsList;
