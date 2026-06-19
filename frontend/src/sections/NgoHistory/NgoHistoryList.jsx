import {
  formatDate,
  formatQuantity,
  getDonationImage,
  getPickupArea,
} from '../../utils/donationUtils';

const historyLabels = {
  collected: 'Collected',
};

const statusOptions = [
  { label: 'All history', value: '' },
  { label: 'Collected', value: 'collected' },
];

const NgoHistoryList = ({
  requests,
  totals,
  statusFilter,
  isLoading,
  onStatusChange,
  onViewDetails,
}) => (
  <section className="my-donations-panel ngo-history-panel">
    <div className="my-donations-heading ngo-available-heading">
      <div>
        <h2>Donation History</h2>
        <p>Review collected donation requests.</p>
      </div>
    </div>

    <div className="ngo-request-summary ngo-history-summary" role="tablist" aria-label="History tabs">
      <button
        type="button"
        className={`summary-chip all ${statusFilter === '' ? 'active' : ''}`}
        aria-pressed={statusFilter === ''}
        onClick={() => onStatusChange('')}
      >
        All History
        <strong>{totals.all}</strong>
      </button>
      <button
        type="button"
        className={`summary-chip collected ${statusFilter === 'collected' ? 'active' : ''}`}
        aria-pressed={statusFilter === 'collected'}
        onClick={() => onStatusChange('collected')}
      >
        Collected
        <strong>{totals.collected}</strong>
      </button>
    </div>

    <div className="ngo-donation-toolbar ngo-history-toolbar" aria-label="History filters">
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
      {isLoading && <p className="empty-state">Loading history...</p>}

      {!isLoading && requests.length === 0 && (
        <div className="my-donations-empty">
          <h3>No history yet</h3>
          <p>Collected requests will appear here.</p>
        </div>
      )}

      {!isLoading && requests.map((request) => {
        const donation = request.donation || {};
        const status = request.requestStatus;

        return (
          <article
            className="ngo-list-card ngo-history-card"
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
                  {historyLabels[status] || status}
                </span>
                <p>
                  {formatQuantity(donation.quantity)}
                  <span>•</span>
                  {getPickupArea(donation)}
                </p>
                <small>
                  Collected {formatDate(request.updatedAt || request.createdAt)}
                </small>
              </div>
            </div>

            <span className={`status-pill request-${status} ngo-desktop-status`}>
              {historyLabels[status] || status}
            </span>
          </article>
        );
      })}
    </div>
  </section>
);

export default NgoHistoryList;
