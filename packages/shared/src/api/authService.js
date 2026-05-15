import { apiClient } from './apiClient';
import { setToken, removeToken } from './tokenStorage';

export const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/Auth/login', credentials);
    if (data && data.token) {
      setToken(data.token);
    }
    return data;
  },
  
  logout: () => {
    removeToken();
  },

  getCurrentUser: async () => {
    const { data } = await apiClient.get('/Users/me');
    return data;
  }
};
