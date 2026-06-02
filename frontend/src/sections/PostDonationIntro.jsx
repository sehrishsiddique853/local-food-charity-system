const PostDonationIntro = ({
  eyebrow = 'Post Donation',
  title = 'Share surplus food with people who need it.',
  description = 'Add the food details, pickup address, expiry time, and optional images. Your donation will appear in your donor dashboard after posting.',
  imageAlt = 'Food donation volunteers',
}) => {
  return (
    <section className="post-donation-intro">
      <div>
        <p className="post-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <img src="/home-page-ani.png" alt={imageAlt} />
    </section>
  );
};

export default PostDonationIntro;
