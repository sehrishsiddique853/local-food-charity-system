import { useNgoProfile } from '../hooks/useNgoProfile';
import { useNotifications } from '../hooks/useNotifications';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { NotificationsList } from '../sections/Notifications';
import '../styles/DonorDashboard.css';
import '../styles/MyDonationsPage.css';
import '../styles/NotificationsPage.css';

const NgoNotificationsPage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const {
    groupedNotifications,
    isLoading,
    errorMessage,
  } = useNotifications();

  return (
    <NgoLayout
      activeKey=""
      profile={profile}
      onLogout={handleLogout}
      pageClassName="notifications-page"
    >
      <section className="notifications-shell">
        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        <NotificationsList
          groupedNotifications={groupedNotifications}
          isLoading={isLoading}
        />
      </section>
    </NgoLayout>
  );
};

export default NgoNotificationsPage;
