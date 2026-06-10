import { donationStatusClasses, donationStatusLabels } from '../../constants/donationConstants';
import { formatDate, formatQuantity, getDonationImage } from '../../utils/donationUtils';

const statusOrder = ['all', 'available', 'requested', 'booked'];

const statusLabels = {
  all: 'All',
  available: 'Available',
  requested: 'Requested',
  booked: 'Booked',
};

const MyDonationsList = ({
  donations,
  totals,
  selectedStatus,
  onStatusChange,
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
    </div>

    <div className="donation-status-summary" role="tablist" aria-label="Donation status tabs">
      {statusOrder.map((status) => (
        <button
          type="button"
          className={`summary-chip ${status} ${selectedStatus === status ? 'active' : ''}`}
          key={status}
          aria-pressed={selectedStatus === status}
          onClick={() => onStatusChange(status)}
        >
          <span>{statusLabels[status]}</span>
          <strong>{totals[status] || 0}</strong>
        </button>
      ))}
    </div>

    {isLoading && <p className="empty-state">Loading your donations...</p>}

    {!isLoading && donations.length === 0 && (
      <div className="my-donations-empty">
        <h3>No donations posted yet</h3>
        <p>Your posted donations will appear here once you share surplus food.</p>
      </div>
    )}

    {!isLoading && donations.length > 0 && (
      <div className="my-donations-list">
        {donations.map((donation) => {
          const canManage = donation.status === 'available';

          return (
            <article
              className="my-donation-card"
              key={donation._id}
              role="button"
              tabIndex={0}
              onClick={() => onView(donation)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onView(donation);
                }
              }}
            >
              <img src={getDonationImage(donation)} alt={donation.foodTitle} />

              <div className="my-donation-copy">
                <strong>{donation.foodTitle}</strong>
                <span className={`status-pill donor-mobile-status ${donationStatusClasses[donation.status] || 'available'}`}>
                  {donationStatusLabels[donation.status] || donation.status}
                </span>
                <p>
                  {formatQuantity(donation.quantity)}
                  <span>•</span>
                  {donation.pickupAddress?.address || 'Address not available'}
                </p>
                <small>Posted {formatDate(donation.createdAt)}</small>
              </div>

              <span className={`status-pill donor-desktop-status ${donationStatusClasses[donation.status] || 'available'}`}>
                {donationStatusLabels[donation.status] || donation.status}
              </span>

              <div className="donation-actions" aria-label={`${donation.foodTitle} actions`}>
                <button
                  type="button"
                  className="edit"
                  disabled={!canManage}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(donation);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  disabled={!canManage}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(donation);
                  }}
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
