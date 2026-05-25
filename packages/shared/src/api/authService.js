import { apiClient } from './apiClient';
import { clearAuthTokens, storeAuthTokens } from './tokenStorage';

export const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/v1/Auth/login', credentials);
    storeAuthTokens(data);
    return data;
  },
  
  logout: () => {
    clearAuthTokens();
  },

  getCurrentUser: async () => {
    const { data } = await apiClient.get('/v1/Users/me');
    return data;
  }
};
