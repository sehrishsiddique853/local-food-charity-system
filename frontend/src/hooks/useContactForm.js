import { useState } from 'react';
import { sendContactMessage } from '../services/contactService';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  topic: 'Food donation',
  message: '',
};

export const useContactForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setFormStatus({ type: '', message: '' });
  };

  const getErrorMessage = (result, fallback) => {
    const validationMessage = result.data.error?.details?.errors?.[0]?.message;
    return validationMessage || result.data.error?.message || fallback;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setFormStatus({ type: '', message: '' });

      const result = await sendContactMessage(formData);

      if (!result.ok) {
        throw new Error(getErrorMessage(result, 'Message could not be sent. Please try again.'));
      }

      setFormStatus({
        type: 'success',
        message: result.data.data?.message || 'Message sent successfully. Our team will contact you shortly.',
      });
      setFormData(initialFormData);
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Message could not be sent. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    formStatus,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};
