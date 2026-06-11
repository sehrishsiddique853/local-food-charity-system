import { CONTACT_TOPICS } from '../constants/contact';

const ContactFormSection = ({ formData, formStatus, isSubmitting, onChange, onSubmit }) => {
  return (
    <section className="contact-form-section">
      <div className="contact-form-copy">
        <span className="contact-eyebrow">Send a message</span>
        <h2>Tell us how we can help.</h2>
        <p>
          Share a few details and the right team member will follow up with
          guidance for your donation, request, or account question.
        </p>
      </div>

      <form className="contact-form" onSubmit={onSubmit}>
        <div className="contact-form-grid">
          <label className="contact-field">
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />
          </label>

          <label className="contact-field">
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="contact-field">
            <span>Phone Number</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="+92 300 1234567"
            />
          </label>

          <label className="contact-field contact-select-field">
            <span>Topic</span>
            <select name="topic" value={formData.topic} onChange={onChange}>
              {CONTACT_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="contact-field contact-message-field">
          <span>Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={onChange}
            placeholder="Write your message here"
            rows="6"
            required
          />
        </label>

        {formStatus.message && (
          <p className={`contact-form-status ${formStatus.type}`}>
            {formStatus.message}
          </p>
        )}

        <button className="contact-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
};

export default ContactFormSection;
