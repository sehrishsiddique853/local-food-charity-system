import { useNgoProfile } from '../hooks/useNgoProfile';
import { useNgoProfileSettings } from '../hooks/useNgoProfileSettings';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { ChangePasswordForm } from '../sections/DonorProfile';
import { NgoWelcome } from '../sections/NgoDashboard';
import { NgoProfileSummary, NgoProfileUpdateForm } from '../sections/NgoProfile';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/DonorProfilePage.css';
import '../styles/NgoProfilePage.css';

const NgoProfilePage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const {
    profileForm,
    passwordForm,
    profileStatus,
    passwordStatus,
    isProfileSaving,
    isPasswordSaving,
    updateProfileField,
    updatePasswordField,
    submitProfile,
    submitPassword,
  } = useNgoProfileSettings(profile);

  return (
    <NgoLayout
      activeKey="profile"
      profile={profile}
      onLogout={handleLogout}
      pageClassName="donor-profile-page"
    >
      <section className="donor-profile-shell">
        <NgoWelcome
          profile={profile}
          eyebrow="NGO Profile"
          title="Manage organization profile"
          description="Review verification details, documents, contact information, and account security."
        />

        {profileError && <p className="dashboard-alert">{profileError}</p>}

        <NgoProfileSummary profile={profile} />

        <div className="profile-settings-grid">
          <NgoProfileUpdateForm
            profileForm={profileForm}
            profileStatus={profileStatus}
            isSaving={isProfileSaving}
            onChange={updateProfileField}
            onSubmit={submitProfile}
          />
          <ChangePasswordForm
            passwordForm={passwordForm}
            passwordStatus={passwordStatus}
            isSaving={isPasswordSaving}
            onChange={updatePasswordField}
            onSubmit={submitPassword}
          />
        </div>
      </section>
    </NgoLayout>
  );
};

export default NgoProfilePage;
