import { apiClient } from './apiClient';

export const adminApi = {
  // Users
  fetchUsers: async ({ universityId, isActive, search }) => {
    const params = { universityId };
    if (isActive !== undefined && isActive !== null && isActive !== 'all') {
      params.isActive = isActive === 'active';
    }
    if (search) {
      params.search = search;
    }
    const { data } = await apiClient.get('/Users', { params });
    return data;
  },

  fetchUserById: async (userId) => {
    const { data } = await apiClient.get(`/Users/${userId}`);
    return data;
  },

  createUser: async (userData) => {
    const { data } = await apiClient.post('/Users', userData);
    return data;
  },

  updateUser: async (userId, userData) => {
    const { data } = await apiClient.put(`/Users/${userId}`, userData);
    return data;
  },

  toggleUserStatus: async (userId, isActive) => {
    const { data } = await apiClient.patch(`/Users/${userId}/status`, { isActive });
    return data;
  },

  // Roles
  fetchRoles: async (universityId) => {
    const { data } = await apiClient.get('/Roles', { params: { universityId } });
    return data;
  }
};

export const orgApi = {
  fetchInstitutes: async (universityId) => {
    const { data } = await apiClient.get('/Institutes', { params: { universityId } });
    return data;
  },
  
  fetchDepartments: async (universityId) => {
    // Assuming a flat list of departments for the university for now
    const { data } = await apiClient.get('/Departments', { params: { universityId } });
    return data;
  }
};
