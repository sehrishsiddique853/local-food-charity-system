import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { formatDate } from '../../utils/donationUtils';
import { notificationTypeIcons, notificationTypeLabels } from '../../utils/notificationUtils';

const NotificationsList = ({
  groupedNotifications,
  unreadCount,
  isLoading,
  onMarkRead,
  onMarkAllRead,
}) => {
  const notifications = [
    ...groupedNotifications.unread,
    ...groupedNotifications.read,
  ];

  return (
    <section className="notifications-panel">
      <div className="notifications-heading">
        <div>
          <h2>Notifications</h2>
          <p>Stay updated on donation activity, approvals, and system messages.</p>
        </div>
        <div className="notifications-actions">
          <Link className="post-primary-link secondary-notification-link" to={ROUTES.myDonations}>
            My Donations
          </Link>
          <button type="button" disabled={!unreadCount} onClick={onMarkAllRead}>
            Mark All Read
          </button>
        </div>
      </div>

      <div className="notifications-summary" aria-label="Notification summary">
        <span className="summary-chip all">
          All
          <strong>{notifications.length}</strong>
        </span>
        <span className="summary-chip requested">
          Unread
          <strong>{unreadCount}</strong>
        </span>
        <span className="summary-chip collected">
          Read
          <strong>{groupedNotifications.read.length}</strong>
        </span>
      </div>

      {isLoading && <p className="empty-state">Loading notifications...</p>}

      {!isLoading && notifications.length === 0 && (
        <div className="my-donations-empty">
          <h3>No notifications yet</h3>
          <p>Donation updates and system messages will appear here.</p>
          <Link className="post-primary-link" to={ROUTES.postDonation}>Post Donation</Link>
        </div>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <article
              className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
              key={notification._id}
            >
              <span className={`notification-icon ${notification.type || 'system'}`} aria-hidden="true">
                {notificationTypeIcons[notification.type] || notificationTypeIcons.system}
              </span>

              <div className="notification-copy">
                <div>
                  <strong>{notification.title}</strong>
                  <span>{notificationTypeLabels[notification.type] || 'System'}</span>
                </div>
                <p>{notification.message}</p>
                <small>{formatDate(notification.createdAt)}</small>
              </div>

              {!notification.isRead && (
                <button type="button" onClick={() => onMarkRead(notification._id)}>
                  Mark Read
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default NotificationsList;
