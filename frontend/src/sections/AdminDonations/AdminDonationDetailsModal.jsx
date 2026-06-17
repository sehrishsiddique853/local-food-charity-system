import { donationStatusLabels } from '../../constants/donationConstants';
import {
  formatDate,
  formatQuantity,
  getDonationImage,
  getPickupArea,
} from '../../utils/donationUtils';

const requestStatusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  collected: 'Collected',
  cancelled: 'Cancelled',
};

const getDonorContact = (donor) => donor?.phone || donor?.email || 'Contact not available';

const terminalDonationStatuses = ['collected', 'completed', 'expired'];

const AdminDonationDetailsModal = ({
  details,
  isLoading,
  actionDonationId,
  onClose,
  onCancelBooking,
  onDelete,
  onMarkCollected,
  onMarkExpired,
}) => {
  if (!details && !isLoading) {
    return null;
  }

  const donation = details?.donation;
  const requests = details?.requests || [];
  const donor = donation?.donor;
  const status = donation?.status || 'available';
  const isActionLoading = actionDonationId === donation?._id;
  const showAvailableActions = ['available', 'requested'].includes(status);
  const showBookedActions = status === 'booked';
  const showNoActions = terminalDonationStatuses.includes(status);

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section
        className="donation-modal admin-donation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-details-title"
      >
        <div className="modal-heading">
          <div>
            <p className="post-eyebrow">Donation Details</p>
            <h2 id="donation-details-title">{donation?.foodTitle || 'Donation'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close details">×</button>
        </div>

        {isLoading && <p className="empty-state compact">Loading donation details...</p>}

        {!isLoading && donation && (
          <>
            <img
              className="modal-donation-image"
              src={getDonationImage(donation)}
              alt={donation.foodTitle || 'Donation'}
            />

            <div className="donation-detail-grid admin-donation-detail-grid">
              <p>
                <span>Current Status</span>
                <strong className={`status-pill ${status}`}>
                  {donationStatusLabels[status] || status}
                </strong>
              </p>
              <p>
                <span>Food Name</span>
                <strong>{donation.foodTitle || 'Donation'}</strong>
              </p>
              <p>
                <span>Donor</span>
                <strong>{donor?.name || donor?.email || 'Donor not available'}</strong>
              </p>
              <p>
                <span>Donor Contact</span>
                <strong>{getDonorContact(donor)}</strong>
              </p>
              <p>
                <span>Quantity</span>
                <strong>{formatQuantity(donation.quantity)}</strong>
              </p>
              <p>
                <span>Food Type</span>
                <strong>{donation.foodType || 'Not specified'}</strong>
              </p>
              <p>
                <span>Expiry Date</span>
                <strong>{formatDate(donation.expiryDate)}</strong>
              </p>
              <p>
                <span>Pickup Area</span>
                <strong>{getPickupArea(donation)}</strong>
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

            <section className="admin-donation-requests">
              <h3>Donation Requests</h3>
              {!requests.length ? (
                <p className="empty-state compact">No NGO requests for this donation yet.</p>
              ) : (
                <div className="admin-donation-request-list">
                  {requests.map((request) => {
                    const requestStatus = request.requestStatus || 'pending';
                    return (
                      <div className="admin-donation-request-item" key={request._id}>
                        <div>
                          <strong>
                            {request.ngo?.ngoName || request.ngo?.organizationName || 'NGO'}
                          </strong>
                          <span>{formatDate(request.createdAt)}</span>
                        </div>
                        <span className={`status-pill ${requestStatus}`}>
                          {requestStatusLabels[requestStatus] || requestStatus}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="admin-modal-actions">
              {showAvailableActions && (
                <>
                  <button
                    className="warning"
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => onMarkExpired(donation._id)}
                  >
                    Mark Expired
                  </button>
                  <button
                    className="delete"
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => onDelete(donation._id)}
                  >
                    Delete Donation
                  </button>
                </>
              )}

              {showBookedActions && (
                <>
                  <button
                    className="approve"
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => onMarkCollected(donation._id)}
                  >
                    Mark Collected
                  </button>
                  <button
                    className="warning"
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => onCancelBooking(donation._id)}
                  >
                    Cancel Booking
                  </button>
                </>
              )}

              {showNoActions && (
                <p className="admin-no-actions">No actions available</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminDonationDetailsModal;
