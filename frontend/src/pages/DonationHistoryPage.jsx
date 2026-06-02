import { useDonationHistory } from '../hooks/useDonationHistory';
import { useDonorProfile } from '../hooks/useDonorProfile';
import DonorLayout from '../layouts/DonorLayout/DonorLayout';
import { DonationHistoryList } from '../sections/DonationHistory';
import { DonationDetailsModal } from '../sections/MyDonations';
import PostDonationIntro from '../sections/PostDonationIntro';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';
import '../styles/DonationHistoryPage.css';

const DonationHistoryPage = () => {
  const { profile, profileError, handleLogout } = useDonorProfile();
  const {
    historyDonations,
    totals,
    isLoading,
    errorMessage,
    selectedDonation,
    setSelectedDonation,
  } = useDonationHistory();

  return (
    <DonorLayout
      activeKey="history"
      profile={profile}
      onLogout={handleLogout}
      pageClassName="donation-history-page"
    >
      <section className="donation-history-shell">
        <PostDonationIntro
          eyebrow="Donation History"
          title="Review completed and inactive donations."
          description="Collected, expired, and cancelled donations are kept here so you can track your contribution record."
          imageAlt="Food donation volunteers"
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        <DonationHistoryList
          donations={historyDonations}
          totals={totals}
          isLoading={isLoading}
          onView={setSelectedDonation}
        />
      </section>

      <DonationDetailsModal donation={selectedDonation} onClose={() => setSelectedDonation(null)} />
    </DonorLayout>
  );
};

export default DonationHistoryPage;
