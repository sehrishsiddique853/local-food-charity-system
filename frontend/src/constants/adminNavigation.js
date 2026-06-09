import { ROUTES } from './routes';

export const adminNavItems = [
  {
    key: 'dashboard',
    href: ROUTES.adminDashboard,
    label: 'Dashboard',
  },
  {
    key: 'ngos',
    href: ROUTES.adminNgos,
    label: 'NGO Management',
  },
  {
    key: 'requests',
    href: ROUTES.adminRequests,
    label: 'Requests',
  },
  {
    key: 'donations',
    href: ROUTES.adminDonations,
    label: 'Donations',
  },
  {
    key: 'users',
    href: ROUTES.adminUsers,
    label: 'Users',
  },
  {
    key: 'reports',
    href: ROUTES.adminReports,
    label: 'Reports & Analytics',
  },
];
