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
  // Institutes
  fetchInstitutes: async (universityId) => {
    const { data } = await apiClient.get('/Institutes', { params: { universityId } });
    return data;
  },
  createInstitute: async (instituteData) => {
    const { data } = await apiClient.post('/Institutes', instituteData);
    return data;
  },
  updateInstitute: async (id, instituteData) => {
    const { data } = await apiClient.put(`/Institutes/${id}`, instituteData);
    return data;
  },
  deleteInstitute: async (id) => {
    const { data } = await apiClient.delete(`/Institutes/${id}`);
    return data;
  },
  
  // Departments
  fetchDepartments: async (universityId) => {
    const { data } = await apiClient.get('/Departments', { params: { universityId } });
    return data;
  },
  createDepartment: async (instituteId, deptData) => {
    const { data } = await apiClient.post(`/Institutes/${instituteId}/departments`, deptData);
    return data;
  },
  updateDepartment: async (id, deptData) => {
    const { data } = await apiClient.put(`/org-units/${id}`, deptData);
    return data;
  },
  deleteDepartment: async (id) => {
    const { data } = await apiClient.delete(`/org-units/${id}`);
    return data;
  }
};

export const eduApi = {
  // Academic Programs
  fetchPrograms: async () => {
    const { data } = await apiClient.get('/academic-programs');
    return data;
  },
  createProgram: async (programData) => {
    const { data } = await apiClient.post('/academic-programs', programData);
    return data;
  },
  updateProgram: async (id, programData) => {
    const { data } = await apiClient.put(`/academic-programs/${id}`, programData);
    return data;
  },
  deleteProgram: async (id) => {
    const { data } = await apiClient.delete(`/academic-programs/${id}`);
    return data;
  },

  // Degree Levels
  fetchDegreeLevels: async () => {
    const { data } = await apiClient.get('/degree-levels');
    return data;
  },
  createDegreeLevel: async (levelData) => {
    const { data } = await apiClient.post('/degree-levels', levelData);
    return data;
  },
  updateDegreeLevel: async (id, levelData) => {
    const { data } = await apiClient.put(`/degree-levels/${id}`, levelData);
    return data;
  },
  deleteDegreeLevel: async (id) => {
    const { data } = await apiClient.delete(`/degree-levels/${id}`);
    return data;
  }
};

export const wfApi = {
  // Work Types
  fetchWorkTypes: async () => {
    const { data } = await apiClient.get('/WorkTypes');
    return data;
  },
  createWorkType: async (typeData) => {
    const { data } = await apiClient.post('/WorkTypes', typeData);
    return data;
  },
  updateWorkType: async (id, typeData) => {
    const { data } = await apiClient.put(`/WorkTypes/${id}`, typeData);
    return data;
  },
  deleteWorkType: async (id) => {
    const { data } = await apiClient.delete(`/WorkTypes/${id}`);
    return data;
  }
};

export const staffApi = {
  fetchStaffByDepartment: async (orgUnitId) => {
    const { data } = await apiClient.get(`/org-units/${orgUnitId}/supervisors/available`);
    return data;
  },
  createStaff: async (staffData) => {
    const { data } = await apiClient.post('/Staff', staffData);
    return data;
  },
  updateStaff: async (staffId, staffData) => {
    const { data } = await apiClient.put(`/Staff/${staffId}`, staffData);
    return data;
  },
  updateWorkload: async (orgUnitId, userId, semesterId, specialityId, maxWorkload) => {
    const { data } = await apiClient.put(`/org-units/${orgUnitId}/supervisors/${userId}/workload`, 
      { maxWorkload },
      { params: { semesterId, specialityId } }
    );
    return data;
  },
  approveSupervisors: async (orgUnitId, semesterId, specialityId, assignments) => {
    const { data } = await apiClient.post(`/org-units/${orgUnitId}/supervisors/approve`, {
      semesterId,
      specialityId,
      assignments
    });
    return data;
  },
  fetchSupervisors: async (orgUnitId, semesterId, specialityId = null) => {
    const { data } = await apiClient.get(`/org-units/${orgUnitId}/supervisors/approved`, {
      params: { semesterId, specialityId }
    });
    return data;
  },
  removeSupervisor: async (orgUnitId, userId, semesterId, specialityId = null) => {
    const { data } = await apiClient.delete(`/org-units/${orgUnitId}/supervisors/${userId}`, {
      params: { semesterId, specialityId }
    });
    return data;
  }
};
