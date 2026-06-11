import PostDonationIntro from '../PostDonationIntro';

const DonorWelcome = ({ profile }) => (
  <PostDonationIntro
    eyebrow="Dashboard"
    title={profile?.name || 'Donor'}
    description="Thank you for supporting the community!"
    imageAlt="Fresh food donation box"
  />
);

export default DonorWelcome;
