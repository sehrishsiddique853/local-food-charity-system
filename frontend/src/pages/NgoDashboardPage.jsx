import { useNgoDashboard } from '../hooks/useNgoDashboard';
import { useNgoProfile } from '../hooks/useNgoProfile';
import { ROUTES } from '../constants/routes';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { DonationOverviewPanel } from '../sections/DonorDashboard';
import {
  BookedDonationsPanel,
  NgoStats,
  NgoWelcome,
  RecentAvailableDonations,
  RecentRequestStatus,
} from '../sections/NgoDashboard';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/NgoDashboard.css';

const NgoDashboardPage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const {
    dashboardSummary,
    donationOverview,
    recentAvailableDonations,
    recentRequests,
    bookedDonations,
    isLoading,
    errorMessage,
  } = useNgoDashboard();

  return (
    <NgoLayout activeKey="dashboard" profile={profile} onLogout={handleLogout}>
      <section className="donor-content ngo-content" id="dashboard">
        <NgoWelcome profile={profile} />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        <NgoStats summary={dashboardSummary} />

        <section className="dashboard-grid ngo-dashboard-grid">
          <div className="dashboard-main">
            <RecentAvailableDonations
              donations={recentAvailableDonations}
              isLoading={isLoading}
              viewAllHref={ROUTES.ngoAvailableDonations}
            />

            <RecentRequestStatus
              requests={recentRequests}
              isLoading={isLoading}
              viewAllHref={ROUTES.ngoRequests}
            />
          </div>

          <div className="dashboard-side">
            <DonationOverviewPanel
              rows={donationOverview.rows}
              total={donationOverview.total}
            />
            <BookedDonationsPanel
              donations={bookedDonations}
              isLoading={isLoading}
              viewAllHref={ROUTES.ngoBookedDonations}
            />
          </div>
        </section>
      </section>
    </NgoLayout>
  );
};

export default NgoDashboardPage;
