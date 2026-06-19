import { formatDate, formatQuantity, getDonationImage, getPickupArea } from '../../utils/donationUtils';

const requestStatusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  collected: 'Collected',
};

const AdminRequestDetailsModal = ({
  request,
  isLoading,
  actionRequestId,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!request && !isLoading) {
    return null;
  }

  const donation = request?.donation;
  const ngo = request?.ngo;
  const status = request?.requestStatus || 'pending';
  const isActionLoading = actionRequestId === request?._id;

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section className="donation-modal admin-request-modal" role="dialog" aria-modal="true" aria-labelledby="request-details-title">
        <div className="modal-heading">
          <div>
            <p className="post-eyebrow">Request Details</p>
            <h2 id="request-details-title">{donation?.foodTitle || 'Donation Request'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close details">×</button>
        </div>

        {isLoading && <p className="empty-state compact">Loading request details...</p>}

        {!isLoading && request && (
          <>
            {donation && (
              <img
                className="modal-donation-image"
                src={getDonationImage(donation)}
                alt={donation.foodTitle || 'Donation'}
              />
            )}

            <div className="donation-detail-grid admin-request-detail-grid">
              <p>
                <span>Status</span>
                <strong className={`status-pill ${status}`}>
                  {requestStatusLabels[status] || status}
                </strong>
              </p>
              <p>
                <span>Request Date</span>
                <strong>{formatDate(request.createdAt)}</strong>
              </p>
              <p>
                <span>Donation</span>
                <strong>{donation?.foodTitle || 'Donation not available'}</strong>
              </p>
              <p>
                <span>Quantity</span>
                <strong>{formatQuantity(donation?.quantity)}</strong>
              </p>
              <p>
                <span>Pickup Area</span>
                <strong>{getPickupArea(donation)}</strong>
              </p>
              <p>
                <span>Expiry Date</span>
                <strong>{formatDate(donation?.expiryDate)}</strong>
              </p>
              <p>
                <span>NGO Name</span>
                <strong>{ngo?.ngoName || ngo?.organizationName || 'NGO'}</strong>
              </p>
              <p>
                <span>NGO Contact</span>
                <strong>{ngo?.phone || ngo?.email || 'Contact not available'}</strong>
              </p>
              {donation?.donor && (
                <>
                  <p>
                    <span>Donor</span>
                    <strong>{donation.donor.name || 'Donor'}</strong>
                  </p>
                  <p>
                    <span>Donor Contact</span>
                    <strong>{donation.donor.phone || donation.donor.email || 'Contact not available'}</strong>
                  </p>
                </>
              )}
              {request.adminMessage && (
                <p className="admin-request-detail-wide">
                  <span>Admin Message</span>
                  <strong>{request.adminMessage}</strong>
                </p>
              )}
            </div>

            <div className="admin-modal-actions">
              <button
                className="approve"
                type="button"
                disabled={isActionLoading || status !== 'pending'}
                onClick={() => onApprove(request._id)}
              >
                Approve
              </button>
              <button
                className="reject"
                type="button"
                disabled={isActionLoading || status !== 'pending'}
                onClick={() => onReject(request._id)}
              >
                Reject
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminRequestDetailsModal;
