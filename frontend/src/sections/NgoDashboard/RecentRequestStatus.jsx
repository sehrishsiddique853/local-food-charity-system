import { Link } from 'react-router-dom';
import { formatDate, formatQuantity } from '../../utils/donationUtils';

const requestStatusLabels = {
  pending: 'Pending',
  approved: 'Booked',
  rejected: 'Rejected',
};

const RecentRequestStatus = ({
  requests,
  isLoading,
  title = 'Recent Requested Donations',
  viewAllHref = '',
}) => (
  <article className="dashboard-panel request-status-panel" id="request-status">
    <div className="panel-heading">
      <h2>{title}</h2>
      {viewAllHref && <Link to={viewAllHref}>View All</Link>}
    </div>

    <div className="request-status-list">
      {isLoading && <p className="empty-state">Loading request status...</p>}
      {!isLoading && requests.length === 0 && (
        <p className="empty-state">No requests submitted yet.</p>
      )}
      {requests.map((request) => {
        const donation = request.donation || {};
        const status = request.requestStatus || 'pending';

        return (
          <article className="request-status-row" key={request._id}>
            <div>
              <strong>{donation.foodTitle || 'Donation request'}</strong>
              <p>
                {formatQuantity(donation.quantity)}
                <span>•</span>
                Requested {formatDate(request.createdAt)}
              </p>
            </div>
            <span className={`status-pill request-${status}`}>
              {requestStatusLabels[status] || status}
            </span>
          </article>
        );
      })}
    </div>
  </article>
);

export default RecentRequestStatus;
