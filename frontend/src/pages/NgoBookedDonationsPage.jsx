import { useNgoBookedDonations } from '../hooks/useNgoBookedDonations';
import { useNgoProfile } from '../hooks/useNgoProfile';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { BookedDonationsPanel } from '../sections/NgoDashboard';
import '../styles/DonorDashboard.css';
import '../styles/NgoDashboard.css';

const NgoBookedDonationsPage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const {
    donations,
    collectingDonationId,
    isLoading,
    errorMessage,
    successMessage,
    handleMarkCollected,
  } = useNgoBookedDonations();

  return (
    <NgoLayout activeKey="booked" profile={profile} onLogout={handleLogout}>
      <section className="donor-content ngo-content">
        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}
        {successMessage && <p className="dashboard-alert success">{successMessage}</p>}

        <BookedDonationsPanel
          donations={donations}
          isLoading={isLoading}
          title="Booked Donations"
          collectingDonationId={collectingDonationId}
          onMarkCollected={handleMarkCollected}
        />
      </section>
    </NgoLayout>
  );
};

export default NgoBookedDonationsPage;
