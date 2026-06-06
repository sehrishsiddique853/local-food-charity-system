import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  getNgoAvailableDonations,
  getNgoRequests,
  requestNgoDonation,
} from '../services/ngoService';
import { getPickupArea } from '../utils/donationUtils';

const unavailableDonationStatuses = ['booked', 'collected', 'completed', 'expired', 'cancelled'];
const activeRequestStatuses = ['pending', 'approved'];

export const useNgoAvailableDonations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [foodType, setFoodType] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('');
  const [pickupAreaFilter, setPickupAreaFilter] = useState('');
  const [allDonations, setAllDonations] = useState([]);
  const [requestedDonationIds, setRequestedDonationIds] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingDonationId, setRequestingDonationId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const filters = useMemo(() => ({
    search: searchTerm.trim(),
    foodType,
  }), [foodType, searchTerm]);

  const loadDonations = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [donationsResult, requestsResult] = await Promise.all([
        getNgoAvailableDonations(filters),
        getNgoRequests(),
      ]);

      if (donationsResult.status === 401 || requestsResult.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (donationsResult.status === 403 || requestsResult.status === 403) {
        throw new Error(
          donationsResult.data.error?.message ||
          requestsResult.data.error?.message ||
          'Your NGO account is not approved yet.'
        );
      }

      if (!donationsResult.ok || !requestsResult.ok) {
        throw new Error(
          donationsResult.data.error?.message ||
          requestsResult.data.error?.message ||
          'Unable to load available donations.'
        );
      }

      const ngoRequests = requestsResult.data.data?.requests || [];

      setAllDonations(donationsResult.data.data?.donations || []);
      setRequestedDonationIds(
        ngoRequests
          .filter((request) => activeRequestStatuses.includes(request.requestStatus))
          .map((request) => request.donation?._id || request.donation)
          .filter(Boolean)
      );
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load available donations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [filters, navigate]);

  const donations = useMemo(() => {
    const minimumQuantity = Number(quantityFilter);
    const expiryTimestamp = expiryFilter ? new Date(expiryFilter).setHours(23, 59, 59, 999) : null;
    const pickupSearch = pickupAreaFilter.trim().toLowerCase();

    return allDonations.filter((donation) => {
      const quantityValue = Number(donation.quantity?.value || 0);
      const donationExpiry = donation.expiryDate ? new Date(donation.expiryDate).getTime() : null;
      const pickupArea = getPickupArea(donation).toLowerCase();

      if (unavailableDonationStatuses.includes(donation.status)) {
        return false;
      }

      if (requestedDonationIds.includes(donation._id)) {
        return false;
      }

      if (quantityFilter && quantityValue < minimumQuantity) {
        return false;
      }

      if (expiryTimestamp && (!donationExpiry || donationExpiry > expiryTimestamp)) {
        return false;
      }

      if (pickupSearch && !pickupArea.includes(pickupSearch)) {
        return false;
      }

      return true;
    });
  }, [allDonations, expiryFilter, pickupAreaFilter, quantityFilter, requestedDonationIds]);

  const handleRequestDonation = async (donationId) => {
    setRequestingDonationId(donationId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await requestNgoDonation(donationId);

      if (result.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Unable to request donation.');
      }

      setSuccessMessage(result.data.data?.message || 'Donation request sent successfully.');
      setRequestedDonationIds((currentIds) => (
        currentIds.includes(donationId) ? currentIds : [...currentIds, donationId]
      ));
      setAllDonations((currentDonations) =>
        currentDonations.filter((donation) => donation._id !== donationId)
      );
      setSelectedDonation(null);
      await loadDonations();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to request donation.');
    } finally {
      setRequestingDonationId('');
    }
  };

  return {
    donations,
    searchTerm,
    foodType,
    quantityFilter,
    expiryFilter,
    pickupAreaFilter,
    selectedDonation,
    isLoading,
    requestingDonationId,
    errorMessage,
    successMessage,
    setSearchTerm,
    setFoodType,
    setQuantityFilter,
    setExpiryFilter,
    setPickupAreaFilter,
    setSelectedDonation,
    handleRequestDonation,
  };
};
