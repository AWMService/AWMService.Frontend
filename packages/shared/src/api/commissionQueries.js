import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

export const commissionApi = {
  fetchCommissions: async (departmentId, academicYearId) => {
    const { data } = await apiClient.get('/commissions', {
      params: { departmentId, academicYearId }
    });
    return data;
  },
  fetchCommissionById: async (commissionId) => {
    const { data } = await apiClient.get(`/commissions/${commissionId}`);
    return data;
  },
  createCommission: async (commissionData) => {
    const { data } = await apiClient.post('/commissions', commissionData);
    return data;
  },
  updateCommission: async (commissionId, commissionData) => {
    const { data } = await apiClient.put(`/commissions/${commissionId}`, commissionData);
    return data;
  },
  addMember: async (commissionId, memberData) => {
    const { data } = await apiClient.post(`/commissions/${commissionId}/members`, memberData);
    return data;
  },
  removeMember: async (commissionId, memberId) => {
    const { data } = await apiClient.delete(`/commissions/${commissionId}/members/${memberId}`);
    return data;
  },
  deleteCommission: async (commissionId) => {
    const { data } = await apiClient.delete(`/commissions/${commissionId}`);
    return data;
  }
};

export const commissionKeys = {
  all: ['commissions'],
  byDepartment: (departmentId, academicYearId) => [...commissionKeys.all, 'department', departmentId, academicYearId],
  detail: (commissionId) => [...commissionKeys.all, 'detail', commissionId]
};

export const useCommissions = (departmentId, academicYearId) => {
  return useQuery({
    queryKey: commissionKeys.byDepartment(departmentId, academicYearId),
    queryFn: () => commissionApi.fetchCommissions(departmentId, academicYearId),
    enabled: !!departmentId && !!academicYearId,
  });
};

export const useCommissionDetail = (commissionId) => {
  return useQuery({
    queryKey: commissionKeys.detail(commissionId),
    queryFn: () => commissionApi.fetchCommissionById(commissionId),
    enabled: !!commissionId,
  });
};

export const useCreateCommission = (departmentId, academicYearId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commissionApi.createCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.byDepartment(departmentId, academicYearId) });
    },
  });
};

export const useUpdateCommission = (departmentId, academicYearId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => commissionApi.updateCommission(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.byDepartment(departmentId, academicYearId) });
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(variables.id) });
    },
  });
};

export const useAddCommissionMember = (commissionId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberData) => commissionApi.addMember(commissionId, memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(commissionId) });
    },
  });
};

export const useRemoveCommissionMember = (commissionId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId) => commissionApi.removeMember(commissionId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(commissionId) });
    },
  });
};
