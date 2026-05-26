import React from 'react';
import '../styles/sections/Statistics.css';

const Statistics = () => {
  const stats = [
    {
      id: 1,
      icon: '🍽️',
      number: '1,250+',
      label: 'Meals Donated'
    },
    {
      id: 2,
      icon: '🏢',
      number: '85+',
      label: 'Verified NGOs'
    },
    {
      id: 3,
      icon: '✓',
      number: '450+',
      label: 'Successful Donations'
    },
    {
      id: 4,
      icon: '🌱',
      number: '2.3 Tons',
      label: 'Food Waste Reduced'
    }
  ];

  return (
    <section className="statistics">
      <div className="stats-container">
        {stats.map(stat => (
          <div key={stat.id} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <h3 className="stat-number">{stat.number}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
