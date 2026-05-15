const TOKEN_KEY = 'awm_access_token';
const REFRESH_TOKEN_KEY = 'awm_refresh_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const clearAuthTokens = () => {
  removeToken();
  removeRefreshToken();
};

export const storeAuthTokens = ({ token, accessToken, refreshToken } = {}) => {
  const resolvedToken = token || accessToken;
  if (resolvedToken) {
    setToken(resolvedToken);
  }
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }

  return {
    token: resolvedToken,
    refreshToken,
  };
};

export const consumeAuthTokensFromUrl = () => {
  if (typeof window === 'undefined') {
    return { token: null, refreshToken: null };
  }

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));

  const token =
    hashParams.get('access_token') ||
    hashParams.get('token') ||
    searchParams.get('access_token') ||
    searchParams.get('token');

  const refreshToken =
    hashParams.get('refresh_token') ||
    searchParams.get('refresh_token');

  if (!token && !refreshToken) {
    return { token: null, refreshToken: null };
  }

  storeAuthTokens({ token, refreshToken });

  ['access_token', 'token', 'refresh_token'].forEach((key) => {
    searchParams.delete(key);
    hashParams.delete(key);
  });

  url.search = searchParams.toString();
  url.hash = hashParams.toString();
  window.history.replaceState(window.history.state, '', url.toString());

  return { token, refreshToken };
};
