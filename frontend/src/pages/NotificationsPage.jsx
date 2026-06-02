import { useDonorProfile } from '../hooks/useDonorProfile';
import { useNotifications } from '../hooks/useNotifications';
import DonorLayout from '../layouts/DonorLayout/DonorLayout';
import { NotificationsList } from '../sections/Notifications';
import PostDonationIntro from '../sections/PostDonationIntro';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';
import '../styles/NotificationsPage.css';

const NotificationsPage = () => {
  const { profile, profileError, handleLogout } = useDonorProfile();
  const {
    groupedNotifications,
    unreadCount,
    isLoading,
    errorMessage,
    markRead,
    markAllRead,
  } = useNotifications();

  return (
    <DonorLayout
      activeKey=""
      profile={profile}
      onLogout={handleLogout}
      pageClassName="notifications-page"
    >
      <section className="notifications-shell">
        <PostDonationIntro
          eyebrow="Notifications"
          title="Track important system updates."
          description="Donation requests, approvals, collection updates, and account messages appear here."
          imageAlt="Food donation volunteers"
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        <NotificationsList
          groupedNotifications={groupedNotifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
        />
      </section>
    </DonorLayout>
  );
};

export default NotificationsPage;
