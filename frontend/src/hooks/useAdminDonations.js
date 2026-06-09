import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  deleteAdminDonation,
  getAdminDonationById,
  getAdminDonations,
  updateAdminDonationStatus,
} from '../services/adminService';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'booked', label: 'Booked' },
  { key: 'collected', label: 'Collected' },
  { key: 'expired', label: 'Expired' },
];

const tabStatuses = statusTabs.map((tab) => tab.key).filter((key) => key !== 'all');

const normalizeDonationStatus = (status) => status || 'available';

export const useAdminDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDonationDetails, setSelectedDonationDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [actionDonationId, setActionDonationId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleApiResult = (result, fallbackMessage) => {
    if (result.status === 401) {
      navigate(ROUTES.login);
      return false;
    }

    if (result.status === 403) {
      throw new Error(result.data.error?.message || 'Admin access is required.');
    }

    if (!result.ok) {
      throw new Error(result.data.error?.message || fallbackMessage);
    }

    return true;
  };

  const loadDonations = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getAdminDonations();
      if (!handleApiResult(result, 'Unable to load donations.')) {
        return;
      }

      setDonations(result.data.data?.donations || []);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load donations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabCounts = useMemo(() => {
    const counts = {
      all: donations.length,
      available: 0,
      booked: 0,
      collected: 0,
      expired: 0,
    };

    donations.forEach((donation) => {
      const status = normalizeDonationStatus(donation.status);
      if (status === 'completed') {
        counts.collected += 1;
        return;
      }

      if (Object.prototype.hasOwnProperty.call(counts, status)) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [donations]);

  const filteredDonations = useMemo(() => {
    if (activeTab === 'all') {
      return donations;
    }

    return donations.filter((donation) => {
      const status = normalizeDonationStatus(donation.status);
      if (activeTab === 'collected') {
        return status === 'collected' || status === 'completed';
      }

      return status === activeTab;
    });
  }, [activeTab, donations]);

  const openDonationDetails = async (donationId) => {
    setIsDetailsLoading(true);
    setErrorMessage('');

    try {
      const result = await getAdminDonationById(donationId);
      if (!handleApiResult(result, 'Unable to load donation details.')) {
        return;
      }

      setSelectedDonationDetails(result.data.data || null);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load donation details.');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeDonationDetails = () => {
    setSelectedDonationDetails(null);
  };

  const updateDonationStatus = async (donationId, status, successText) => {
    setActionDonationId(donationId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await updateAdminDonationStatus(donationId, status);
      if (!handleApiResult(result, 'Unable to update donation.')) {
        return;
      }

      setSuccessMessage(successText);
      await loadDonations();
      if (selectedDonationDetails?.donation?._id === donationId) {
        await openDonationDetails(donationId);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update donation.');
    } finally {
      setActionDonationId('');
    }
  };

  const deleteDonation = async (donationId) => {
    const shouldDelete = window.confirm('Delete this donation permanently?');
    if (!shouldDelete) {
      return;
    }

    setActionDonationId(donationId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await deleteAdminDonation(donationId);
      if (!handleApiResult(result, 'Unable to delete donation.')) {
        return;
      }

      setSuccessMessage('Donation deleted successfully.');
      setSelectedDonationDetails(null);
      await loadDonations();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to delete donation.');
    } finally {
      setActionDonationId('');
    }
  };

  const markExpired = (donationId) =>
    updateDonationStatus(donationId, 'expired', 'Donation marked expired successfully.');

  const cancelDonation = (donationId) =>
    updateDonationStatus(donationId, 'cancelled', 'Donation cancelled successfully.');

  const markCollected = (donationId) =>
    updateDonationStatus(donationId, 'collected', 'Donation marked collected successfully.');

  const cancelBooking = (donationId) =>
    updateDonationStatus(donationId, 'available', 'Booking cancelled successfully.');

  const updateDonationStatusFromList = (donationId, status) => {
    const successMessages = {
      available: 'Booking cancelled successfully.',
      collected: 'Donation marked collected successfully.',
      expired: 'Donation marked expired successfully.',
      cancelled: 'Donation cancelled successfully.',
    };

    return updateDonationStatus(
      donationId,
      status,
      successMessages[status] || 'Donation status updated successfully.'
    );
  };

  return {
    activeTab,
    actionDonationId,
    cancelBooking,
    cancelDonation,
    closeDonationDetails,
    deleteDonation,
    errorMessage,
    filteredDonations,
    isDetailsLoading,
    isLoading,
    markCollected,
    markExpired,
    openDonationDetails,
    selectedDonationDetails,
    setActiveTab,
    statusTabs,
    successMessage,
    tabCounts,
    tabStatuses,
    updateDonationStatusFromList,
  };
};
