import DonationStats from '../DonorDashboard/DonationStats';

const statIcons = {
  donations: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19V5" />
      <path d="M19 19H5" />
      <path d="M9 15v-4" />
      <path d="M13 15V8" />
      <path d="M17 15v-2" />
    </svg>
  ),
  available: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h12" />
      <path d="M8 8V6h8v2" />
      <path d="M6 8v11h12V8" />
      <path d="M9 12h6" />
    </svg>
  ),
  booked: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7v5l3 2" />
      <path d="M12 21a9 9 0 1 0-8.5-6" />
      <path d="M3 21v-6h6" />
    </svg>
  ),
  collected: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5 10 17 19 7" />
      <path d="M4 19h16" />
    </svg>
  ),
  ngo: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
    </svg>
  ),
  pending: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7v5l3 2" />
      <path d="M21 12a9 9 0 1 1-9-9" />
    </svg>
  ),
  verified: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  requests: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  ),
};

const adminStatsCards = [
  {
    key: 'totalDonations',
    className: 'green',
    icon: statIcons.donations,
    title: 'Total Donations',
    caption: 'All posted donations',
  },
  {
    key: 'availableDonations',
    className: 'orange',
    icon: statIcons.available,
    title: 'Available Donations',
    caption: 'Open for NGO requests',
  },
  {
    key: 'bookedDonations',
    className: 'blue',
    icon: statIcons.booked,
    title: 'Booked Donations',
    caption: 'Approved for pickup',
  },
  {
    key: 'collectedDonations',
    className: 'purple',
    icon: statIcons.collected,
    title: 'Collected Donations',
    caption: 'Successfully collected',
  },
  {
    key: 'totalNGOs',
    className: 'green',
    icon: statIcons.ngo,
    title: 'Total NGOs',
    caption: 'Registered organizations',
  },
  {
    key: 'pendingNGOs',
    className: 'orange',
    icon: statIcons.pending,
    title: 'Pending NGOs',
    caption: 'Awaiting verification',
  },
  {
    key: 'verifiedNGOs',
    className: 'blue',
    icon: statIcons.verified,
    title: 'Verified NGOs',
    caption: 'Approved organizations',
  },
  {
    key: 'pendingRequests',
    className: 'orange',
    icon: statIcons.requests,
    title: 'Pending Requests',
    caption: 'Awaiting admin review',
  },
  {
    key: 'approvedRequests',
    className: 'purple',
    icon: statIcons.verified,
    title: 'Approved Requests',
    caption: 'Ready for collection',
  },
];

const AdminStats = ({ summary }) => (
  <DonationStats summary={summary} cards={adminStatsCards} />
);

export default AdminStats;
