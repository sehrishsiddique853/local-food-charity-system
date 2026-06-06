import { API_ROUTES } from '../config/apiConfig';
import { apiRequest } from './apiClient';

export const getNgoRequestStats = () => apiRequest(API_ROUTES.ngoRequestStats);

export const getNgoAvailableDonations = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (filters.foodType) {
    params.set('foodType', filters.foodType);
  }

  const queryString = params.toString();

  return apiRequest(
    queryString ? `${API_ROUTES.ngoAvailableDonations}?${queryString}` : API_ROUTES.ngoAvailableDonations
  );
};

export const getNgoRequests = () => apiRequest(API_ROUTES.ngoRequests);

export const getNgoBookedDonations = () => apiRequest(API_ROUTES.ngoBookedDonations);

export const getNgoHistory = () => apiRequest(API_ROUTES.ngoHistory);

export const markNgoDonationCollected = (donationId) =>
  apiRequest(`${API_ROUTES.ngoDonations}/${donationId}/collect`, {
    method: 'PUT',
  });

export const requestNgoDonation = (donationId, payload = {}) =>
  apiRequest(`${API_ROUTES.ngoDonations}/${donationId}/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

export const cancelNgoRequest = (requestId, payload = {}) =>
  apiRequest(`${API_ROUTES.ngoRequests}/${requestId}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
