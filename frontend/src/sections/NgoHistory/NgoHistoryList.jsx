import {
  formatDate,
  formatQuantity,
  getDonationImage,
  getPickupArea,
} from '../../utils/donationUtils';

const historyLabels = {
  rejected: 'Rejected',
  collected: 'Collected',
};

const NgoHistoryList = ({ requests, totals, isLoading }) => (
  <section className="my-donations-panel ngo-history-panel">
    <div className="my-donations-heading ngo-available-heading">
      <div>
        <h2>History</h2>
        <p>Review rejected and collected donation requests.</p>
      </div>
    </div>

    <div className="ngo-request-summary ngo-history-summary">
      <article>
        <span>All History</span>
        <strong>{totals.all}</strong>
      </article>
      <article>
        <span>Rejected</span>
        <strong>{totals.rejected}</strong>
      </article>
      <article>
        <span>Collected</span>
        <strong>{totals.collected}</strong>
      </article>
    </div>

    <div className="ngo-history-list">
      {isLoading && <p className="empty-state">Loading history...</p>}

      {!isLoading && requests.length === 0 && (
        <div className="my-donations-empty">
          <h3>No history yet</h3>
          <p>Rejected and collected requests will appear here.</p>
        </div>
      )}

      {!isLoading && requests.map((request) => {
        const donation = request.donation || {};
        const status = request.requestStatus;

        return (
          <article className="ngo-history-row" key={request._id}>
            <img src={getDonationImage(donation)} alt={donation.foodTitle || 'Donation'} />
            <div>
              <div className="ngo-history-title">
                <strong>{donation.foodTitle || 'Donation request'}</strong>
                <span className={`status-pill request-${status}`}>
                  {historyLabels[status] || status}
                </span>
              </div>
              <p>
                {formatQuantity(donation.quantity)}
                <span>•</span>
                {getPickupArea(donation)}
                <span>•</span>
                {formatDate(request.updatedAt || request.createdAt)}
              </p>
              {request.adminMessage && <p className="ngo-history-note">{request.adminMessage}</p>}
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export default NgoHistoryList;
