import { donationStatusClasses, donationStatusLabels } from '../../constants/donationConstants';
import { formatDate, formatQuantity, getDonationImage } from '../../utils/donationUtils';

const DonationDetailsModal = ({ donation, onClose }) => {
  if (!donation) {
    return null;
  }

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section className="donation-modal" role="dialog" aria-modal="true" aria-labelledby="donation-details-title">
        <div className="modal-heading">
          <div>
            <p className="post-eyebrow">Donation Details</p>
            <h2 id="donation-details-title">{donation.foodTitle}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close details">×</button>
        </div>

        <img className="modal-donation-image" src={getDonationImage(donation)} alt={donation.foodTitle} />

        <div className="donation-detail-grid">
          <p>
            <span>Status</span>
            <strong className={`status-pill ${donationStatusClasses[donation.status] || 'available'}`}>
              {donationStatusLabels[donation.status] || donation.status}
            </strong>
          </p>
          <p>
            <span>Quantity</span>
            <strong>{formatQuantity(donation.quantity)}</strong>
          </p>
          <p>
            <span>Pickup Address</span>
            <strong>{donation.pickupAddress?.address || 'Address not available'}</strong>
          </p>
          <p>
            <span>Expiry Date</span>
            <strong>{formatDate(donation.expiryDate)}</strong>
          </p>
          <p>
            <span>Posted</span>
            <strong>{formatDate(donation.createdAt)}</strong>
          </p>
          <p>
            <span>Description</span>
            <strong>{donation.description || 'No description provided'}</strong>
          </p>
        </div>
      </section>
    </div>
  );
};

export default DonationDetailsModal;
