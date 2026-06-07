import {
  formatDate,
  formatQuantity,
  getDonationImage,
  getPickupArea,
} from '../../utils/donationUtils';

const requestStatusLabels = {
  pending: 'Pending',
  approved: 'Booked',
};

const statusOptions = [
  { label: 'All active requests', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Booked', value: 'approved' },
];

const NgoRequestsList = ({
  requests,
  summary,
  statusFilter,
  isLoading,
  cancellingRequestId,
  onStatusChange,
  onViewDetails,
  onCancelRequest,
}) => (
  <section className="my-donations-panel ngo-requests-panel">
    <div className="my-donations-heading ngo-available-heading">
      <div>
        <h2>My Requests</h2>
        <p>Track pending and booked donation requests.</p>
      </div>
    </div>

    <div className="ngo-request-summary">
      <article>
        <span>Pending</span>
        <strong>{summary.pending}</strong>
      </article>
      <article>
        <span>Booked</span>
        <strong>{summary.approved}</strong>
      </article>
    </div>

    <div className="ngo-donation-toolbar ngo-requests-toolbar" aria-label="Request filters">
      <label>
        <span>Filter by status</span>
        <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          {statusOptions.map((option) => (
            <option value={option.value} key={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    </div>

    <div className="ngo-available-list">
      {isLoading && <p className="empty-state">Loading requests...</p>}

      {!isLoading && requests.length === 0 && (
        <div className="my-donations-empty">
          <h3>No requests found</h3>
          <p>Pending and booked requests will appear here.</p>
        </div>
      )}

      {!isLoading && requests.map((request) => {
        const donation = request.donation || {};
        const status = request.requestStatus || 'pending';
        const isPending = status === 'pending';

        return (
          <article
            className="ngo-list-card ngo-request-card"
            key={request._id}
            role="button"
            tabIndex={0}
            onClick={() => onViewDetails(request)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onViewDetails(request);
              }
            }}
          >
            <div className="ngo-list-main">
              <img src={getDonationImage(donation)} alt={donation.foodTitle || 'Donation'} />

              <div className="ngo-list-copy">
                <strong>{donation.foodTitle || 'Donation request'}</strong>
                <span className={`status-pill request-${status} ngo-mobile-status`}>
                  {requestStatusLabels[status] || status}
                </span>
                <p>
                  {formatQuantity(donation.quantity)}
                  <span>•</span>
                  {getPickupArea(donation)}
                </p>
                <small>Requested {formatDate(request.createdAt)}</small>
              </div>
            </div>

            <span className={`status-pill request-${status} ngo-desktop-status`}>
              {requestStatusLabels[status] || status}
            </span>

            <div className="ngo-list-actions ngo-request-actions">
              {isPending && (
                <button
                  className="ngo-cancel-button"
                  type="button"
                  disabled={cancellingRequestId === request._id}
                  onClick={(event) => {
                    event.stopPropagation();
                    onCancelRequest(request._id);
                  }}
                >
                  {cancellingRequestId === request._id ? 'Cancelling...' : 'Cancel Request'}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export default NgoRequestsList;
