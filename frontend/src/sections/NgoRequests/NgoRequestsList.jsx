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

const requestTabs = [
  { key: 'all', label: 'All', value: '' },
  { key: 'pending', label: 'Pending', value: 'pending' },
  { key: 'approved', label: 'Booked', value: 'approved' },
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
}) => {
  const requestCounts = {
    all: (summary.pending || 0) + (summary.approved || 0),
    pending: summary.pending || 0,
    approved: summary.approved || 0,
  };

  return (
    <section className="my-donations-panel ngo-requests-panel">
      <div className="my-donations-heading ngo-available-heading">
        <div>
          <h2>My Requests</h2>
          <p>Track pending and booked donation requests.</p>
        </div>
      </div>

      <div className="ngo-request-tabs" role="tablist" aria-label="Request status filters">
        {requestTabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            role="tab"
            aria-selected={statusFilter === tab.value}
            className={statusFilter === tab.value ? 'is-active' : ''}
            onClick={() => onStatusChange(tab.value)}
          >
            <span>{tab.label}</span>
            <strong>{requestCounts[tab.key]}</strong>
          </button>
        ))}
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
};

export default NgoRequestsList;
