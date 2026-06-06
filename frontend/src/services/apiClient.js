import { API_BASE_URL, API_ROUTES } from '../config/apiConfig';

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  return {
    data,
    ok: response.ok,
    status: response.status,
  };
};

const shouldRefreshAccessToken = (path, result) =>
  path !== API_ROUTES.login &&
  path !== API_ROUTES.logout &&
  path !== API_ROUTES.refresh &&
  result.status === 401 &&
  result.data?.error?.code === 'TOKEN_EXPIRED';

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
  });

  const result = await parseResponse(response);

  if (!shouldRefreshAccessToken(path, result)) {
    return result;
  }

  const refreshResponse = await fetch(`${API_BASE_URL}${API_ROUTES.refresh}`, {
    method: 'POST',
    credentials: 'include',
  });
  const refreshResult = await parseResponse(refreshResponse);

  if (!refreshResult.ok) {
    return result;
  }

  const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
  });

  return parseResponse(retryResponse);
};
