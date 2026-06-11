import '../styles/sections/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      image: '/Gift-rafiki.png',
      title: 'Donate',
      description: 'Donors post extra food they want to donate.'
    },
    {
      id: 2,
      image: '/Pull%20request-bro.png',
      title: 'Request',
      description: 'Verified NGOs request the available food.'
    },
    {
      id: 3,
      image: '/Accept%20request-cuate.png',
      title: 'Approve',
      description: 'Admin approves the request to ensure transparency.'
    },
    {
      id: 4,
      image: '/Team%20spirit-bro.png',
      title: 'Collect',
      description: 'NGO collects the food from donor.'
    },
    {
      id: 5,
      image: '/Humanitarian%20Help-bro.png',
      title: 'Distribute',
      description: 'NGO distributes food to people in need.'
    }
  ];

  return (
    <section className="how-it-works">
      <h2 className="section-title">How We Work</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={step.id} className="step">
            <div className="step-icon">
              <img src={step.image} alt={`${step.title} step`} />
            </div>
            <h3 className="step-number">{step.id}. {step.title}</h3>
            <p className="step-description">{step.description}</p>
            {index < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
