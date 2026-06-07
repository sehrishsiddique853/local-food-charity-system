const AdminNgoRejectDialog = ({
  isOpen,
  reason,
  isSubmitting,
  onChangeReason,
  onClose,
  onSubmit,
  onSkipReason,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="donation-modal-backdrop" role="presentation">
      <section className="admin-reject-dialog" role="dialog" aria-modal="true" aria-labelledby="reject-ngo-title">
        <div className="modal-heading">
          <div>
            <p className="post-eyebrow">Reject NGO</p>
            <h2 id="reject-ngo-title">Reason for rejection</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close reject dialog">×</button>
        </div>

        <label className="admin-reject-field" htmlFor="ngo-rejection-reason">
          <span>Write a short reason for rejecting this NGO.</span>
          <textarea
            id="ngo-rejection-reason"
            value={reason}
            rows={4}
            placeholder="Example: Registration document is missing or unclear."
            onChange={(event) => onChangeReason(event.target.value)}
          />
        </label>

        <div className="admin-reject-actions">
          <button className="secondary" type="button" disabled={isSubmitting} onClick={onSkipReason}>
            I prefer not to say
          </button>
          <button className="reject" type="button" disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? 'Rejecting...' : 'Submit'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminNgoRejectDialog;
