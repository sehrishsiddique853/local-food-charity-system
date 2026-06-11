import PublicLayout from '../layouts/PublicLayout';
import ContactFormSection from '../sections/ContactFormSection';
import { useContactForm } from '../hooks/useContactForm';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const contactForm = useContactForm();

  return (
    <PublicLayout pageClassName="contact-page" navbarVariant="light">
      <main className="contact-main">
        <ContactFormSection
          formData={contactForm.formData}
          formStatus={contactForm.formStatus}
          isSubmitting={contactForm.isSubmitting}
          onChange={contactForm.handleChange}
          onSubmit={contactForm.handleSubmit}
        />
      </main>
    </PublicLayout>
  );
};

export default ContactPage;
