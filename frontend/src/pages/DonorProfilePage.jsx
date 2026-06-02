import { useDonorProfile } from '../hooks/useDonorProfile';
import { useProfileSettings } from '../hooks/useProfileSettings';
import DonorLayout from '../layouts/DonorLayout/DonorLayout';
import {
  ChangePasswordForm,
  ProfileSummary,
  ProfileUpdateForm,
} from '../sections/DonorProfile';
import PostDonationIntro from '../sections/PostDonationIntro';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';
import '../styles/DonorProfilePage.css';

const DonorProfilePage = () => {
  const { profile, profileError, handleLogout } = useDonorProfile();
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
  } = useProfileSettings(profile);

  return (
    <DonorLayout
      activeKey="profile"
      profile={profile}
      onLogout={handleLogout}
      pageClassName="donor-profile-page"
    >
      <section className="donor-profile-shell">
        <PostDonationIntro
          eyebrow="My Profile"
          title="Manage your donor account."
          description="Keep your contact details current and update your password when needed."
          imageAlt="Food donation volunteers"
        />

        {profileError && <p className="dashboard-alert">{profileError}</p>}

        <ProfileSummary profile={profile} />

        <div className="profile-settings-grid">
          <ProfileUpdateForm
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
    </DonorLayout>
  );
};

export default DonorProfilePage;
