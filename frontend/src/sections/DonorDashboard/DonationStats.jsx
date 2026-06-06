const statIcons = {
  total: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19V5" />
      <path d="M19 19H5" />
      <path d="M9 15v-4" />
      <path d="M13 15V8" />
      <path d="M17 15v-2" />
    </svg>
  ),
  available: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h12" />
      <path d="M8 8V6h8v2" />
      <path d="M6 8v11h12V8" />
      <path d="M9 12h6" />
    </svg>
  ),
  booked: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7v5l3 2" />
      <path d="M12 21a9 9 0 1 0-8.5-6" />
      <path d="M3 21v-6h6" />
    </svg>
  ),
  collected: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5 10 17 19 7" />
      <path d="M4 19h16" />
    </svg>
  ),
};

const statsCards = [
  {
    key: 'total',
    className: 'green',
    icon: statIcons.total,
    title: 'Total Donations',
    caption: 'All time',
  },
  {
    key: 'available',
    className: 'orange',
    icon: statIcons.available,
    title: 'Available',
    caption: 'Currently available',
  },
  {
    key: 'booked',
    className: 'blue',
    icon: statIcons.booked,
    title: 'Booked',
    caption: 'Awaiting pickup',
  },
  {
    key: 'collected',
    className: 'purple',
    icon: statIcons.collected,
    title: 'Collected',
    caption: 'Successfully collected',
  },
];

const DonationStats = ({ summary, cards = statsCards }) => (
  <section className="stats-grid" aria-label="Donation statistics">
    {cards.map((card) => (
      <article className={`stat-card ${card.className}`} key={card.key}>
        <span className="stat-icon">{card.icon}</span>
        <div className="stat-info" >
          <strong>{summary[card.key]}</strong>
          <p>{card.title}</p>
        </div>
        <small>{card.caption}</small>
      </article>
    ))}
  </section>
);

export default DonationStats;
