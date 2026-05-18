import axios from 'axios';
import { clearAuthTokens, getToken } from './tokenStorage';
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5102/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const appError = {
        status,
        code: data?.code || data?.extensions?.code || 'UNKNOWN_ERROR',
        message: data?.detail || data?.title || data?.message || error.message || 'An unexpected error occurred.',
        traceId: data?.extensions?.traceId || null,
        validationErrors: data?.extensions?.validationErrors || []
      };
      if (status === 401) {
        clearAuthTokens();
        window.dispatchEvent(new Event('awm:unauthorized'));
      }
      return Promise.reject(appError);
    }
    return Promise.reject({
      status: 0,
      code: 'NETWORK_ERROR',
      message: error.message
    });
  }
);
