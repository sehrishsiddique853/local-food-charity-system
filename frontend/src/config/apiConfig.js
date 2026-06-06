export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ROUTES = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  profile: '/api/auth/profile',
  changePassword: '/api/auth/change-password',
  logout: '/api/auth/logout',
  donationStats: '/api/donations/my/stats',
  donationHistory: '/api/donations/history',
  createDonation: '/api/donations',
  donations: '/api/donations',
  notifications: '/api/notifications',
  unreadNotifications: '/api/notifications/unread-count',
  ngoRequestStats: '/api/ngo/requests/stats',
  ngoAvailableDonations: '/api/ngo/donations/available',
  ngoDonations: '/api/ngo/donations',
  ngoRequests: '/api/ngo/requests',
  ngoBookedDonations: '/api/ngo/donations/booked',
  ngoHistory: '/api/ngo/history',
};
