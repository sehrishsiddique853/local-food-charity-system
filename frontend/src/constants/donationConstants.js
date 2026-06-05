export const donationStatusLabels = {
  available: 'Available',
  requested: 'Requested',
  booked: 'Booked',
  collected: 'Collected',
  completed: 'Completed',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

export const donationStatusClasses = {
  available: 'available',
  requested: 'requested',
  booked: 'booked',
  collected: 'collected',
  completed: 'completed',
  expired: 'expired',
  cancelled: 'cancelled',
};

export const initialDonationStats = {
  total: 0,
  available: 0,
  requested: 0,
  booked: 0,
  collected: 0,
};

export const overviewColors = {
  available: '#27ae60',
  booked: '#2563eb',
  collected: '#0f766e',
  cancelled: '#b91c1c',
  expired: '#6b7280',
};

export const foodTypeOptions = [
  { label: 'Cooked', value: 'cooked' },
  { label: 'Packed', value: 'packed' },
  { label: 'Raw', value: 'raw' },
  { label: 'Bakery', value: 'bakery' },
  { label: 'Beverages', value: 'beverages' },
];

export const quantityUnitOptions = [
  { label: 'Plates', value: 'plates' },
  { label: 'Kg', value: 'kg' },
  { label: 'Boxes', value: 'boxes' },
  { label: 'Packets', value: 'packets' },
  { label: 'Bottles', value: 'bottles' },
  { label: 'Trays', value: 'trays' },
];

export const initialPostDonationForm = {
  foodTitle: '',
  foodType: 'cooked',
  quantityValue: '',
  quantityUnit: 'plates',
  address: '',
  expiryDate: '',
  description: '',
  images: [],
};
