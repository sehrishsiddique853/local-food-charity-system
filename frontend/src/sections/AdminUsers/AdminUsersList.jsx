import { formatDate } from '../../utils/donationUtils';

const roleLabels = {
  admin: 'Admin',
  donor: 'Donor',
  ngo: 'NGO',
};

const getUserName = (user) =>
  user.name || user.ngoName || user.organizationName || user.email || 'User';

const getUserStatus = (user) => (user.isBlocked ? 'deactivated' : 'active');

const AdminUsersList = ({
  users,
  isLoading,
  actionUserId,
  onOpenDetails,
  onActivate,
  onDeactivate,
}) => {
  if (isLoading) {
    return <p className="empty-state">Loading users...</p>;
  }

  if (!users.length) {
    return (
      <div className="my-donations-empty">
        <h3>No users found</h3>
        <p>Registered donors and NGOs will appear here.</p>
      </div>
    );
  }

  return (
    <div className="admin-user-table" role="table" aria-label="User management table">
      <div className="admin-user-table-head" role="row">
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span>Created At</span>
        <span>Actions</span>
      </div>

      <div className="admin-user-list">
        {users.map((user) => {
          const status = getUserStatus(user);
          const isActionLoading = actionUserId === user._id;

          return (
            <article
              className="admin-user-row"
              key={user._id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetails(user._id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenDetails(user._id);
                }
              }}
            >
              <strong>{getUserName(user)}</strong>
              <span>{user.email || 'Email not available'}</span>
              <span>{roleLabels[user.role] || user.role || 'User'}</span>
              <span className={`status-pill ${status}`}>
                {status === 'active' ? 'Active' : 'Deactivated'}
              </span>
              <time>{formatDate(user.createdAt)}</time>
              <div className="admin-user-actions">
                <button
                  className="approve"
                  type="button"
                  disabled={isActionLoading || status === 'active'}
                  onClick={(event) => {
                    event.stopPropagation();
                    onActivate(user._id);
                  }}
                >
                  Activate
                </button>
                <button
                  className="reject"
                  type="button"
                  disabled={isActionLoading || status === 'deactivated'}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeactivate(user._id);
                  }}
                >
                  Deactivate
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsersList;
