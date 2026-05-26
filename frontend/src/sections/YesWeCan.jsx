import React from 'react';
import '../styles/sections/YesWeCan.css';

const YesWeCan = () => {
  const cards = [
    {
      id: 1,
      title: 'Donate Food',
      icon: '🥗',
      description: 'You can donate food and we are here to distribute the food to the ones who have the need for that.',
      btnText: 'Donate'
    },
    {
      id: 2,
      title: 'Volunteer',
      icon: '👥',
      description: 'You can contribute by joining our organization as a volunteer to feed helpless people.',
      btnText: 'Join Us'
    },
    {
      id: 3,
      title: 'Request Food',
      icon: '🙏',
      description: 'You can request food, if you can feed some hungry helpless people and you are genuinely a distributor.',
      btnText: 'Request'
    }
  ];

  return (
    <section className="yes-we-can">
      <h2 className="section-title">Yes We Can!</h2>
      <div className="cards-container">
        {cards.map(card => (
          <div key={card.id} className="card">
            <div className="card-icon">{card.icon}</div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
            <button className="card-btn">{card.btnText}</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YesWeCan;
