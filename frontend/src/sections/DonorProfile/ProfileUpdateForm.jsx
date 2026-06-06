const ProfileUpdateForm = ({
  profileForm,
  profileStatus,
  isSaving,
  onChange,
  onSubmit,
}) => {
  return (
    <section className="profile-panel" aria-labelledby="update-profile-title">
      <div className="profile-panel-heading">
        <h2 id="update-profile-title">Update Profile</h2>
        <p>Keep your donor contact and pickup address details accurate.</p>
      </div>

      <form className="post-donation-form" onSubmit={onSubmit}>
        <label className="post-field">
          <span>♙</span>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={profileForm.name}
            onChange={onChange}
            required
          />
        </label>

        <label className="post-field">
          <span>✉</span>
          <input type="email" name="email" value={profileForm.email} disabled />
        </label>

        <label className="post-field profile-phone-field">
          <span>☏</span>
          <strong>+92</strong>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={profileForm.phone}
            readOnly
            aria-readonly="true"
          />
        </label>

        <label className="post-field post-select-field">
          <span>⌖</span>
          <select name="city" value={profileForm.city} onChange={onChange} disabled>
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
};

export default ProfileUpdateForm;
