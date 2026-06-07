import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useAdminProfile } from '../hooks/useAdminProfile';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import {
  AdminOverviewCharts,
  AdminStats,
  AdminWelcome,
} from '../sections/AdminDashboard';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/AdminDashboard.css';

const AdminDashboardPage = () => {
  const { profile, profileError, handleLogout } = useAdminProfile();
  const {
    statsSummary,
    donationOverview,
    requestOverview,
    ngoOverview,
    isLoading,
    errorMessage,
  } = useAdminDashboard();

  return (
    <AdminLayout activeKey="dashboard" profile={profile} onLogout={handleLogout}>
      <section className="donor-content admin-content" id="admin-dashboard">
        <AdminWelcome profile={profile} />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        {isLoading && <p className="dashboard-loading">Loading admin dashboard...</p>}

        <AdminStats summary={statsSummary} />

        <AdminOverviewCharts
          donationOverview={donationOverview}
          requestOverview={requestOverview}
          ngoOverview={ngoOverview}
        />
      </section>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
