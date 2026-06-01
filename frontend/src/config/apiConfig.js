export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ROUTES = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  profile: '/api/auth/profile',
  logout: '/api/auth/logout',
  donationStats: '/api/donations/my/stats',
  donationHistory: '/api/donations/history',
  createDonation: '/api/donations',
};
