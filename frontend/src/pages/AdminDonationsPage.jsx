import { useAdminDonations } from '../hooks/useAdminDonations';
import { useAdminProfile } from '../hooks/useAdminProfile';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import PostDonationIntro from '../sections/PostDonationIntro';
import { AdminDonationsPanel } from '../sections/AdminDonations';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';
import '../styles/AdminNgosPage.css';
import '../styles/AdminDonationsPage.css';

const AdminDonationsPage = () => {
  const { profile, profileError, handleLogout } = useAdminProfile();
  const {
    activeTab,
    actionDonationId,
    cancelBooking,
    cancelDonation,
    closeDonationDetails,
    deleteDonation,
    errorMessage,
    filteredDonations,
    isDetailsLoading,
    isLoading,
    markCollected,
    markExpired,
    openDonationDetails,
    selectedDonationDetails,
    setActiveTab,
    statusTabs,
    successMessage,
    tabCounts,
    updateDonationStatusFromList,
  } = useAdminDonations();

  return (
    <AdminLayout activeKey="donations" profile={profile} onLogout={handleLogout} pageClassName="admin-donations-page">
      <section className="donor-content admin-content">
        <PostDonationIntro
          eyebrow="Donation Management"
          title="Review and manage food donations"
          description="Track available, booked, collected, and expired donations from one place."
          imageAlt="Food charity volunteers"
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        {successMessage && (
          <p className="dashboard-alert success">{successMessage}</p>
        )}

        <AdminDonationsPanel
          activeTab={activeTab}
          actionDonationId={actionDonationId}
          filteredDonations={filteredDonations}
          isDetailsLoading={isDetailsLoading}
          isLoading={isLoading}
          onCancelBooking={cancelBooking}
          onCancelDonation={cancelDonation}
          onCloseDetails={closeDonationDetails}
          onDelete={deleteDonation}
          onMarkCollected={markCollected}
          onMarkExpired={markExpired}
          onOpenDetails={openDonationDetails}
          onStatusChange={updateDonationStatusFromList}
          selectedDonationDetails={selectedDonationDetails}
          setActiveTab={setActiveTab}
          statusTabs={statusTabs}
          tabCounts={tabCounts}
        />
      </section>
    </AdminLayout>
  );
};

export default AdminDonationsPage;
