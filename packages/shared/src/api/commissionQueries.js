import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';
export const commissionApi = {
  fetchCommissions: async (orgUnitId, semesterId, specialityId = null) => {
    const params = { orgUnitId, semesterId };
    if (specialityId) params.specialityId = specialityId;

    const { data } = await apiClient.get('/v1/commissions', { params });
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
  deleteCommission: async (commissionId) => {
    const { data } = await apiClient.delete(`/v1/commissions/${commissionId}`);
    return data;
  },
  autoDistributeStudents: async (distributionData) => {
    const { data } = await apiClient.post('/v1/commissions/auto-distribute', distributionData);
    return data;
  }
};
export const commissionKeys = {
  all: ['commissions'],
  byDepartment: (orgUnitId, semesterId, specialityId = null) =>
    [...commissionKeys.all, 'department', orgUnitId, semesterId, specialityId],
  detail: (commissionId) => [...commissionKeys.all, 'detail', commissionId]
};

export const useCommissions = (orgUnitId, semesterId, specialityId = null) => {
  return useQuery({
    queryKey: commissionKeys.byDepartment(orgUnitId, semesterId, specialityId),
    queryFn: () => commissionApi.fetchCommissions(orgUnitId, semesterId, specialityId),
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

export const useCreateCommission = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commissionApi.createCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.byDepartment(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useUpdateCommission = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => commissionApi.updateCommission(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.byDepartment(orgUnitId, semesterId, specialityId) });
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(variables.id) });
    },
  });
};

export const useDeleteCommission = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => commissionApi.deleteCommission(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.byDepartment(orgUnitId, semesterId, specialityId) });
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(id) });
    },
  });
};

export const useAutoDistributeStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commissionApi.autoDistributeStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
};
