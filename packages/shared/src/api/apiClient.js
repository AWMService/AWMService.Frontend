import axios from 'axios';
import { getToken, removeToken } from './tokenStorage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7009/api/v1',
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
      
      // Normalize error to standard AppError format
      const appError = {
        status,
        code: data?.code || data?.extensions?.code || 'UNKNOWN_ERROR',
        message: data?.detail || data?.title || data?.message || error.message || 'An unexpected error occurred.',
        traceId: data?.extensions?.traceId || null,
        validationErrors: data?.extensions?.validationErrors || []
      };

      if (status === 401) {
        removeToken();
        // Optional: trigger a global event or redirect
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
