import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

export const periodApi = {
  fetchPeriods: async (departmentId, academicYearId) => {
    const { data } = await apiClient.get(`/departments/${departmentId}/Periods`, {
      params: { academicYearId }
    });
    return data;
  },
  fetchActivePeriod: async (departmentId, academicYearId, stage) => {
    const { data } = await apiClient.get(`/departments/${departmentId}/Periods/active`, {
      params: { academicYearId, stage }
    });
    return data;
  },
  createPeriod: async (departmentId, periodData) => {
    const { data } = await apiClient.post(`/departments/${departmentId}/Periods`, periodData);
    return data;
  },
  updatePeriod: async (departmentId, periodId, periodData) => {
    const { data } = await apiClient.put(`/departments/${departmentId}/Periods/${periodId}`, periodData);
    return data;
  },
  approveInitialPeriods: async (departmentId, academicYearId, periods) => {
    const { data } = await apiClient.post(`/departments/${departmentId}/Periods/approve-initial`, { periods }, {
      params: { academicYearId }
    });
    return data;
  },
  approveDefensePeriods: async (departmentId, academicYearId, periods) => {
    const { data } = await apiClient.post(`/departments/${departmentId}/Periods/approve-defense`, { periods }, {
      params: { academicYearId }
    });
    return data;
  }
};

export const periodKeys = {
  all: ['periods'],
  byDepartment: (departmentId, academicYearId) => [...periodKeys.all, 'department', departmentId, academicYearId],
  active: (departmentId, academicYearId, stage) => [...periodKeys.all, 'active', departmentId, academicYearId, stage]
};

export const usePeriods = (departmentId, academicYearId) => {
  return useQuery({
    queryKey: periodKeys.byDepartment(departmentId, academicYearId),
    queryFn: () => periodApi.fetchPeriods(departmentId, academicYearId),
    enabled: !!departmentId && !!academicYearId,
  });
};

export const useActivePeriod = (departmentId, academicYearId, stage) => {
  return useQuery({
    queryKey: periodKeys.active(departmentId, academicYearId, stage),
    queryFn: () => periodApi.fetchActivePeriod(departmentId, academicYearId, stage),
    enabled: !!departmentId && !!academicYearId && !!stage,
  });
};

export const useApproveInitialPeriods = (departmentId, academicYearId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periods) => periodApi.approveInitialPeriods(departmentId, academicYearId, periods),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.byDepartment(departmentId, academicYearId) });
    },
  });
};

export const useApproveDefensePeriods = (departmentId, academicYearId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periods) => periodApi.approveDefensePeriods(departmentId, academicYearId, periods),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.byDepartment(departmentId, academicYearId) });
    },
  });
};
