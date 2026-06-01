import { API_BASE_URL } from '../config/apiConfig';

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  return {
    data,
    ok: response.ok,
    status: response.status,
  };
};
