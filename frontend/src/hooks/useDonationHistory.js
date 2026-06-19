import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { getDonationHistory } from '../services/donationService';

const historyStatuses = ['collected', 'completed', 'expired'];

export const useDonationHistory = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await getDonationHistory();

        if (result.status === 401) {
          navigate(ROUTES.login);
          return;
        }

        if (!result.ok) {
          throw new Error(result.data.error?.message || 'Unable to load donation history.');
        }

        setDonations(result.data.data?.donations || []);
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load donation history.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [navigate]);

  const historyDonations = useMemo(
    () => donations.filter((donation) => historyStatuses.includes(donation.status)),
    [donations]
  );

  const totals = useMemo(() => ({
    all: historyDonations.length,
    collected: historyDonations.filter((donation) =>
      ['collected', 'completed'].includes(donation.status)
    ).length,
    expired: historyDonations.filter((donation) => donation.status === 'expired').length,
  }), [historyDonations]);

  return {
    historyDonations,
    totals,
    isLoading,
    errorMessage,
    selectedDonation,
    setSelectedDonation,
  };
};
