import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  getNgoAvailableDonations,
  getNgoBookedDonations,
  getNgoHistory,
  getNgoRequests,
  getNgoRequestStats,
} from '../services/ngoService';

const initialRequestStats = {
  totalRequests: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  collected: 0,
};

const activeRequestStatuses = ['pending', 'approved'];
const unavailableDonationStatuses = ['booked', 'collected', 'completed', 'expired', 'cancelled'];

const ngoOverviewColors = {
  available: '#27ae60',
  requested: '#f59e0b',
  booked: '#2563eb',
  collected: '#0f766e',
};

export const useNgoDashboard = () => {
  const navigate = useNavigate();
  const [requestStats, setRequestStats] = useState(initialRequestStats);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [bookedDonations, setBookedDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState({ donations: [], requests: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [statsResult, availableResult, requestsResult, bookedResult, historyResult] =
          await Promise.all([
            getNgoRequestStats(),
            getNgoAvailableDonations(),
            getNgoRequests(),
            getNgoBookedDonations(),
            getNgoHistory(),
          ]);

        const responses = [statsResult, availableResult, requestsResult, bookedResult, historyResult];

        if (responses.some((result) => result.status === 401)) {
          navigate(ROUTES.login);
          return;
        }

        const forbiddenResult = responses.find((result) => result.status === 403);
        if (forbiddenResult) {
          throw new Error(
            forbiddenResult.data.error?.message || 'Your NGO account is not approved yet.'
          );
        }

        const failedResult = responses.find((result) => !result.ok);
        if (failedResult) {
          throw new Error(failedResult.data.error?.message || 'Unable to load NGO dashboard.');
        }

        setRequestStats({
          ...initialRequestStats,
          ...statsResult.data.data,
        });
        setAvailableDonations(availableResult.data.data?.donations || []);
        setRequests(requestsResult.data.data?.requests || []);
        setBookedDonations(bookedResult.data.data?.donations || []);
        setHistory({
          donations: historyResult.data.data?.donations || [],
          requests: historyResult.data.data?.requests || [],
        });
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load NGO dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const dashboardSummary = useMemo(() => {
    const collectedDonations = history.donations.filter((donation) =>
      ['collected', 'completed'].includes(donation.status)
    );
    const activeRequests = requests.filter((request) =>
      activeRequestStatuses.includes(request.requestStatus)
    );

    return {
      totalRequests: activeRequests.length,
      pendingRequests: activeRequests.filter((request) => request.requestStatus === 'pending').length,
      approvedBooked:
        activeRequests.filter((request) => request.requestStatus === 'approved').length ||
        bookedDonations.length,
      collectedDonations: collectedDonations.length,
    };
  }, [bookedDonations.length, history.donations, requests]);

  const donationOverview = useMemo(() => {
    const collectedDonations = history.donations.filter((donation) =>
      ['collected', 'completed'].includes(donation.status)
    ).length;
    const activeRequests = requests.filter((request) =>
      activeRequestStatuses.includes(request.requestStatus)
    );
    const pendingRequests = activeRequests.filter((request) => request.requestStatus === 'pending').length;
    const bookedRequests =
      activeRequests.filter((request) => request.requestStatus === 'approved').length ||
      bookedDonations.length;

    const rows = [
      {
        label: 'Available',
        value: availableDonations.filter(
          (donation) =>
            !unavailableDonationStatuses.includes(donation.status) &&
            !activeRequests.some((request) => {
              const requestDonationId = request.donation?._id || request.donation;
              return requestDonationId === donation._id;
            })
        ).length,
        color: ngoOverviewColors.available,
      },
      {
        label: 'Requested',
        value: pendingRequests,
        color: ngoOverviewColors.requested,
      },
      {
        label: 'Booked',
        value: bookedRequests,
        color: ngoOverviewColors.booked,
      },
      {
        label: 'Collected',
        value: collectedDonations,
        color: ngoOverviewColors.collected,
      },
    ];

    return {
      rows,
      total: rows.reduce((sum, row) => sum + row.value, 0),
    };
  }, [availableDonations, bookedDonations.length, history.donations, requests]);

  const activeRequests = useMemo(
    () => requests.filter((request) => activeRequestStatuses.includes(request.requestStatus)),
    [requests]
  );
  const activeRequestDonationIds = useMemo(
    () =>
      activeRequests
        .map((request) => request.donation?._id || request.donation)
        .filter(Boolean),
    [activeRequests]
  );
  const recentAvailableDonations = useMemo(
    () =>
      availableDonations
        .filter((donation) => !unavailableDonationStatuses.includes(donation.status))
        .filter((donation) => !activeRequestDonationIds.includes(donation._id))
        .slice(0, 3),
    [activeRequestDonationIds, availableDonations]
  );

  return {
    dashboardSummary,
    donationOverview,
    availableDonations,
    requests,
    allBookedDonations: bookedDonations,
    recentAvailableDonations,
    recentRequests: activeRequests.slice(0, 2),
    bookedDonations: bookedDonations.slice(0, 2),
    isLoading,
    errorMessage,
  };
};
