import '../styles/sections/YesWeCan.css';

const YesWeCan = () => {
  const cards = [
    {
      id: 1,
      title: 'Donate Food',
      icon: '🥗',
      description: 'You can donate food and we are here to distribute the food to the ones who have the need for that.',
      btnText: 'Donate',
      href: '/register?role=donor'
    },
    {
      id: 2,
      title: 'Join as NGO',
      icon: '🤝',
      description: 'Verified NGOs can request available donations, collect food, and distribute it to people in need.',
      btnText: 'Register NGO',
      href: '/register?role=ngo'
    },
    {
      id: 3,
      title: 'Request Food',
      icon: '🙏',
      description: 'You can request food, if you can feed some hungry helpless people and you are genuinely a distributor.',
      btnText: 'Request',
      href: '/register?role=ngo'
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
            <a className="card-btn" href={card.href}>{card.btnText}</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YesWeCan;
