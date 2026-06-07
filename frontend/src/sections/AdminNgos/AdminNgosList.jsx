const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const getNgoStatus = (ngo) => ngo.ngoVerificationStatus || 'pending';

const AdminNgosList = ({
  ngos,
  isLoading,
  actionNgoId,
  onOpenDetails,
  onApprove,
  onReject,
}) => {
  if (isLoading) {
    return <p className="empty-state">Loading NGOs...</p>;
  }

  if (!ngos.length) {
    return (
      <div className="my-donations-empty">
        <h3>No NGOs found</h3>
        <p>NGO registration records will appear here.</p>
      </div>
    );
  }

  return (
    <div className="admin-ngo-table" role="table" aria-label="NGO management table">
      <div className="admin-ngo-table-head" role="row">
        <span>Organization Name</span>
        <span>Email</span>
        <span>Phone</span>
        <span>Registration Number</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      <div className="admin-ngo-list">
        {ngos.map((ngo) => {
          const status = getNgoStatus(ngo);
          const isActionLoading = actionNgoId === ngo._id;

          return (
            <article
              className="admin-ngo-row"
              key={ngo._id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetails(ngo._id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenDetails(ngo._id);
                }
              }}
            >
              <strong>{ngo.ngoName || ngo.organizationName || 'NGO'}</strong>
              <span>{ngo.email}</span>
              <span>{ngo.phone}</span>
              <span>{ngo.ngoRegistrationNumber || 'Not provided'}</span>
              <span className={`status-pill ${status}`}>{statusLabels[status] || status}</span>
              <div className="admin-ngo-actions">
                <button
                  className="approve"
                  type="button"
                  disabled={isActionLoading || status === 'approved'}
                  onClick={(event) => {
                    event.stopPropagation();
                    onApprove(ngo._id);
                  }}
                >
                  Approve
                </button>
                <button
                  className="reject"
                  type="button"
                  disabled={isActionLoading || status === 'rejected'}
                  onClick={(event) => {
                    event.stopPropagation();
                    onReject(ngo._id);
                  }}
                >
                  Reject
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNgosList;
