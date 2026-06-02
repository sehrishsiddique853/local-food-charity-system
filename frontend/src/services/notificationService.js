import { API_ROUTES } from '../config/apiConfig';
import { apiRequest } from './apiClient';

export const getNotifications = () => apiRequest(API_ROUTES.notifications);

export const getUnreadNotificationCount = () => apiRequest(API_ROUTES.unreadNotifications);

export const markNotificationRead = (notificationId) =>
  apiRequest(`${API_ROUTES.notifications}/${notificationId}/read`, {
    method: 'PUT',
  });

export const markAllNotificationsRead = () =>
  apiRequest(`${API_ROUTES.notifications}/read-all`, {
    method: 'PUT',
  });
