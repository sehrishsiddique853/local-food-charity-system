import { API_ROUTES } from '../config/apiConfig';
import { apiRequest } from './apiClient';

export const getAdminDashboard = () => apiRequest(API_ROUTES.adminDashboard);

export const getAdminDonationReport = () => apiRequest(API_ROUTES.adminDonationReport);

export const getAdminRequestReport = () => apiRequest(API_ROUTES.adminRequestReport);

export const getAdminUserReport = () => apiRequest(API_ROUTES.adminUserReport);

export const getAdminDonationTimelineReport = (period = 'monthly') =>
  apiRequest(`${API_ROUTES.adminDonationTimelineReport}?period=${period}`);

export const getAdminNgos = (status = '') => {
  const queryString = status ? `?status=${status}` : '';
  return apiRequest(`${API_ROUTES.adminNgos}${queryString}`);
};

export const getAdminNgoById = (ngoId) => apiRequest(`${API_ROUTES.adminNgos}/${ngoId}`);

export const approveAdminNgo = (ngoId) =>
  apiRequest(`${API_ROUTES.adminNgos}/${ngoId}/approve`, {
    method: 'PUT',
  });

export const rejectAdminNgo = (ngoId, payload = {}) =>
  apiRequest(`${API_ROUTES.adminNgos}/${ngoId}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

export const getAdminRequests = (status = '') => {
  const queryString = status ? `?status=${status}` : '';
  return apiRequest(`${API_ROUTES.adminRequests}${queryString}`);
};

export const getAdminRequestById = (requestId) =>
  apiRequest(`${API_ROUTES.adminRequests}/${requestId}`);

export const approveAdminRequest = (requestId, payload = {}) =>
  apiRequest(`${API_ROUTES.adminRequests}/${requestId}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

export const rejectAdminRequest = (requestId, payload = {}) =>
  apiRequest(`${API_ROUTES.adminRequests}/${requestId}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
