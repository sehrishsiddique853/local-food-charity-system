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
            className="ngo-available-card ngo-request-card"
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
            <div className="ngo-card-body">
              <img src={getDonationImage(donation)} alt={donation.foodTitle || 'Donation'} />

              <div className="ngo-available-copy">
                <div>
                  <strong>{donation.foodTitle || 'Donation request'}</strong>
                  <span className={`request-badge request-${status}`}>
                    <i aria-hidden="true"></i>
                    {requestStatusLabels[status] || status}
                  </span>
                </div>

                <dl className="ngo-donation-meta">
                  <div>
                    <span className="meta-icon quantity" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M6 3v18" />
                        <path d="M10 3v18" />
                        <path d="M15 4v8" />
                        <path d="M18 4v8" />
                        <path d="M15 12c0 3 3 3 3 6v3" />
                      </svg>
                    </span>
                    <dt>Quantity</dt>
                    <dd>{formatQuantity(donation.quantity)}</dd>
                  </div>
                  <div>
                    <span className="meta-icon expiry" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <path d="M4 9h16" />
                        <path d="M5 5h14v17H5z" />
                      </svg>
                    </span>
                    <dt>Requested</dt>
                    <dd>{formatDate(request.createdAt)}</dd>
                  </div>
                  <div>
                    <span className="meta-icon area" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z" />
                        <path d="M12 10.5h.01" />
                      </svg>
                    </span>
                    <dt>Pickup Area</dt>
                    <dd>{getPickupArea(donation)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="ngo-card-action ngo-request-actions">
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
