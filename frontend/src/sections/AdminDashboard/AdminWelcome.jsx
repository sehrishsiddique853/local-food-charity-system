import PostDonationIntro from '../PostDonationIntro';

const AdminWelcome = ({ profile }) => (
  <PostDonationIntro
    eyebrow="Dashboard"
    title={`Welcome back, ${profile?.name || 'Admin'}`}
    description="Monitor donations, NGO verification, request approvals, and collection activity from one place."
    imageAlt="Food charity volunteers"
  />
);

export default AdminWelcome;
