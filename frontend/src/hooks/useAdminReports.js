import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  getAdminDonationReport,
  getAdminNgoPerformanceReport,
  getAdminRequestReport,
  getAdminUserReport,
} from '../services/adminService';

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

const buildTotal = (rows) => rows.reduce((sum, row) => sum + row.value, 0);

export const useAdminReports = () => {
  const navigate = useNavigate();
  const [donationReport, setDonationReport] = useState({});
  const [userReport, setUserReport] = useState({});
  const [requestReport, setRequestReport] = useState({});
  const [ngoPerformance, setNgoPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [donationResult, userResult, requestResult, ngoPerformanceResult] =
          await Promise.all([
            getAdminDonationReport(),
            getAdminUserReport(),
            getAdminRequestReport(),
            getAdminNgoPerformanceReport(),
          ]);

        const responses = [donationResult, userResult, requestResult, ngoPerformanceResult];

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
          throw new Error(failedResult.data.error?.message || 'Unable to load reports.');
        }

        setDonationReport(donationResult.data.data || {});
        setUserReport(userResult.data.data || {});
        setRequestReport(requestResult.data.data || {});
        setNgoPerformance(ngoPerformanceResult.data.data?.performance || []);
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load reports.');
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [navigate]);

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

    return { rows, total: buildTotal(rows) };
  }, [donationReport]);

  const requestOverview = useMemo(() => {
    const rows = [
      { label: 'Pending', value: requestReport.pending || 0, color: requestColors.pending },
      { label: 'Approved', value: requestReport.approved || 0, color: requestColors.approved },
      { label: 'Collected', value: requestReport.collected || 0, color: requestColors.collected },
    ];

    return { rows, total: buildTotal(rows) };
  }, [requestReport]);

  const ngoOverview = useMemo(() => {
    const rows = [
      { label: 'Approved', value: userReport.verifiedNGOs || 0, color: ngoColors.approved },
      { label: 'Pending', value: userReport.pendingNGOs || 0, color: ngoColors.pending },
      { label: 'Rejected', value: userReport.rejectedNGOs || 0, color: ngoColors.rejected },
    ];

    return { rows, total: buildTotal(rows) };
  }, [userReport]);

  const reportCards = useMemo(() => [
    {
      title: 'Donation Report',
      description: 'Donation lifecycle totals from posted food to collection.',
      metrics: [
        { label: 'Available', value: donationReport.available || 0 },
        { label: 'Booked', value: donationReport.booked || 0 },
        { label: 'Collected', value: (donationReport.collected || 0) + (donationReport.completed || 0) },
        { label: 'Expired', value: donationReport.expired || 0 },
      ],
    },
    {
      title: 'User Report',
      description: 'Registered users and account access state.',
      metrics: [
        { label: 'Donors', value: userReport.donors || 0 },
        { label: 'NGOs', value: userReport.ngos || 0 },
        { label: 'Admins', value: userReport.admins || 0 },
        { label: 'Blocked', value: userReport.blockedUsers || 0 },
      ],
    },
    {
      title: 'NGO Report',
      description: 'Verification state for registered organizations.',
      metrics: [
        { label: 'Verified', value: userReport.verifiedNGOs || 0 },
        { label: 'Pending', value: userReport.pendingNGOs || 0 },
        { label: 'Rejected', value: userReport.rejectedNGOs || 0 },
        { label: 'Tracked NGOs', value: ngoPerformance.length },
      ],
    },
    {
      title: 'Request Report',
      description: 'Active approvals and collection status.',
      metrics: [
        { label: 'Pending', value: requestReport.pending || 0 },
        { label: 'Approved', value: requestReport.approved || 0 },
        { label: 'Collected', value: requestReport.collected || 0 },
      ],
    },
  ], [donationReport, ngoPerformance.length, requestReport, userReport]);

  return {
    donationOverview,
    errorMessage,
    isLoading,
    ngoOverview,
    ngoPerformance,
    reportCards,
    requestOverview,
  };
};
