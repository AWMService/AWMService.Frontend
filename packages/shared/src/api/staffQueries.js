import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from './adminApi';

export const staffKeys = {
  all: ['staff'],
  byDepartment: (departmentId) => [...staffKeys.all, 'department', departmentId],
  supervisors: (departmentId) => [...staffKeys.all, 'supervisors', departmentId],
};

export const useStaffByDepartment = (departmentId) => {
  return useQuery({
    queryKey: staffKeys.byDepartment(departmentId),
    queryFn: () => staffApi.fetchStaffByDepartment(departmentId),
    enabled: !!departmentId,
  });
};

export const useSupervisors = (departmentId) => {
  return useQuery({
    queryKey: staffKeys.supervisors(departmentId),
    queryFn: () => staffApi.fetchSupervisors(departmentId),
    enabled: !!departmentId,
  });
};

export const useCreateStaff = (departmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffApi.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.byDepartment(departmentId) });
    },
  });
};

export const useUpdateStaff = (departmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => staffApi.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.byDepartment(departmentId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisors(departmentId) });
    },
  });
};

export const useUpdateStaffWorkload = (departmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, maxStudentsLoad }) => staffApi.updateWorkload(id, maxStudentsLoad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.byDepartment(departmentId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisors(departmentId) });
    },
  });
};

export const useApproveSupervisors = (departmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (staffIds) => staffApi.approveSupervisors(departmentId, staffIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.byDepartment(departmentId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.supervisors(departmentId) });
    },
  });
};
