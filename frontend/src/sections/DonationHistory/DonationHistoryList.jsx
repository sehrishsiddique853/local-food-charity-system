import { Link } from 'react-router-dom';
import { donationStatusClasses, donationStatusLabels } from '../../constants/donationConstants';
import { ROUTES } from '../../constants/routes';
import { formatDate, formatQuantity, getDonationImage } from '../../utils/donationUtils';

const historyGroups = [
  {
    key: 'collected',
    title: 'Collected Donations',
    description: 'Food donations that were picked up and marked collected.',
    statuses: ['collected', 'completed'],
  },
  {
    key: 'expired',
    title: 'Expired Donations',
    description: 'Donations that passed their expiry time before completion.',
    statuses: ['expired'],
  },
  {
    key: 'cancelled',
    title: 'Cancelled / Deleted Donations',
    description: 'Donations removed from active listings.',
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
      <div className="history-heading-actions">
        <Link className="post-primary-link secondary-history-link" to={ROUTES.myDonations}>
          My Donations
        </Link>
        <Link className="post-primary-link" to={ROUTES.postDonation}>
          <span>＋</span>
          Post Donation
        </Link>
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
        <Link className="post-primary-link" to={ROUTES.myDonations}>View Active Donations</Link>
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
                  <p>{group.description}</p>
                </div>
                <strong>{groupDonations.length}</strong>
              </div>

              {groupDonations.length === 0 ? (
                <p className="history-empty-row">No {group.title.toLowerCase()} yet.</p>
              ) : (
                <div className="history-list">
                  {groupDonations.map((donation) => (
                    <article className="history-card" key={donation._id}>
                      <img src={getDonationImage(donation)} alt={donation.foodTitle} />

                      <div className="my-donation-copy">
                        <strong>{donation.foodTitle}</strong>
                        <p>
                          {formatQuantity(donation.quantity)}
                          <span>•</span>
                          {donation.pickupAddress?.address || 'Address not available'}
                        </p>
                        <small>Posted {formatDate(donation.createdAt)}</small>
                      </div>

                      <span className={`status-pill ${donationStatusClasses[donation.status] || 'expired'}`}>
                        {donationStatusLabels[donation.status] || donation.status}
                      </span>

                      <button type="button" onClick={() => onView(donation)}>View</button>
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
