export const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue));
};

export const formatQuantity = (quantity) => {
  if (!quantity?.value || !quantity?.unit) {
    return 'Quantity not set';
  }

  return `${quantity.value} ${quantity.unit}`;
};

export const DEFAULT_DONATION_IMAGE = '/hero-image.JPG';

export const getDonationImage = (donation) => donation?.images?.[0] || DEFAULT_DONATION_IMAGE;

export const toDateTimeInputValue = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  const date = new Date(dateValue);
  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

export const buildDonutGradient = (rows, total) => {
  if (!total) {
    return 'radial-gradient(circle, #ffffff 0 39%, transparent 40%), conic-gradient(#e5e7eb 0 100%)';
  }

  let current = 0;
  const segments = rows
    .filter((row) => row.value > 0)
    .map((row) => {
      const start = current;
      current += (row.value / total) * 100;
      return `${row.color} ${start}% ${current}%`;
    });

  return `radial-gradient(circle, #ffffff 0 39%, transparent 40%), conic-gradient(${segments.join(', ')})`;
};

export const getDonationSummary = (donations, stats) => {
  const expiredCancelled = donations.filter((donation) =>
    ['expired', 'cancelled'].includes(donation.status)
  ).length;
  const requestedBooked = (stats.requested || 0) + (stats.booked || 0);
  const total = stats.total || donations.length || 0;

  return {
    total,
    available: stats.available || 0,
    requestedBooked,
    collected: stats.collected || 0,
    expiredCancelled,
  };
};

export const buildDashboardOverviewRows = (donationSummary, overviewColors) => [
  { label: 'Available', value: donationSummary.available, color: overviewColors.available },
  {
    label: 'Requested / Booked',
    value: donationSummary.requestedBooked,
    color: overviewColors.requestedBooked,
  },
  { label: 'Collected', value: donationSummary.collected, color: overviewColors.collected },
  {
    label: 'Expired / Cancelled',
    value: donationSummary.expiredCancelled,
    color: overviewColors.expiredCancelled,
  },
];
