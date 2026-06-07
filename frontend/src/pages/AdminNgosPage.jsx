import { useAdminNgos } from '../hooks/useAdminNgos';
import { useAdminProfile } from '../hooks/useAdminProfile';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import PostDonationIntro from '../sections/PostDonationIntro';
import { AdminNgosPanel } from '../sections/AdminNgos';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';
import '../styles/AdminNgosPage.css';

const AdminNgosPage = () => {
  const { profile, profileError, handleLogout } = useAdminProfile();
  const {
    activeTab,
    actionNgoId,
    closeNgoDetails,
    errorMessage,
    filteredNgos,
    isDetailsLoading,
    isLoading,
    openNgoDetails,
    approveNgo,
    rejectNgo,
    selectedNgoDetails,
    setActiveTab,
    statusTabs,
    successMessage,
    tabCounts,
  } = useAdminNgos();

  return (
    <AdminLayout activeKey="ngos" profile={profile} onLogout={handleLogout} pageClassName="admin-ngos-page">
      <section className="donor-content admin-content">
        <PostDonationIntro
          eyebrow="NGO Management"
          title="Verify and manage registered NGOs"
          description="Review organization details, registration documents, and verification status from one place."
          imageAlt="Food charity volunteers"
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        {successMessage && (
          <p className="dashboard-alert success">{successMessage}</p>
        )}

        <AdminNgosPanel
          activeTab={activeTab}
          actionNgoId={actionNgoId}
          filteredNgos={filteredNgos}
          isDetailsLoading={isDetailsLoading}
          isLoading={isLoading}
          onApprove={approveNgo}
          onCloseDetails={closeNgoDetails}
          onOpenDetails={openNgoDetails}
          onReject={rejectNgo}
          selectedNgoDetails={selectedNgoDetails}
          setActiveTab={setActiveTab}
          statusTabs={statusTabs}
          tabCounts={tabCounts}
        />
      </section>
    </AdminLayout>
  );
};

export default AdminNgosPage;
