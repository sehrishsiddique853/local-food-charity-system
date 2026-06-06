import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { getDonationHistory, getMyDonationStats } from '../services/donationService';
import { initialDonationStats, overviewColors } from '../constants/donationConstants';
import { buildDashboardOverviewRows, getDonationSummary } from '../utils/donationUtils';

export const useDonorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(initialDonationStats);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [statsResult, donationsResult] = await Promise.all([
          getMyDonationStats(),
          getDonationHistory(),
        ]);

        if (statsResult.status === 401 || donationsResult.status === 401) {
          navigate(ROUTES.login);
          return;
        }

        if (statsResult.ok) {
          setStats((current) => ({
            ...current,
            ...statsResult.data.data,
          }));
        }

        if (donationsResult.ok) {
          setDonations(donationsResult.data.data?.donations || []);
        }
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const donationSummary = useMemo(() => getDonationSummary(donations, stats), [donations, stats]);

  const overviewRows = useMemo(
    () => buildDashboardOverviewRows(donationSummary, overviewColors),
    [donationSummary]
  );

  const recentDonations = useMemo(() => donations.slice(0, 5), [donations]);

  return {
    donationSummary,
    overviewRows,
    recentDonations,
    isLoading,
    errorMessage,
  };
};
