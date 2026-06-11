import { ABOUT_PROCESS_STEPS } from '../constants/about';

const AboutProcessSection = () => {
  return (
    <section className="about-process-section">
      <div className="about-process-heading">
        <span className="about-page-eyebrow">How it works</span>
        <h2>A simple flow from donation to collection.</h2>
      </div>

      <div className="about-process-list">
        {ABOUT_PROCESS_STEPS.map((step) => (
          <article className="about-process-step" key={step.id}>
            <span>{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AboutProcessSection;
