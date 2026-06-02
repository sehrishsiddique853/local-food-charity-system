import { getInitials } from '../../utils/profileUtils';

const ProfileSummary = ({ profile }) => {
  const displayName = profile?.name || 'Donor';

  return (
    <section className="profile-summary-card">
      <div className="profile-summary-avatar" aria-hidden="true">
        {getInitials(displayName)}
      </div>
      <div className="profile-summary-copy">
        <p className="post-eyebrow">Donor Account</p>
        <h2>{displayName}</h2>
        <p>{profile?.email || 'Email not available'}</p>
      </div>
      <dl className="profile-summary-grid">
        <div>
          <dt>Phone</dt>
          <dd>{profile?.phone || 'Not added'}</dd>
        </div>
        <div>
          <dt>City</dt>
          <dd>{profile?.location?.city || 'Islamabad'}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{profile?.location?.address || 'Not added'}</dd>
        </div>
      </dl>
    </section>
  );
};

export default ProfileSummary;
