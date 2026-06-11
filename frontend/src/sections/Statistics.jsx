import '../styles/sections/Statistics.css';

const benefitIcons = {
  communities: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M17 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M2.5 21a4.5 4.5 0 0 1 9 0" />
      <path d="M12.5 21a4.5 4.5 0 0 1 9 0" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.5 2.8 8.5 7 10 4.2-1.5 7-5.5 7-10V6l-7-3z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
      <path d="M4 12h3" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20s-7-4.4-9-9a4.5 4.5 0 0 1 7-5.2L12 8l2-2.2a4.5 4.5 0 0 1 7 5.2c-2 4.6-9 9-9 9z" />
    </svg>
  ),
};

const Statistics = () => {
  const benefits = [
    {
      id: 1,
      icon: benefitIcons.communities,
      title: 'Communities Helped',
      description: 'We connect food with local communities that truly need it.'
    },
    {
      id: 2,
      icon: benefitIcons.shield,
      title: 'Safe & Transparent',
      description: 'Every step is verified and tracked to ensure safe food delivery.'
    },
    {
      id: 3,
      icon: benefitIcons.clock,
      title: 'Reduce Food Waste',
      description: 'We help reduce food waste by redistributing it to those in need.'
    },
    {
      id: 4,
      icon: benefitIcons.heart,
      title: 'Make an Impact',
      description: "Your donation brings hope and makes a real difference in people's lives."
    }
  ];

  return (
    <section className="statistics">
      <div className="stats-container">
        {benefits.map(benefit => (
          <div key={benefit.id} className="benefit-card">
            <div className="benefit-icon">{benefit.icon}</div>
            <h3 className="benefit-title">{benefit.title}</h3>
            <p className="benefit-description">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
