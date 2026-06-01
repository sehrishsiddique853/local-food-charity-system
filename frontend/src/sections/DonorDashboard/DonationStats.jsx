const statsCards = [
  {
    key: 'total',
    className: 'green',
    icon: '🎁',
    title: 'Total Donations',
    caption: 'All time',
  },
  {
    key: 'available',
    className: 'orange',
    icon: '📦',
    title: 'Available',
    caption: 'Currently available',
  },
  {
    key: 'requestedBooked',
    className: 'blue',
    icon: '🤝',
    title: 'Requested / Booked',
    caption: 'Awaiting approval / pickup',
  },
  {
    key: 'collected',
    className: 'purple',
    icon: '✓',
    title: 'Collected',
    caption: 'Successfully collected',
  },
];

const DonationStats = ({ summary }) => (
  <section className="stats-grid" aria-label="Donation statistics">
    {statsCards.map((card) => (
      <article className={`stat-card ${card.className}`} key={card.key}>
        <span className="stat-icon">{card.icon}</span>
        <div>
          <strong>{summary[card.key]}</strong>
          <p>{card.title}</p>
        </div>
        <small>{card.caption}</small>
      </article>
    ))}
  </section>
);

export default DonationStats;
