import { apiClient } from './apiClient';

export const adminApi = {
  
  fetchUsers: async ({ universityId, isActive, search }) => {
    const params = { universityId };
    if (isActive !== undefined && isActive !== null && isActive !== 'all') {
      params.isActive = isActive === 'active';
    }
    if (search) {
      params.search = search;
    }
    const { data } = await apiClient.get('/v1/Users', { params });
    return data;
  },

  fetchUserById: async (userId) => {
    const { data } = await apiClient.get(`/v1/Users/${userId}`);
    return data;
  },

  createUser: async (userData) => {
    const { data } = await apiClient.post('/v1/Users', userData);
    return data;
  },

  updateUser: async (userId, userData) => {
    const { data } = await apiClient.put(`/v1/Users/${userId}`, userData);
    return data;
  },

  toggleUserStatus: async (userId, isActive) => {
    const { data } = await apiClient.patch(`/v1/Users/${userId}/status`, { isActive });
    return data;
  },

  
  fetchRoles: async () => {
    const { data } = await apiClient.get('/v1/Roles');
    return data;
  },

  
  fetchStudents: async ({ universityId, search, status }) => {
    const params = { universityId, search, status };
    const { data } = await apiClient.get('/v1/Students', { params });
    return data;
  }
};

export const orgApi = {
  
  fetchOrgUnits: async (typeId) => {
    const { data } = await apiClient.get('/v1/OrgUnits', { params: { typeId } });
    return data;
  },
  createOrgUnit: async (orgUnitData) => {
    const { data } = await apiClient.post('/v1/OrgUnits', orgUnitData);
    return data;
  },
  updateOrgUnit: async (id, orgUnitData) => {
    const { data } = await apiClient.put(`/v1/OrgUnits/${id}`, orgUnitData);
    return data;
  },
  deleteOrgUnit: async (id) => {
    const { data } = await apiClient.delete(`/v1/OrgUnits/${id}`);
    return data;
  }
};

export const eduApi = {
  
  fetchPrograms: async () => {
    const { data } = await apiClient.get('/v1/academic-programs');
    return data;
  },
  createProgram: async (programData) => {
    const { data } = await apiClient.post('/v1/academic-programs', programData);
    return data;
  },
  updateProgram: async (id, programData) => {
    const { data } = await apiClient.put(`/v1/academic-programs/${id}`, programData);
    return data;
  },
  deleteProgram: async (id) => {
    const { data } = await apiClient.delete(`/v1/academic-programs/${id}`);
    return data;
  },

  
  fetchSpecialityLevels: async () => {
    const { data } = await apiClient.get('/v1/speciality-levels');
    return data;
  },
  createSpecialityLevel: async (levelData) => {
    const { data } = await apiClient.post('/v1/speciality-levels', levelData);
    return data;
  },
  updateSpecialityLevel: async (id, levelData) => {
    const { data } = await apiClient.put(`/v1/speciality-levels/${id}`, levelData);
    return data;
  },
  deleteSpecialityLevel: async (id) => {
    const { data } = await apiClient.delete(`/v1/speciality-levels/${id}`);
    return data;
  }
};

export const wfApi = {
  
  fetchWorkTypes: async () => {
    const { data } = await apiClient.get('/v1/WorkTypes');
    return data;
  },
  createWorkType: async (typeData) => {
    const { data } = await apiClient.post('/v1/WorkTypes', typeData);
    return data;
  },
  updateWorkType: async (id, typeData) => {
    const { data } = await apiClient.put(`/v1/WorkTypes/${id}`, typeData);
    return data;
  },
  deleteWorkType: async (id) => {
    const { data } = await apiClient.delete(`/v1/WorkTypes/${id}`);
    return data;
  }
};

export const staffApi = {
  fetchOrgUnitEmployees: async (orgUnitId) => {
    const { data } = await apiClient.get(`/v1/org-units/${orgUnitId}/employees/available`);
    return data;
  },
  createStaff: async (staffData) => {
    const { data } = await apiClient.post('/v1/Staff', staffData);
    return data;
  },
  updateStaff: async (staffId, staffData) => {
    const { data } = await apiClient.put(`/v1/Staff/${staffId}`, staffData);
    return data;
  },
  updateWorkload: async (orgUnitId, userId, semesterId, specialityId, maxWorkload) => {
    const { data } = await apiClient.put(`/v1/org-units/${orgUnitId}/employees/${userId}/workload`, 
      { maxWorkload },
      { params: { semesterId, specialityId } }
    );
    return data;
  },
  approveEmployees: async (orgUnitId, semesterId, specialityId, assignments) => {
    const { data } = await apiClient.post(`/v1/org-units/${orgUnitId}/employees/approve`, {
      semesterId,
      specialityId,
      assignments
    });
    return data;
  },
  fetchApprovedEmployees: async (orgUnitId, semesterId, specialityId = null) => {
    const { data } = await apiClient.get(`/v1/org-units/${orgUnitId}/employees/approved`, {
      params: { semesterId, specialityId }
    });
    return data;
  },
  removeEmployee: async (orgUnitId, userId, semesterId, specialityId = null) => {
    const { data } = await apiClient.delete(`/v1/org-units/${orgUnitId}/employees/${userId}`, {
      params: { semesterId, specialityId }
    });
    return data;
  },
  fetchEmployeesStatus: async (orgUnitId, semesterId, specialityId = null) => {
    const { data } = await apiClient.get(`/v1/org-units/${orgUnitId}/employees/status`, {
      params: { semesterId, specialityId }
    });
    return data;
  },
  confirmEmployees: async (orgUnitId, semesterId, specialityId = null) => {
    const { data } = await apiClient.post(`/v1/org-units/${orgUnitId}/employees/confirm`, {
      semesterId,
      specialityId
    });
    return data;
  },
  unlockEmployees: async (orgUnitId, semesterId, specialityId = null) => {
    const { data } = await apiClient.post(`/v1/org-units/${orgUnitId}/employees/unlock`, {
      semesterId,
      specialityId
    });
    return data;
  }
};
