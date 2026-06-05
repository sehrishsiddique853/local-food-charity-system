import { Link } from 'react-router-dom';
import '../styles/sections/YesWeCan.css';
import { ROUTES } from '../constants/routes';

const cardIcons = {
  donate: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5 12 5l8 4.5-8 4.5-8-4.5z" />
      <path d="M4 9.5v7L12 21l8-4.5v-7" />
      <path d="M12 14v7" />
      <path d="M9.5 9.8h5" />
    </svg>
  ),
  ngo: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21h16" />
      <path d="M6 21V9l6-4 6 4v12" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 11h.01" />
      <path d="M12 11h.01" />
      <path d="M15 11h.01" />
    </svg>
  ),
  request: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4h8" />
      <path d="M9 4a2 2 0 0 0-2 2v1h10V6a2 2 0 0 0-2-2" />
      <path d="M6 7h12v14H6z" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  ),
};

const YesWeCan = () => {
  const cards = [
    {
      id: 1,
      title: 'Donate Food',
      icon: cardIcons.donate,
      description: 'You can donate food and we are here to distribute the food to the ones who have the need for that.',
      btnText: 'Donate',
      href: ROUTES.donorRegister,
    },
    {
      id: 2,
      title: 'Join as NGO',
      icon: cardIcons.ngo,
      description: 'Verified NGOs can request available donations, collect food, and distribute it to people in need.',
      btnText: 'Register NGO',
      href: ROUTES.ngoRegister,
    },
    {
      id: 3,
      title: 'Request Food',
      icon: cardIcons.request,
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
