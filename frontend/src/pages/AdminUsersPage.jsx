import { useAdminProfile } from '../hooks/useAdminProfile';
import { useAdminUsers } from '../hooks/useAdminUsers';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import PostDonationIntro from '../sections/PostDonationIntro';
import { AdminUsersPanel } from '../sections/AdminUsers';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/MyDonationsPage.css';
import '../styles/AdminNgosPage.css';
import '../styles/AdminUsersPage.css';

const AdminUsersPage = () => {
  const { profile, profileError, handleLogout } = useAdminProfile();
  const {
    actionUserId,
    activeTab,
    activateUser,
    closeUserDetails,
    deactivateUser,
    errorMessage,
    filteredUsers,
    isDetailsLoading,
    isLoading,
    openUserDetails,
    selectedUserDetails,
    setActiveTab,
    setStatusFilter,
    statusFilter,
    successMessage,
    tabCounts,
    userTabs,
  } = useAdminUsers();

  return (
    <AdminLayout activeKey="users" profile={profile} onLogout={handleLogout} pageClassName="admin-users-page">
      <section className="donor-content admin-content">
        <PostDonationIntro
          eyebrow="User Management"
          title="Manage donors and NGOs"
          description="Review account details, monitor access status, and activate or deactivate users."
          imageAlt="Food charity volunteers"
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        {successMessage && (
          <p className="dashboard-alert success">{successMessage}</p>
        )}

        <AdminUsersPanel
          actionUserId={actionUserId}
          activeTab={activeTab}
          filteredUsers={filteredUsers}
          isDetailsLoading={isDetailsLoading}
          isLoading={isLoading}
          onActivate={activateUser}
          onCloseDetails={closeUserDetails}
          onDeactivate={deactivateUser}
          onOpenDetails={openUserDetails}
          selectedUserDetails={selectedUserDetails}
          setActiveTab={setActiveTab}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
          tabCounts={tabCounts}
          userTabs={userTabs}
        />
      </section>
    </AdminLayout>
  );
};

export default AdminUsersPage;
