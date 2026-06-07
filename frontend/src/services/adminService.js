import { API_ROUTES } from '../config/apiConfig';
import { apiRequest } from './apiClient';

export const getAdminDashboard = () => apiRequest(API_ROUTES.adminDashboard);

export const getAdminDonationReport = () => apiRequest(API_ROUTES.adminDonationReport);

export const getAdminRequestReport = () => apiRequest(API_ROUTES.adminRequestReport);

export const getAdminUserReport = () => apiRequest(API_ROUTES.adminUserReport);

export const getAdminDonationTimelineReport = (period = 'monthly') =>
  apiRequest(`${API_ROUTES.adminDonationTimelineReport}?period=${period}`);
