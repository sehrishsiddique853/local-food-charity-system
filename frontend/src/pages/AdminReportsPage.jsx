import { useAdminProfile } from '../hooks/useAdminProfile';
import { useAdminReports } from '../hooks/useAdminReports';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import PostDonationIntro from '../sections/PostDonationIntro';
import {
  AdminNgoPerformanceTable,
  AdminReportCards,
  AdminReportsCharts,
} from '../sections/AdminReports';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';
import '../styles/AdminDashboard.css';
import '../styles/AdminReportsPage.css';

const AdminReportsPage = () => {
  const { profile, profileError, handleLogout } = useAdminProfile();
  const {
    donationOverview,
    errorMessage,
    isLoading,
    ngoOverview,
    ngoPerformance,
    reportCards,
    requestOverview,
  } = useAdminReports();

  return (
    <AdminLayout activeKey="reports" profile={profile} onLogout={handleLogout} pageClassName="admin-reports-page">
      <section className="donor-content admin-content">
        <PostDonationIntro
          eyebrow="Reports & Analytics"
          title="Monitor system reports"
          description="Review donation, user, NGO, and request activity as the system updates."
          imageAlt="Food charity volunteers"
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        {isLoading && <p className="dashboard-loading">Loading reports...</p>}

        <AdminReportCards cards={reportCards} />

        <AdminReportsCharts
          donationOverview={donationOverview}
          requestOverview={requestOverview}
          ngoOverview={ngoOverview}
        />

        <AdminNgoPerformanceTable rows={ngoPerformance} />
      </section>
    </AdminLayout>
  );
};

export default AdminReportsPage;
