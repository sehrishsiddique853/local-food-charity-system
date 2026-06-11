import { API_ROUTES } from '../config/apiConfig';
import { apiRequest } from './apiClient';

export const sendContactMessage = (payload) => apiRequest(API_ROUTES.contact, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});
