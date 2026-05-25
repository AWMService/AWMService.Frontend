import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

export const commissionApi = {
  fetchCommissions: async (orgUnitId, semesterId) => {
    const { data } = await apiClient.get('/v1/commissions', {
      params: { orgUnitId, semesterId }
    });
    return data;
  },
  fetchCommissionById: async (commissionId) => {
    const { data } = await apiClient.get(`/v1/commissions/${commissionId}`);
    return data;
  },
  createCommission: async (commissionData) => {
    const { data } = await apiClient.post('/v1/commissions', commissionData);
    return data;
  },
  updateCommission: async (commissionId, commissionData) => {
    const { data } = await apiClient.put(`/v1/commissions/${commissionId}`, commissionData);
    return data;
  },
  addMember: async (commissionId, memberData) => {
    const { data } = await apiClient.post(`/v1/commissions/${commissionId}/members`, memberData);
    return data;
  },
  removeMember: async (commissionId, memberId) => {
    const { data } = await apiClient.delete(`/v1/commissions/${commissionId}/members/${memberId}`);
    return data;
  },
  deleteCommission: async (commissionId) => {
    const { data } = await apiClient.delete(`/v1/commissions/${commissionId}`);
    return data;
  }
};

export const commissionKeys = {
  all: ['commissions'],
  byDepartment: (orgUnitId, semesterId) => [...commissionKeys.all, 'department', orgUnitId, semesterId],
  detail: (commissionId) => [...commissionKeys.all, 'detail', commissionId]
};

export const useCommissions = (orgUnitId, semesterId) => {
  return useQuery({
    queryKey: commissionKeys.byDepartment(orgUnitId, semesterId),
    queryFn: () => commissionApi.fetchCommissions(orgUnitId, semesterId),
    enabled: !!orgUnitId && !!semesterId,
  });
};

export const useCommissionDetail = (commissionId) => {
  return useQuery({
    queryKey: commissionKeys.detail(commissionId),
    queryFn: () => commissionApi.fetchCommissionById(commissionId),
    enabled: !!commissionId,
  });
};

export const useCreateCommission = (orgUnitId, semesterId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commissionApi.createCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.byDepartment(orgUnitId, semesterId) });
    },
  });
};

export const useUpdateCommission = (orgUnitId, semesterId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => commissionApi.updateCommission(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.byDepartment(orgUnitId, semesterId) });
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
