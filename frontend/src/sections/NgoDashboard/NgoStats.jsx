import DonationStats from '../DonorDashboard/DonationStats';

const statIcons = {
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
  pending: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7v5l3 2" />
      <path d="M21 12a9 9 0 1 1-9-9" />
    </svg>
  ),
  approved: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5 10 17 19 7" />
      <path d="M4 19h16" />
    </svg>
  ),
  collected: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h12" />
      <path d="M8 8V6h8v2" />
      <path d="M6 8v11h12V8" />
      <path d="M9 13h6" />
    </svg>
  ),
};

const ngoStatsCards = [
  {
    key: 'totalRequests',
    className: 'green',
    icon: statIcons.requests,
    title: 'Total Requests',
    caption: 'All submitted requests',
  },
  {
    key: 'pendingRequests',
    className: 'orange',
    icon: statIcons.pending,
    title: 'Pending Requests',
    caption: 'Awaiting admin review',
  },
  {
    key: 'approvedBooked',
    className: 'blue',
    icon: statIcons.approved,
    title: 'Booked',
    caption: 'Ready for pickup',
  },
  {
    key: 'collectedDonations',
    className: 'purple',
    icon: statIcons.collected,
    title: 'Collected Donations',
    caption: 'Successfully collected',
  },
];

const NgoStats = ({ summary }) => <DonationStats summary={summary} cards={ngoStatsCards} />;

export default NgoStats;
