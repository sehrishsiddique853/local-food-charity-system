import { ABOUT_METRICS, ABOUT_VALUES } from '../constants/about';

const AboutMissionSection = () => {
  return (
    <section className="about-mission-section">
      <div className="about-mission-copy">
        <span className="about-page-eyebrow">Our purpose</span>
        <h2>Practical help for a real local problem.</h2>
        <p>
          Food often goes unused because donors, charities, and administrators
          do not have one dependable place to coordinate. This system gives each
          role a clear workflow: donors can post surplus food, NGOs can request
          what they can collect, and admins can oversee activity.
        </p>
      </div>

      <div className="about-metrics" aria-label="Platform highlights">
        {ABOUT_METRICS.map((metric) => (
          <div className="about-metric" key={metric.id}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="about-values">
        {ABOUT_VALUES.map((value) => (
          <article className="about-value-card" key={value.id}>
            <span className="about-value-icon" aria-hidden="true">
              {value.icon}
            </span>
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AboutMissionSection;
