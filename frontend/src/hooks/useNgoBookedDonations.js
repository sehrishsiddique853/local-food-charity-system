import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { getNgoBookedDonations, markNgoDonationCollected } from '../services/ngoService';

export const useNgoBookedDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [collectingDonationId, setCollectingDonationId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadBookedDonations = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getNgoBookedDonations();

      if (result.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (result.status === 403) {
        throw new Error(result.data.error?.message || 'Your NGO account is not approved yet.');
      }

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Unable to load booked donations.');
      }

      setDonations(result.data.data?.donations || []);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load booked donations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookedDonations();
  }, [navigate]);

  const handleMarkCollected = async (donationId) => {
    setCollectingDonationId(donationId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await markNgoDonationCollected(donationId);

      if (result.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Unable to mark donation collected.');
      }

      setSuccessMessage(result.data.data?.message || 'Donation marked as collected.');
      setSelectedDonation(null);
      setDonations((currentDonations) =>
        currentDonations.filter((donation) => donation._id !== donationId)
      );
      await loadBookedDonations();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to mark donation collected.');
    } finally {
      setCollectingDonationId('');
    }
  };

  return {
    donations,
    selectedDonation,
    collectingDonationId,
    isLoading,
    errorMessage,
    successMessage,
    setSelectedDonation,
    handleMarkCollected,
  };
};
