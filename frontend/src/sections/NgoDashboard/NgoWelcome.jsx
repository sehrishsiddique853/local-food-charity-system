import PostDonationIntro from '../PostDonationIntro';

const NgoWelcome = ({
  profile,
  eyebrow = 'Dashboard',
  title,
  description = 'Track available food donations, request activity, approvals, and collected donations from one place.',
}) => (
  <PostDonationIntro
    eyebrow={eyebrow}
    title={title || `Welcome back, ${profile?.ngoName || profile?.organizationName || profile?.name || 'NGO'}`}
    description={description}
    imageAlt="Food charity volunteers"
  />
);

export default NgoWelcome;
