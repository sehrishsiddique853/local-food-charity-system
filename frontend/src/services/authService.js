import { apiRequest } from './apiClient';
import { API_ROUTES } from '../config/apiConfig';

export const login = (credentials) => apiRequest(API_ROUTES.login, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(credentials),
});

export const register = (payload) => apiRequest(API_ROUTES.register, {
  method: 'POST',
  body: payload,
});

export const sendRegistrationOtp = (payload) => apiRequest(API_ROUTES.registerSendOtp, {
  method: 'POST',
  body: payload,
});

export const getProfile = () => apiRequest(API_ROUTES.profile);

export const updateProfile = (payload) => apiRequest(API_ROUTES.profile, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

export const changePassword = (payload) => apiRequest(API_ROUTES.changePassword, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

export const logout = () => apiRequest(API_ROUTES.logout, {
  method: 'POST',
});
