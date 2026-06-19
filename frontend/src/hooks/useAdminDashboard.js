import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  getAdminDashboard,
  getAdminDonationReport,
  getAdminRequestReport,
  getAdminUserReport,
} from '../services/adminService';

const initialDashboard = {
  totalDonations: 0,
  availableDonations: 0,
  bookedDonations: 0,
  collectedDonations: 0,
  totalNGOs: 0,
  pendingNGOs: 0,
  verifiedNGOs: 0,
  pendingRequests: 0,
  approvedRequests: 0,
};

const donationColors = {
  available: '#27ae60',
  requested: '#f59e0b',
  booked: '#2563eb',
  collected: '#0f766e',
  expired: '#6b7280',
};

const requestColors = {
  pending: '#f59e0b',
  approved: '#4f46e5',
  collected: '#0f766e',
};

const ngoColors = {
  approved: '#27ae60',
  pending: '#f59e0b',
  rejected: '#c81e1e',
};

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [donationReport, setDonationReport] = useState({});
  const [requestReport, setRequestReport] = useState({});
  const [userReport, setUserReport] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [dashboardResult, donationReportResult, requestReportResult, userReportResult] =
          await Promise.all([
            getAdminDashboard(),
            getAdminDonationReport(),
            getAdminRequestReport(),
            getAdminUserReport(),
          ]);

        const responses = [
          dashboardResult,
          donationReportResult,
          requestReportResult,
          userReportResult,
        ];

        if (responses.some((result) => result.status === 401)) {
          navigate(ROUTES.login);
          return;
        }

        const forbiddenResult = responses.find((result) => result.status === 403);
        if (forbiddenResult) {
          throw new Error(forbiddenResult.data.error?.message || 'Admin access is required.');
        }

        const failedResult = responses.find((result) => !result.ok);
        if (failedResult) {
          throw new Error(failedResult.data.error?.message || 'Unable to load admin dashboard.');
        }

        setDashboard({
          ...initialDashboard,
          ...(dashboardResult.data.data || {}),
        });
        setDonationReport(donationReportResult.data.data || {});
        setRequestReport(requestReportResult.data.data || {});
        setUserReport(userReportResult.data.data || {});
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load admin dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const statsSummary = useMemo(
    () => ({
      totalDonations: dashboard.totalDonations,
      availableDonations: dashboard.availableDonations,
      bookedDonations: dashboard.bookedDonations,
      collectedDonations: dashboard.collectedDonations,
      totalNGOs: dashboard.totalNGOs,
      pendingNGOs: dashboard.pendingNGOs,
      verifiedNGOs: dashboard.verifiedNGOs,
      pendingRequests: dashboard.pendingRequests,
      approvedRequests: dashboard.approvedRequests,
    }),
    [dashboard]
  );

  const donationOverview = useMemo(() => {
    const rows = [
      { label: 'Available', value: donationReport.available || 0, color: donationColors.available },
      { label: 'Requested', value: donationReport.requested || 0, color: donationColors.requested },
      { label: 'Booked', value: donationReport.booked || 0, color: donationColors.booked },
      {
        label: 'Collected',
        value: (donationReport.collected || 0) + (donationReport.completed || 0),
        color: donationColors.collected,
      },
      { label: 'Expired', value: donationReport.expired || 0, color: donationColors.expired },
    ];

    return {
      rows,
      total: rows.reduce((sum, row) => sum + row.value, 0),
    };
  }, [donationReport]);

  const requestOverview = useMemo(() => {
    const rows = [
      { label: 'Pending', value: requestReport.pending || 0, color: requestColors.pending },
      { label: 'Approved', value: requestReport.approved || 0, color: requestColors.approved },
      { label: 'Collected', value: requestReport.collected || 0, color: requestColors.collected },
    ];

    return {
      rows,
      total: rows.reduce((sum, row) => sum + row.value, 0),
    };
  }, [requestReport]);

  const ngoOverview = useMemo(() => {
    const rows = [
      { label: 'Verified', value: userReport.verifiedNGOs || dashboard.verifiedNGOs || 0, color: ngoColors.approved },
      { label: 'Pending', value: userReport.pendingNGOs || dashboard.pendingNGOs || 0, color: ngoColors.pending },
      { label: 'Rejected', value: userReport.rejectedNGOs || dashboard.rejectedNGOs || 0, color: ngoColors.rejected },
    ];

    return {
      rows,
      total: rows.reduce((sum, row) => sum + row.value, 0),
    };
  }, [dashboard.pendingNGOs, dashboard.rejectedNGOs, dashboard.verifiedNGOs, userReport]);

  return {
    statsSummary,
    donationOverview,
    requestOverview,
    ngoOverview,
    isLoading,
    errorMessage,
  };
};
