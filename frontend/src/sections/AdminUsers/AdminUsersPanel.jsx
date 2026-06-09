import AdminUserDetailsModal from './AdminUserDetailsModal';
import AdminUsersFilters from './AdminUsersFilters';
import AdminUsersList from './AdminUsersList';
import AdminUsersTabs from './AdminUsersTabs';

const AdminUsersPanel = ({
  actionUserId,
  activeTab,
  filteredUsers,
  isDetailsLoading,
  isLoading,
  onActivate,
  onCloseDetails,
  onDeactivate,
  onOpenDetails,
  selectedUserDetails,
  setActiveTab,
  setStatusFilter,
  statusFilter,
  tabCounts,
  userTabs,
}) => (
  <>
    <section className="my-donations-panel admin-users-panel">
      <div className="my-donations-heading">
        <div>
          <h2>User Management</h2>
          <p>Review registered donors and NGOs, and control account access.</p>
        </div>
      </div>

      <AdminUsersTabs
        activeTab={activeTab}
        tabs={userTabs}
        counts={tabCounts}
        onChange={setActiveTab}
      />

      <AdminUsersFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <AdminUsersList
        users={filteredUsers}
        isLoading={isLoading}
        actionUserId={actionUserId}
        onOpenDetails={onOpenDetails}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
      />
    </section>

    {(selectedUserDetails || isDetailsLoading) && (
      <AdminUserDetailsModal
        user={selectedUserDetails}
        isLoading={isDetailsLoading}
        actionUserId={actionUserId}
        onClose={onCloseDetails}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
      />
    )}
  </>
);

export default AdminUsersPanel;
