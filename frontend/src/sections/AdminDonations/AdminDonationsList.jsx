import { useState } from 'react';
import { donationStatusLabels } from '../../constants/donationConstants';
import { formatDate, formatQuantity } from '../../utils/donationUtils';

const getDonorName = (donation) =>
  donation.donor?.name || donation.donor?.email || 'Donor not available';

const getDonationStatus = (donation) => donation.status || 'available';

const getStatusOptions = (status) => {
  if (['available', 'requested'].includes(status)) {
    return [
      { value: 'expired', label: 'Mark Expired' },
    ];
  }

  if (status === 'booked') {
    return [
      { value: 'collected', label: 'Mark Collected' },
      { value: 'available', label: 'Cancel Booking' },
    ];
  }

  return [];
};

const AdminDonationsList = ({
  donations,
  isLoading,
  actionDonationId,
  onOpenDetails,
  onDelete,
  onStatusChange,
}) => {
  const [openStatusMenuId, setOpenStatusMenuId] = useState('');

  if (isLoading) {
    return <p className="empty-state">Loading donations...</p>;
  }

  if (!donations.length) {
    return (
      <div className="my-donations-empty">
        <h3>No donations found</h3>
        <p>Food donations will appear here when donors post them.</p>
      </div>
    );
  }

  return (
    <div className="admin-donation-table" role="table" aria-label="Donation management table">
      <div className="admin-donation-table-head" role="row">
        <span>Food Name</span>
        <span>Donor</span>
        <span>Quantity</span>
        <span>Expiry</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      <div className="admin-donation-list">
        {donations.map((donation) => {
          const status = getDonationStatus(donation);
          const isActionLoading = actionDonationId === donation._id;
          const statusOptions = getStatusOptions(status);
          const isMenuOpen = openStatusMenuId === donation._id;

          return (
            <article
              className="admin-donation-row"
              key={donation._id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetails(donation._id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenDetails(donation._id);
                }
              }}
            >
              <strong>{donation.foodTitle || 'Donation'}</strong>
              <span>{getDonorName(donation)}</span>
              <span>{formatQuantity(donation.quantity)}</span>
              <time>{formatDate(donation.expiryDate)}</time>
              <span className={`status-pill ${status}`}>
                {donationStatusLabels[status] || status}
              </span>
              <div className="admin-donation-actions">
                <div
                  className={`admin-status-menu ${isMenuOpen ? 'open' : ''}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    className="admin-status-menu-trigger"
                    type="button"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="menu"
                    disabled={isActionLoading || !statusOptions.length}
                    onClick={() => setOpenStatusMenuId(isMenuOpen ? '' : donation._id)}
                  >
                    Update Status
                    <span aria-hidden="true">v</span>
                  </button>

                  {isMenuOpen && (
                    <div className="admin-status-menu-list" role="menu">
                      {statusOptions.map((option) => (
                        <button
                          type="button"
                          role="menuitem"
                          key={option.value}
                          onClick={() => {
                            setOpenStatusMenuId('');
                            onStatusChange(donation._id, option.value);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="delete-icon"
                  type="button"
                  aria-label={`Delete ${donation.foodTitle || 'donation'}`}
                  disabled={isActionLoading}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(donation._id);
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9ZM7 9h2v10h6v-1h2v3H7V9Z" />
                  </svg>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDonationsList;
