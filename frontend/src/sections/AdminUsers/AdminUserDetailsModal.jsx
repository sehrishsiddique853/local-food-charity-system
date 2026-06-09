import { formatDate } from '../../utils/donationUtils';

const roleLabels = {
  admin: 'Admin',
  donor: 'Donor',
  ngo: 'NGO',
};

const getUserName = (user) =>
  user?.name || user?.ngoName || user?.organizationName || user?.email || 'User';

const getUserStatus = (user) => (user?.isBlocked ? 'deactivated' : 'active');

const AdminUserDetailsModal = ({
  user,
  isLoading,
  actionUserId,
  onClose,
  onActivate,
  onDeactivate,
}) => {
  if (!user && !isLoading) {
    return null;
  }

  const status = getUserStatus(user);
  const isActionLoading = actionUserId === user?._id;

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section
        className="donation-modal admin-user-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
      >
        <div className="modal-heading">
          <div>
            <p className="post-eyebrow">User Details</p>
            <h2 id="user-details-title">{getUserName(user)}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close details">×</button>
        </div>

        {isLoading && <p className="empty-state compact">Loading user details...</p>}

        {!isLoading && user && (
          <>
            <div className="donation-detail-grid admin-user-detail-grid">
              <p>
                <span>Status</span>
                <strong className={`status-pill ${status}`}>
                  {status === 'active' ? 'Active' : 'Deactivated'}
                </strong>
              </p>
              <p>
                <span>Name</span>
                <strong>{getUserName(user)}</strong>
              </p>
              <p>
                <span>Email</span>
                <strong>{user.email || 'Email not available'}</strong>
              </p>
              <p>
                <span>Phone</span>
                <strong>{user.phone || 'Phone not available'}</strong>
              </p>
              <p>
                <span>Role</span>
                <strong>{roleLabels[user.role] || user.role || 'User'}</strong>
              </p>
              <p>
                <span>Created At</span>
                <strong>{formatDate(user.createdAt)}</strong>
              </p>
              {user.role === 'ngo' && (
                <>
                  <p>
                    <span>Registration Number</span>
                    <strong>{user.registrationNumber || 'Not provided'}</strong>
                  </p>
                  <p>
                    <span>Verification Status</span>
                    <strong>{user.ngoVerificationStatus || 'Not available'}</strong>
                  </p>
                </>
              )}
              <p className="admin-user-detail-wide">
                <span>Address</span>
                <strong>
                  {user.location?.address || user.location?.city || 'Address not available'}
                </strong>
              </p>
            </div>

            <div className="admin-modal-actions">
              <button
                className="approve"
                type="button"
                disabled={isActionLoading || status === 'active'}
                onClick={() => onActivate(user._id)}
              >
                Activate
              </button>
              <button
                className="reject"
                type="button"
                disabled={isActionLoading || status === 'deactivated'}
                onClick={() => onDeactivate(user._id)}
              >
                Deactivate
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminUserDetailsModal;
