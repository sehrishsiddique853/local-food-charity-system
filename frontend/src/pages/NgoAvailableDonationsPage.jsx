import DonationDetailsModal from '../sections/MyDonations/DonationDetailsModal';
import { useNgoAvailableDonations } from '../hooks/useNgoAvailableDonations';
import { useNgoProfile } from '../hooks/useNgoProfile';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { NgoAvailableDonationsList } from '../sections/NgoAvailableDonations';
import { NgoWelcome } from '../sections/NgoDashboard';
import '../styles/DonorDashboard.css';
import '../styles/MyDonationsPage.css';
import '../styles/PostDonationPage.css';
import '../styles/NgoDashboard.css';
import '../styles/NgoAvailableDonationsPage.css';

const NgoAvailableDonationsPage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const {
    donations,
    searchTerm,
    foodType,
    quantityFilter,
    expiryFilter,
    pickupAreaFilter,
    selectedDonation,
    isLoading,
    requestingDonationId,
    errorMessage,
    successMessage,
    setSearchTerm,
    setFoodType,
    setQuantityFilter,
    setExpiryFilter,
    setPickupAreaFilter,
    setSelectedDonation,
    handleRequestDonation,
  } = useNgoAvailableDonations();

  return (
    <NgoLayout activeKey="available" profile={profile} onLogout={handleLogout} pageClassName="my-donations-page">
      <section className="my-donations-shell ngo-available-shell">
        <NgoWelcome
          profile={profile}
          eyebrow="Available Donations"
          title="Browse available food donations"
          description="Search by food name, filter by food type, and review pickup details before requesting a donation."
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}
        {successMessage && <p className="dashboard-alert success">{successMessage}</p>}

        <NgoAvailableDonationsList
          donations={donations}
          searchTerm={searchTerm}
          foodType={foodType}
          quantityFilter={quantityFilter}
          expiryFilter={expiryFilter}
          pickupAreaFilter={pickupAreaFilter}
          isLoading={isLoading}
          onSearchChange={setSearchTerm}
          onFoodTypeChange={setFoodType}
          onQuantityChange={setQuantityFilter}
          onExpiryChange={setExpiryFilter}
          onPickupAreaChange={setPickupAreaFilter}
          onViewDetails={setSelectedDonation}
          onRequestDonation={handleRequestDonation}
          requestingDonationId={requestingDonationId}
        />

        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          actionLabel="Request"
          onAction={handleRequestDonation}
          isActionLoading={requestingDonationId === selectedDonation?._id}
        />
      </section>
    </NgoLayout>
  );
};

export default NgoAvailableDonationsPage;
