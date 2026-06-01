import { useDonorProfile } from '../hooks/useDonorProfile';
import DonorLayout from '../layouts/DonorLayout/DonorLayout';
import { usePostDonationForm } from '../hooks/usePostDonationForm';
import PostDonationIntro from '../sections/PostDonationIntro';
import PostDonationForm from '../components/PostDonationForm';
import '../styles/DonorDashboard.css';
import '../styles/PostDonationPage.css';

const PostDonationPage = () => {
  const { profile, handleLogout } = useDonorProfile();
  const postDonationForm = usePostDonationForm(profile);

  return (
    <DonorLayout
      activeKey="postDonation"
      profile={profile}
      onLogout={handleLogout}
      pageClassName="post-donation-page"
    >
      <section className="post-donation-shell">
        <PostDonationIntro />
        <PostDonationForm {...postDonationForm} />
      </section>
    </DonorLayout>
  );
};

export default PostDonationPage;
