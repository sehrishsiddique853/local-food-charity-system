const PostDonationCard = ({
  title,
  description,
  titleId,
  className = '',
  children,
}) => {
  const cardClassName = ['post-donation-card', className].filter(Boolean).join(' ');

  return (
    <section className={cardClassName} aria-labelledby={titleId}>
      <div className="post-form-heading">
        <h2 id={titleId}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
};

export default PostDonationCard;
