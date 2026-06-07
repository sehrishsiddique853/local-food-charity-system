import { useAdminProfile } from '../hooks/useAdminProfile';
import { useNotifications } from '../hooks/useNotifications';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import { NotificationsList } from '../sections/Notifications';
import '../styles/DonorDashboard.css';
import '../styles/MyDonationsPage.css';
import '../styles/NotificationsPage.css';

const AdminNotificationsPage = () => {
  const { profile, profileError, handleLogout } = useAdminProfile();
  const {
    groupedNotifications,
    isLoading,
    errorMessage,
  } = useNotifications();

  return (
    <AdminLayout
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
          title="Admin Notifications"
          description="Review NGO registrations, donation requests, collection updates, and expiry alerts."
          emptyDescription="New NGO registrations, donation requests, collection updates, and expiry alerts will appear here."
        />
      </section>
    </AdminLayout>
  );
};

export default AdminNotificationsPage;
