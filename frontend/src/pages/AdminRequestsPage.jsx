import { useAdminProfile } from '../hooks/useAdminProfile';
import { useAdminRequests } from '../hooks/useAdminRequests';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import PostDonationIntro from '../sections/PostDonationIntro';
import { AdminRequestsPanel } from '../sections/AdminRequests';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';
import '../styles/AdminNgosPage.css';
import '../styles/AdminRequestsPage.css';

const AdminRequestsPage = () => {
  const { profile, profileError, handleLogout } = useAdminProfile();
  const {
    activeTab,
    actionRequestId,
    approveRequest,
    closeRequestDetails,
    errorMessage,
    filteredRequests,
    isDetailsLoading,
    isLoading,
    openRequestDetails,
    rejectRequest,
    selectedRequestDetails,
    setActiveTab,
    statusTabs,
    successMessage,
    tabCounts,
  } = useAdminRequests();

  return (
    <AdminLayout activeKey="requests" profile={profile} onLogout={handleLogout} pageClassName="admin-requests-page">
      <section className="donor-content admin-content">
        <PostDonationIntro
          eyebrow="Request Management"
          title="Review donation requests from NGOs"
          description="Approve the right NGO for each donation and keep request decisions organized."
          imageAlt="Food charity volunteers"
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        {successMessage && (
          <p className="dashboard-alert success">{successMessage}</p>
        )}

        <AdminRequestsPanel
          activeTab={activeTab}
          actionRequestId={actionRequestId}
          filteredRequests={filteredRequests}
          isDetailsLoading={isDetailsLoading}
          isLoading={isLoading}
          onApprove={approveRequest}
          onCloseDetails={closeRequestDetails}
          onOpenDetails={openRequestDetails}
          onReject={rejectRequest}
          selectedRequestDetails={selectedRequestDetails}
          setActiveTab={setActiveTab}
          statusTabs={statusTabs}
          tabCounts={tabCounts}
        />
      </section>
    </AdminLayout>
  );
};

export default AdminRequestsPage;
