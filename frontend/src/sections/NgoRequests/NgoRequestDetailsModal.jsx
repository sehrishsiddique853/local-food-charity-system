import {
  formatDate,
  formatQuantity,
  getDonationImage,
  getPickupArea,
} from '../../utils/donationUtils';

const requestStatusLabels = {
  pending: 'Pending',
  approved: 'Booked',
  collected: 'Collected',
  cancelled: 'Cancelled',
};

const NgoRequestDetailsModal = ({
  request,
  onClose,
  onCancelRequest,
  isCancelling = false,
}) => {
  if (!request) {
    return null;
  }

  const donation = request.donation || {};
  const status = request.requestStatus || 'pending';
  const isPending = status === 'pending';

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section className="donation-modal" role="dialog" aria-modal="true" aria-labelledby="request-details-title">
        <div className="modal-heading">
          <div>
            <p className="post-eyebrow">Request Details</p>
            <h2 id="request-details-title">{donation.foodTitle || 'Donation request'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close details">×</button>
        </div>

        <div className="donation-modal-content">
          <img className="modal-donation-image" src={getDonationImage(donation)} alt={donation.foodTitle || 'Donation'} />

          <div className="donation-detail-grid">
            <p>
              <span>Request Status</span>
              <strong className={`status-pill request-${status}`}>
                {requestStatusLabels[status] || status}
              </strong>
            </p>
            <p>
              <span>Quantity</span>
              <strong>{formatQuantity(donation.quantity)}</strong>
            </p>
            <p>
              <span>Pickup Area</span>
              <strong>{getPickupArea(donation)}</strong>
            </p>
            <p>
              <span>Requested</span>
              <strong>{formatDate(request.createdAt)}</strong>
            </p>
            <p>
              <span>Expiry Date</span>
              <strong>{formatDate(donation.expiryDate)}</strong>
            </p>
            <p>
              <span>Admin Message</span>
              <strong>{request.adminMessage || 'No message yet'}</strong>
            </p>
          </div>
        </div>

        {isPending && (
          <div className="modal-action-row">
            <button
              className="ngo-cancel-button"
              type="button"
              disabled={isCancelling}
              onClick={() => onCancelRequest(request._id)}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Request'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default NgoRequestDetailsModal;
