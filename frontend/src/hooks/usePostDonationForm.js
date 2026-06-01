import { useEffect, useState } from 'react';
import { createDonation } from '../services/donationService';
import { initialPostDonationForm } from '../constants/donationConstants';

const MAX_IMAGES = 5;

export const usePostDonationForm = (profile) => {
  const [formData, setFormData] = useState(initialPostDonationForm);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.location?.address) {
      setFormData((current) => ({
        ...current,
        address: profile.location.address,
      }));
    }
  }, [profile]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updateImages = (event) => {
    const files = Array.from(event.target.files || []).slice(0, MAX_IMAGES);
    setFormData((current) => ({
      ...current,
      images: files,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });
    setIsSubmitting(true);

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
        address: current.address,
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
    updateField,
    updateImages,
    handleSubmit,
  };
};
