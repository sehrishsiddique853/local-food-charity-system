import '../styles/sections/Statistics.css';

const Statistics = () => {
  const benefits = [
    {
      id: 1,
      icon: '👥',
      title: 'Communities Helped',
      description: 'We connect food with local communities that truly need it.'
    },
    {
      id: 2,
      icon: '🛡',
      title: 'Safe & Transparent',
      description: 'Every step is verified and tracked to ensure safe food delivery.'
    },
    {
      id: 3,
      icon: '◷',
      title: 'Reduce Food Waste',
      description: 'We help reduce food waste by redistributing it to those in need.'
    },
    {
      id: 4,
      icon: '♥',
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
