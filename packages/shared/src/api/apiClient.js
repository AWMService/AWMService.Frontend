import axios from 'axios';
import { clearAuthTokens, getToken, getRefreshToken, storeAuthTokens } from './tokenStorage';
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5102/api',
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      const { status, data } = error.response;


      const appError = {
        status,
        code: data?.code || data?.extensions?.code || 'UNKNOWN_ERROR',
        message: data?.detail || data?.title || data?.message || error.message || 'An unexpected error occurred.',
        traceId: data?.extensions?.traceId || null,
        validationErrors: data?.extensions?.validationErrors || []
      };
      if (status === 401 && !originalRequest._retry) {
        const isAuthEndpoint = originalRequest.url?.includes('/Auth/login') || originalRequest.url?.includes('/Auth/refresh-token');
        if (isAuthEndpoint) {
          clearAuthTokens();
          window.dispatchEvent(new Event('awm:unauthorized'));
          return Promise.reject(appError);
        }

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearAuthTokens();
          window.dispatchEvent(new Event('awm:unauthorized'));
          return Promise.reject(appError);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data: refreshData } = await axios.post(
            `${apiClient.defaults.baseURL}/v1/Auth/refresh-token`,
            { refreshToken }
          );
          if (refreshData?.token) {
            storeAuthTokens(refreshData);
            processQueue(null, refreshData.token);
            originalRequest.headers.Authorization = `Bearer ${refreshData.token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearAuthTokens();
          window.dispatchEvent(new Event('awm:unauthorized'));
          return Promise.reject(appError);
        } finally {
          isRefreshing = false;
        }
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
