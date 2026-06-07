import { formatDate } from '../../utils/donationUtils';
import { notificationTypeIcons, notificationTypeLabels } from '../../utils/notificationUtils';

const NotificationsList = ({
  groupedNotifications,
  isLoading,
  title = 'Notifications',
  description = 'Stay updated on donation activity, approvals, and system messages.',
  emptyTitle = 'No notifications yet',
  emptyDescription = 'Donation updates and system messages will appear here.',
}) => {
  const notifications = [
    ...groupedNotifications.unread,
    ...groupedNotifications.read,
  ];

  return (
    <section className="notifications-panel">
      <div className="notifications-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {isLoading && <p className="empty-state">Loading notifications...</p>}

      {!isLoading && notifications.length === 0 && (
        <div className="my-donations-empty">
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default NotificationsList;
