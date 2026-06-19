const DeleteDonationModal = ({
  donation,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!donation) {
    return null;
  }

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section
        className="donation-modal delete-donation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-donation-title"
      >
        <div className="delete-modal-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="m9 10 .4 8" />
            <path d="m15 10-.4 8" />
            <path d="M5 6l1 16h12l1-16" />
          </svg>
        </div>

        <div className="delete-modal-copy">
          <p className="post-eyebrow">Delete Donation</p>
          <h2 id="delete-donation-title">Delete "{donation.foodTitle}"?</h2>
          <p>
            This donation will be removed from your active donations. This action cannot be undone.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="secondary-action"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="danger-action"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? 'Deleting...' : 'Delete Donation'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DeleteDonationModal;
