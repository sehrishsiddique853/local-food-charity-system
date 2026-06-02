import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { deleteDonation, getDonationHistory, updateDonation } from '../services/donationService';
import { toDateTimeInputValue } from '../utils/donationUtils';

const buildEditForm = (donation) => ({
  foodTitle: donation.foodTitle || '',
  foodType: donation.foodType || 'cooked',
  quantityValue: donation.quantity?.value || '',
  quantityUnit: donation.quantity?.unit || 'plates',
  address: donation.pickupAddress?.address || '',
  expiryDate: toDateTimeInputValue(donation.expiryDate),
  description: donation.description || '',
  images: [],
});

export const useMyDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadDonations = useCallback(async () => {
    setIsLoading(true);
    setStatusMessage({ type: '', message: '' });

    try {
      const result = await getDonationHistory();

      if (result.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Unable to load donations.');
      }

      setDonations(result.data.data?.donations || []);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: error.message || 'Unable to load donations.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const startEdit = (donation) => {
    setEditingDonation(donation);
    setEditForm(buildEditForm(donation));
    setStatusMessage({ type: '', message: '' });
  };

  const closeEdit = () => {
    setEditingDonation(null);
    setEditForm(null);
    setIsSaving(false);
  };

  const updateEditField = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updateEditImage = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 1);
    setEditForm((current) => ({
      ...current,
      images: files,
    }));
  };

  const submitEdit = async (event) => {
    event.preventDefault();

    if (!editingDonation || !editForm) {
      return;
    }

    setIsSaving(true);
    setStatusMessage({ type: '', message: '' });

    const payload = new FormData();
    payload.append('foodTitle', editForm.foodTitle);
    payload.append('foodType', editForm.foodType);
    payload.append('quantityValue', editForm.quantityValue);
    payload.append('quantityUnit', editForm.quantityUnit);
    payload.append('address', editForm.address);
    payload.append('expiryDate', editForm.expiryDate);
    payload.append('description', editForm.description);
    editForm.images.forEach((image) => payload.append('images', image));

    try {
      const result = await updateDonation(editingDonation._id, payload);

      if (result.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (!result.ok) {
        const validationMessage = result.data.error?.details?.errors?.[0]?.message;
        throw new Error(validationMessage || result.data.error?.message || 'Unable to update donation.');
      }

      setDonations((current) =>
        current.map((donation) =>
          donation._id === editingDonation._id ? result.data.data.donation : donation
        )
      );
      setStatusMessage({ type: 'success', message: 'Donation updated successfully.' });
      closeEdit();
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: error.message || 'Unable to update donation.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeDonation = async (donation) => {
    const confirmed = window.confirm(`Delete "${donation.foodTitle}"?`);

    if (!confirmed) {
      return;
    }

    setStatusMessage({ type: '', message: '' });

    try {
      const result = await deleteDonation(donation._id);

      if (result.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Unable to delete donation.');
      }

      setDonations((current) =>
        current.map((item) => (item._id === donation._id ? result.data.data.donation : item))
      );
      setStatusMessage({ type: 'success', message: 'Donation deleted successfully.' });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: error.message || 'Unable to delete donation.',
      });
    }
  };

  const totals = useMemo(() => ({
    all: donations.length,
    available: donations.filter((donation) => donation.status === 'available').length,
    requested: donations.filter((donation) => donation.status === 'requested').length,
    booked: donations.filter((donation) => donation.status === 'booked').length,
    collected: donations.filter((donation) => donation.status === 'collected').length,
    expired: donations.filter((donation) => donation.status === 'expired').length,
  }), [donations]);

  return {
    donations,
    totals,
    isLoading,
    statusMessage,
    selectedDonation,
    editingDonation,
    editForm,
    isSaving,
    setSelectedDonation,
    startEdit,
    closeEdit,
    updateEditField,
    updateEditImage,
    submitEdit,
    removeDonation,
  };
};
