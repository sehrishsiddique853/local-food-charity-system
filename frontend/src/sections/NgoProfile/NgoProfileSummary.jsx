import { getInitials } from '../../utils/profileUtils';

const getVerificationLabel = (status = '') =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';

const NgoProfileSummary = ({ profile }) => {
  const organizationName = profile?.ngoName || profile?.organizationName || 'NGO';
  const documentUrl = profile?.ngoDocument;

  return (
    <section className="profile-summary-card ngo-profile-summary">
      <div className="profile-summary-avatar" aria-hidden="true">
        {getInitials(organizationName)}
      </div>

      <div className="profile-summary-copy">
        <p className="post-eyebrow">NGO Account</p>
        <h2>{organizationName}</h2>
        <p>{profile?.email || 'Email not available'}</p>
      </div>

      <dl className="profile-summary-grid ngo-profile-grid">
        <div>
          <dt>Phone</dt>
          <dd>{profile?.phone || 'Not added'}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{profile?.location?.address || 'Not added'}</dd>
        </div>
        <div>
          <dt>Registration Number</dt>
          <dd>{profile?.ngoRegistrationNumber || 'Not added'}</dd>
        </div>
        <div>
          <dt>Verification Status</dt>
          <dd>
            <span className={`ngo-verification-pill ${profile?.ngoVerificationStatus || 'pending'}`}>
              {getVerificationLabel(profile?.ngoVerificationStatus)}
            </span>
          </dd>
        </div>
        <div>
          <dt>Uploaded Documents</dt>
          <dd>
            {documentUrl ? (
              <a href={documentUrl} target="_blank" rel="noreferrer">View document</a>
            ) : (
              'No document uploaded'
            )}
          </dd>
        </div>
        <div>
          <dt>City</dt>
          <dd>{profile?.location?.city || 'Islamabad'}</dd>
        </div>
      </dl>
    </section>
  );
};

export default NgoProfileSummary;
