const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const AdminNgoDetailsModal = ({
  details,
  isLoading,
  actionNgoId,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!details && !isLoading) {
    return null;
  }

  const ngo = details?.ngo;
  const verification = details?.verification;
  const status = ngo?.ngoVerificationStatus || 'pending';
  const isActionLoading = actionNgoId === ngo?._id;

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section className="donation-modal admin-ngo-modal" role="dialog" aria-modal="true" aria-labelledby="ngo-details-title">
        <div className="modal-heading">
          <div>
            <p className="post-eyebrow">NGO Details</p>
            <h2 id="ngo-details-title">{ngo?.ngoName || 'NGO'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close details">×</button>
        </div>

        {isLoading && <p className="empty-state compact">Loading NGO details...</p>}

        {!isLoading && ngo && (
          <>
            <div className="donation-detail-grid admin-ngo-detail-grid">
              <p>
                <span>Organization Name</span>
                <strong>{ngo.ngoName || 'Not provided'}</strong>
              </p>
              <p>
                <span>Status</span>
                <strong className={`status-pill ${status}`}>{statusLabels[status] || status}</strong>
              </p>
              <p>
                <span>Email</span>
                <strong>{ngo.email}</strong>
              </p>
              <p>
                <span>Phone</span>
                <strong>{ngo.phone}</strong>
              </p>
              <p>
                <span>Registration Number</span>
                <strong>{ngo.ngoRegistrationNumber || 'Not provided'}</strong>
              </p>
              <p>
                <span>Address</span>
                <strong>{ngo.location?.address || 'Address not available'}</strong>
              </p>
              <p>
                <span>City</span>
                <strong>{ngo.location?.city || 'City not available'}</strong>
              </p>
              <p>
                <span>Uploaded Documents</span>
                {ngo.ngoDocument ? (
                  <a className="admin-document-link" href={ngo.ngoDocument} target="_blank" rel="noreferrer">
                    View document
                  </a>
                ) : (
                  <strong>No document uploaded</strong>
                )}
              </p>
              {verification?.rejectionReason && (
                <p className="admin-ngo-detail-wide">
                  <span>Rejection Reason</span>
                  <strong>{verification.rejectionReason}</strong>
                </p>
              )}
            </div>

            <div className="admin-modal-actions">
              <button
                className="approve"
                type="button"
                disabled={isActionLoading || status === 'approved'}
                onClick={() => onApprove(ngo._id)}
              >
                Approve
              </button>
              <button
                className="reject"
                type="button"
                disabled={isActionLoading || status === 'rejected'}
                onClick={() => onReject(ngo._id)}
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

export default AdminNgoDetailsModal;
