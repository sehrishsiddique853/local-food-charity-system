const NgoProfileUpdateForm = ({
  profileForm,
  profileStatus,
  isSaving,
  onChange,
  onSubmit,
}) => (
  <section className="profile-panel" aria-labelledby="update-ngo-profile-title">
    <div className="profile-panel-heading">
      <h2 id="update-ngo-profile-title">Edit Profile</h2>
      <p>Update your organization name and address for donation coordination.</p>
    </div>

    <form className="post-donation-form" onSubmit={onSubmit}>
      <label className="post-field">
        <span>♙</span>
        <input
          type="text"
          name="ngoName"
          placeholder="Organization Name"
          value={profileForm.ngoName}
          onChange={onChange}
          required
        />
      </label>

      <label className="post-field">
        <span>✉</span>
        <input type="email" name="email" value={profileForm.email} disabled />
      </label>

      <label className="post-field">
        <span>☏</span>
        <input type="tel" name="phone" value={profileForm.phone} disabled />
      </label>

      <label className="post-field">
        <span>▣</span>
        <input
          type="text"
          name="ngoRegistrationNumber"
          value={profileForm.ngoRegistrationNumber}
          disabled
        />
      </label>

      <label className="post-field post-select-field">
        <span>⌖</span>
        <select name="city" value={profileForm.city} disabled>
          <option value="Islamabad">Islamabad</option>
        </select>
      </label>

      <label className="post-field">
        <span>⌂</span>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={profileForm.address}
          onChange={onChange}
          required
        />
      </label>

      {profileStatus.message && (
        <p className={`post-form-status ${profileStatus.type}`}>
          {profileStatus.message}
        </p>
      )}

      <div className="post-form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Update Profile'}
        </button>
      </div>
    </form>
  </section>
);

export default NgoProfileUpdateForm;
