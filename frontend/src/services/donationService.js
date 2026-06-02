import { apiRequest } from './apiClient';
import { API_ROUTES } from '../config/apiConfig';

export const getMyDonationStats = () => apiRequest(API_ROUTES.donationStats);

export const getDonationHistory = () => apiRequest(API_ROUTES.donationHistory);

export const createDonation = (payload) => apiRequest(API_ROUTES.createDonation, {
  method: 'POST',
  body: payload,
});

export const updateDonation = (donationId, payload) => apiRequest(`${API_ROUTES.donations}/${donationId}`, {
  method: 'PUT',
  body: payload,
});

export const deleteDonation = (donationId) => apiRequest(`${API_ROUTES.donations}/${donationId}`, {
  method: 'DELETE',
});
