import { Link } from 'react-router-dom';
import '../styles/sections/YesWeCan.css';
import { ROUTES } from '../constants/routes';

const YesWeCan = () => {
  const cards = [
    {
      id: 1,
      title: 'Donate Food',
      icon: '🥗',
      description: 'You can donate food and we are here to distribute the food to the ones who have the need for that.',
      btnText: 'Donate',
      href: ROUTES.donorRegister,
    },
    {
      id: 2,
      title: 'Join as NGO',
      icon: '🤝',
      description: 'Verified NGOs can request available donations, collect food, and distribute it to people in need.',
      btnText: 'Register NGO',
      href: ROUTES.ngoRegister,
    },
    {
      id: 3,
      title: 'Request Food',
      icon: '🙏',
      description: 'You can request food, if you can feed some hungry helpless people and you are genuinely a distributor.',
      btnText: 'Request',
      href: ROUTES.ngoRegister,
    },
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
            <Link className="card-btn" to={card.href}>{card.btnText}</Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YesWeCan;
