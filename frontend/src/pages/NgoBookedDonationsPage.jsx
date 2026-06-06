import { useNgoBookedDonations } from '../hooks/useNgoBookedDonations';
import { useNgoProfile } from '../hooks/useNgoProfile';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { DonationDetailsModal } from '../sections/MyDonations';
import { NgoBookedDonationsList } from '../sections/NgoBookedDonations';
import { NgoWelcome } from '../sections/NgoDashboard';
import '../styles/DonorDashboard.css';
import '../styles/MyDonationsPage.css';
import '../styles/PostDonationPage.css';
import '../styles/NgoDashboard.css';
import '../styles/NgoAvailableDonationsPage.css';
import '../styles/NgoBookedDonationsPage.css';

const NgoBookedDonationsPage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const {
    donations,
    selectedDonation,
    collectingDonationId,
    isLoading,
    errorMessage,
    successMessage,
    setSelectedDonation,
    handleMarkCollected,
  } = useNgoBookedDonations();

  return (
    <NgoLayout activeKey="booked" profile={profile} onLogout={handleLogout} pageClassName="my-donations-page">
      <section className="my-donations-shell ngo-available-shell">
        <NgoWelcome
          profile={profile}
          eyebrow="Booked Donations"
          title="Manage approved donations"
          description="View admin-approved donations, contact donors, and mark donations collected after pickup."
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}
        {successMessage && <p className="dashboard-alert success">{successMessage}</p>}

        <NgoBookedDonationsList
          donations={donations}
          isLoading={isLoading}
          collectingDonationId={collectingDonationId}
          onViewDetails={setSelectedDonation}
          onMarkCollected={handleMarkCollected}
        />

        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          actionLabel="Mark as Collected"
          actionLoadingLabel="Updating..."
          isActionLoading={collectingDonationId === selectedDonation?._id}
          onAction={handleMarkCollected}
        />
      </section>
    </NgoLayout>
  );
};

export default NgoBookedDonationsPage;
