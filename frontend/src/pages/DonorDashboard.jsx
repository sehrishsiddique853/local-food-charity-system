import { useDonorProfile } from '../hooks/useDonorProfile';
import DonorLayout from '../layouts/DonorLayout/DonorLayout';
import { useDonorDashboard } from '../hooks/useDonorDashboard';
import {
  DonationCtaCard,
  DonationOverviewPanel,
  DonationStats,
  DonorWelcome,
  RecentDonationsPanel,
} from '../sections/DonorDashboard';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';

const DonorDashboard = () => {
  const { profile, profileError, handleLogout } = useDonorProfile();
  const { donationSummary, overviewRows, recentDonations, isLoading, errorMessage } = useDonorDashboard();

  return (
    <DonorLayout activeKey="dashboard" profile={profile} onLogout={handleLogout}>
      <section className="donor-content" id="dashboard">
        <DonorWelcome profile={profile} />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        <DonationStats summary={donationSummary} />

        <section className="dashboard-grid">
          <RecentDonationsPanel donations={recentDonations} isLoading={isLoading} />

          <div className="dashboard-side">
            <DonationOverviewPanel rows={overviewRows} total={donationSummary.overviewTotal} />
            <DonationCtaCard />
          </div>
        </section>
      </section>
    </DonorLayout>
  );
};

export default DonorDashboard;
