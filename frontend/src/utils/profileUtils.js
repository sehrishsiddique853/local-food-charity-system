export const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return 'D';
  }

  return words.slice(0, 2).map((word) => word[0].toUpperCase()).join('');
};
