import { useEffect, useState } from 'react';
import { createDonation } from '../services/donationService';
import { initialPostDonationForm } from '../constants/donationConstants';

const getDateTimeInputNow = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

export const usePostDonationForm = (profile) => {
  const [formData, setFormData] = useState(initialPostDonationForm);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minExpiryDate, setMinExpiryDate] = useState(getDateTimeInputNow);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMinExpiryDate(getDateTimeInputNow());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;

    if (name === 'expiryDate' && value && value < getDateTimeInputNow()) {
      setMinExpiryDate(getDateTimeInputNow());
      setFormStatus({
        type: 'error',
        message: 'Expiry date and time cannot be earlier than the current time.',
      });
      setFormData((current) => ({
        ...current,
        expiryDate: '',
      }));
      return;
    }

    if (name === 'expiryDate') {
      setFormStatus({ type: '', message: '' });
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updateImages = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 1);
    setFormData((current) => ({
      ...current,
      images: files,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });
    setIsSubmitting(true);

    const currentMinimum = getDateTimeInputNow();
    if (!formData.expiryDate || formData.expiryDate < currentMinimum) {
      setFormStatus({
        type: 'error',
        message: 'Expiry date must be later than the current date and time.',
      });
      setMinExpiryDate(currentMinimum);
      setIsSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append('foodTitle', formData.foodTitle);
    payload.append('foodType', formData.foodType);
    payload.append('quantityValue', formData.quantityValue);
    payload.append('quantityUnit', formData.quantityUnit);
    payload.append('address', formData.address);
    payload.append('expiryDate', formData.expiryDate);
    payload.append('description', formData.description);
    formData.images.forEach((image) => payload.append('images', image));

    try {
      const response = await createDonation(payload);

      if (!response.ok) {
        const validationMessage = response.data.error?.details?.errors?.[0]?.message;
        throw new Error(validationMessage || response.data.error?.message || 'Donation posting failed.');
      }

      setFormStatus({
        type: 'success',
        message: 'Donation posted successfully.',
      });
      setFormData((current) => ({
        ...initialPostDonationForm,
        address: '',
      }));
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Donation posting failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    formStatus,
    isSubmitting,
    minExpiryDate,
    updateField,
    updateImages,
    handleSubmit,
  };
};
