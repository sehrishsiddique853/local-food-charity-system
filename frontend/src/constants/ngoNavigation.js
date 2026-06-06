import { ROUTES } from './routes';

export const ngoNavItems = [
  {
    key: 'dashboard',
    href: ROUTES.ngoDashboard,
    label: 'Dashboard',
  },
  {
    key: 'available',
    href: ROUTES.ngoAvailableDonations,
    label: 'Available Donations',
  },
  {
    key: 'requests',
    href: ROUTES.ngoRequests,
    label: 'My Requests',
  },
  {
    key: 'booked',
    href: ROUTES.ngoBookedDonations,
    label: 'Booked Donations',
  },
  {
    key: 'history',
    href: ROUTES.ngoHistory,
    label: 'History',
  },
  {
    key: 'profile',
    href: ROUTES.ngoProfile,
    label: 'My Profile',
  },
];
