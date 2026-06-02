const ChangePasswordForm = ({
  passwordForm,
  passwordStatus,
  isSaving,
  onChange,
  onSubmit,
}) => (
  <section className="profile-panel" aria-labelledby="change-password-title">
    <div className="profile-panel-heading">
      <h2 id="change-password-title">Change Password</h2>
      <p>Use a strong password with uppercase, lowercase, number, and special character.</p>
    </div>

    <form className="post-donation-form" onSubmit={onSubmit}>
      <label className="post-field">
        <span>▣</span>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={passwordForm.currentPassword}
          onChange={onChange}
          required
        />
      </label>

      <label className="post-field">
        <span>▣</span>
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwordForm.newPassword}
          onChange={onChange}
          required
        />
      </label>

      <label className="post-field">
        <span>▣</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={passwordForm.confirmPassword}
          onChange={onChange}
          required
        />
      </label>

      {passwordStatus.message && (
        <p className={`post-form-status ${passwordStatus.type}`}>
          {passwordStatus.message}
        </p>
      )}

      <div className="post-form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </form>
  </section>
);

export default ChangePasswordForm;
