import {
  formatDate,
  formatQuantity,
  getDonationImage,
  getPickupArea,
} from '../../utils/donationUtils';

const getDonorName = (donation) =>
  donation.donor?.name || donation.donor?.ngoName || 'Donor';

const getDonorContact = (donation) =>
  donation.donor?.phone || donation.donor?.email || 'Contact not available';

const NgoBookedDonationsList = ({
  donations,
  isLoading,
  collectingDonationId,
  onViewDetails,
  onMarkCollected,
}) => (
  <section className="my-donations-panel ngo-available-panel ngo-booked-panel">
    <div className="my-donations-heading ngo-available-heading">
      <div>
        <h2>Booked Donations</h2>
        <p>Donations approved by admin and ready for collection.</p>
      </div>
    </div>

    <div className="ngo-available-list">
      {isLoading && <p className="empty-state">Loading booked donations...</p>}

      {!isLoading && donations.length === 0 && (
        <div className="my-donations-empty">
          <h3>No booked donations yet</h3>
          <p>Admin-approved donations will appear here.</p>
        </div>
      )}

      {!isLoading && donations.map((donation) => (
        <article
          className="ngo-list-card ngo-booked-card"
          key={donation._id}
          role="button"
          tabIndex={0}
          onClick={() => onViewDetails(donation)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onViewDetails(donation);
            }
          }}
        >
          <div className="ngo-list-main">
            <img src={getDonationImage(donation)} alt={donation.foodTitle} />

            <div className="ngo-list-copy">
              <strong>{donation.foodTitle}</strong>
              <span className="status-pill request-approved ngo-mobile-status">Booked</span>
              <p>
                {formatQuantity(donation.quantity)}
                <span>•</span>
                {getPickupArea(donation)}
              </p>
              <small>
                Donor: {getDonorName(donation)} · {getDonorContact(donation)}
              </small>
            </div>
          </div>

          <span className="status-pill request-approved ngo-desktop-status">Booked</span>

          <div className="ngo-list-actions">
            <button
              className="ngo-request-button"
              type="button"
              disabled={collectingDonationId === donation._id}
              onClick={(event) => {
                event.stopPropagation();
                onMarkCollected(donation._id);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {collectingDonationId === donation._id ? 'Updating...' : 'Mark as Collected'}
            </button>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default NgoBookedDonationsList;
