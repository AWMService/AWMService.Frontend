import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from './adminApi';

export const staffKeys = {
  all: ['staff'],
  byDepartment: (orgUnitId) => [...staffKeys.all, 'department', orgUnitId],
  supervisors: (orgUnitId, semesterId, specialityId) => [...staffKeys.all, 'supervisors', orgUnitId, semesterId, specialityId],
  supervisorsStatus: (orgUnitId, semesterId, specialityId) => [...staffKeys.all, 'supervisorsStatus', orgUnitId, semesterId, specialityId],
};

export const useStaffByDepartment = (orgUnitId) => {
  return useQuery({
    queryKey: staffKeys.byDepartment(orgUnitId),
    queryFn: () => staffApi.fetchStaffByDepartment(orgUnitId),
    enabled: !!orgUnitId,
  });
};

export const useSupervisors = (orgUnitId, semesterId, specialityId = null) => {
  return useQuery({
    queryKey: staffKeys.supervisors(orgUnitId, semesterId, specialityId),
    queryFn: () => staffApi.fetchSupervisors(orgUnitId, semesterId, specialityId),
    enabled: !!orgUnitId && !!semesterId,
  });
};

export const useCreateStaff = (orgUnitId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffApi.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.byDepartment(orgUnitId) });
    },
  });
};

export const useUpdateStaff = (orgUnitId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => staffApi.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.byDepartment(orgUnitId) });
    },
  });
};

export const useUpdateStaffWorkload = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, maxWorkload }) => staffApi.updateWorkload(orgUnitId, userId, semesterId, specialityId, maxWorkload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisors(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useApproveSupervisors = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignments) => staffApi.approveSupervisors(orgUnitId, semesterId, specialityId, assignments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisors(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useRemoveSupervisor = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => staffApi.removeSupervisor(orgUnitId, userId, semesterId, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisors(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useSupervisorsStatus = (orgUnitId, semesterId, specialityId = null) => {
  return useQuery({
    queryKey: staffKeys.supervisorsStatus(orgUnitId, semesterId, specialityId),
    queryFn: () => staffApi.fetchSupervisorsStatus(orgUnitId, semesterId, specialityId),
    enabled: !!orgUnitId && !!semesterId,
  });
};

export const useConfirmSupervisors = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => staffApi.confirmSupervisors(orgUnitId, semesterId, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisorsStatus(orgUnitId, semesterId, specialityId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisors(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useUnlockSupervisors = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => staffApi.unlockSupervisors(orgUnitId, semesterId, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisorsStatus(orgUnitId, semesterId, specialityId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisors(orgUnitId, semesterId, specialityId) });
    },
  });
};

