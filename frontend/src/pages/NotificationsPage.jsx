import { useDonorProfile } from '../hooks/useDonorProfile';
import { useNotifications } from '../hooks/useNotifications';
import DonorLayout from '../layouts/DonorLayout/DonorLayout';
import { NotificationsList } from '../sections/Notifications';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';
import '../styles/NotificationsPage.css';

const NotificationsPage = () => {
  const { profile, profileError, handleLogout } = useDonorProfile();
  const {
    groupedNotifications,
    isLoading,
    errorMessage,
  } = useNotifications();

  return (
    <DonorLayout
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
    </DonorLayout>
  );
};

export default NotificationsPage;
