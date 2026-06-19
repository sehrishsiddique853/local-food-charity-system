import { formatDate, formatQuantity } from '../../utils/donationUtils';

const requestStatusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  collected: 'Collected',
};

const getRequestStatus = (request) => request.requestStatus || 'pending';

const getDonationTitle = (request) => request.donation?.foodTitle || 'Donation';

const getNgoName = (request) =>
  request.ngo?.ngoName || request.ngo?.organizationName || request.ngo?.name || 'NGO';

const AdminRequestsList = ({
  requests,
  isLoading,
  actionRequestId,
  onOpenDetails,
  onApprove,
  onReject,
}) => {
  if (isLoading) {
    return <p className="empty-state">Loading requests...</p>;
  }

  if (!requests.length) {
    return (
      <div className="my-donations-empty">
        <h3>No requests found</h3>
        <p>Donation requests from NGOs will appear here.</p>
      </div>
    );
  }

  return (
    <div className="admin-request-table" role="table" aria-label="Donation request management table">
      <div className="admin-request-table-head" role="row">
        <span>Donation</span>
        <span>NGO Name</span>
        <span>Request Date</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      <div className="admin-request-list">
        {requests.map((request) => {
          const status = getRequestStatus(request);
          const isActionLoading = actionRequestId === request._id;

          return (
            <article
              className="admin-request-row"
              key={request._id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetails(request._id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenDetails(request._id);
                }
              }}
            >
              <div className="admin-request-donation">
                <strong>{getDonationTitle(request)}</strong>
                <small>{formatQuantity(request.donation?.quantity)}</small>
              </div>
              <span>{getNgoName(request)}</span>
              <time>{formatDate(request.createdAt)}</time>
              <span className={`status-pill ${status}`}>
                {requestStatusLabels[status] || status}
              </span>
              <div className="admin-request-actions">
                <button
                  className="approve"
                  type="button"
                  disabled={isActionLoading || status !== 'pending'}
                  onClick={(event) => {
                    event.stopPropagation();
                    onApprove(request._id);
                  }}
                >
                  Approve
                </button>
                <button
                  className="reject"
                  type="button"
                  disabled={isActionLoading || status !== 'pending'}
                  onClick={(event) => {
                    event.stopPropagation();
                    onReject(request._id);
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

export default AdminRequestsList;
