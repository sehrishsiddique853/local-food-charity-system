import { donationStatusClasses, donationStatusLabels } from '../../constants/donationConstants';
import { formatDate, formatQuantity, getDonationImage } from '../../utils/donationUtils';

const historyGroups = [
  {
    key: 'collected',
    title: 'Collected Donations',
    statuses: ['collected', 'completed'],
  },
  {
    key: 'expired',
    title: 'Expired Donations',
    statuses: ['expired'],
  },
  {
    key: 'cancelled',
    title: 'Cancelled Donations',
    statuses: ['cancelled'],
  },
];

const DonationHistoryList = ({ donations, totals, isLoading, onView }) => (
  <section className="history-panel">
    <div className="my-donations-heading">
      <div>
        <h2>Donation History</h2>
        <p>Review donations that are no longer active.</p>
      </div>
    </div>

    <div className="history-summary" aria-label="Donation history summary">
      <span className="summary-chip all">
        All History
        <strong>{totals.all || 0}</strong>
      </span>
      <span className="summary-chip collected">
        Collected
        <strong>{totals.collected || 0}</strong>
      </span>
      <span className="summary-chip expired">
        Expired
        <strong>{totals.expired || 0}</strong>
      </span>
      <span className="summary-chip cancelled">
        Cancelled
        <strong>{totals.cancelled || 0}</strong>
      </span>
    </div>

    {isLoading && <p className="empty-state">Loading donation history...</p>}

    {!isLoading && donations.length === 0 && (
      <div className="my-donations-empty">
        <h3>No donation history yet</h3>
        <p>Collected, expired, and cancelled donations will appear here.</p>
      </div>
    )}

    {!isLoading && donations.length > 0 && (
      <div className="history-groups">
        {historyGroups.map((group) => {
          const groupDonations = donations.filter((donation) => group.statuses.includes(donation.status));

          return (
            <article className="history-group" key={group.key}>
              <div className="history-group-heading">
                <div>
                  <h3>{group.title}</h3>
                </div>
              </div>

              {groupDonations.length === 0 ? (
                <p className="history-empty-row">No {group.title.toLowerCase()} yet.</p>
              ) : (
                <div className="history-list">
                  {groupDonations.map((donation) => (
                    <article
                      className="history-card"
                      key={donation._id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onView(donation)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onView(donation);
                        }
                      }}
                    >
                      <img src={getDonationImage(donation)} alt={donation.foodTitle} />

                      <div className="my-donation-copy">
                        <strong>{donation.foodTitle}</strong>
                        <span className={`status-pill donor-mobile-status ${donationStatusClasses[donation.status] || 'expired'}`}>
                          {donationStatusLabels[donation.status] || donation.status}
                        </span>
                        <p>
                          {formatQuantity(donation.quantity)}
                          <span>•</span>
                          {donation.pickupAddress?.address || 'Address not available'}
                        </p>
                        <small>Posted {formatDate(donation.createdAt)}</small>
                      </div>

                      <span className={`status-pill donor-desktop-status ${donationStatusClasses[donation.status] || 'expired'}`}>
                        {donationStatusLabels[donation.status] || donation.status}
                      </span>

                    </article>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    )}
  </section>
);

export default DonationHistoryList;
