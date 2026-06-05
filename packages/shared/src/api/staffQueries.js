import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from './adminApi';

export const staffKeys = {
  all: ['staff'],
  byOrgUnit: (orgUnitId) => [...staffKeys.all, 'orgUnit', orgUnitId],
  employees: (orgUnitId, semesterId, specialityId) => [...staffKeys.all, 'employees', orgUnitId, semesterId, specialityId],
  employeesStatus: (orgUnitId, semesterId, specialityId) => [...staffKeys.all, 'employeesStatus', orgUnitId, semesterId, specialityId],
};

export const useOrgUnitEmployees = (orgUnitId) => {
  return useQuery({
    queryKey: staffKeys.byOrgUnit(orgUnitId),
    queryFn: () => staffApi.fetchOrgUnitEmployees(orgUnitId),
    enabled: !!orgUnitId,
  });
};

export const useApprovedEmployees = (orgUnitId, semesterId, specialityId = null) => {
  return useQuery({
    queryKey: staffKeys.employees(orgUnitId, semesterId, specialityId),
    queryFn: () => staffApi.fetchApprovedEmployees(orgUnitId, semesterId, specialityId),
    enabled: !!orgUnitId && !!semesterId,
  });
};

export const useCreateStaff = (orgUnitId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffApi.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.byOrgUnit(orgUnitId) });
    },
  });
};

export const useUpdateStaff = (orgUnitId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => staffApi.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.byOrgUnit(orgUnitId) });
    },
  });
};

export const useUpdateEmployeeWorkload = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, maxWorkload }) => staffApi.updateWorkload(orgUnitId, userId, semesterId, specialityId, maxWorkload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.employees(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useApproveEmployees = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignments) => staffApi.approveEmployees(orgUnitId, semesterId, specialityId, assignments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.employees(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useRemoveEmployee = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => staffApi.removeEmployee(orgUnitId, userId, semesterId, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.employees(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useEmployeesStatus = (orgUnitId, semesterId, specialityId = null) => {
  return useQuery({
    queryKey: staffKeys.employeesStatus(orgUnitId, semesterId, specialityId),
    queryFn: () => staffApi.fetchEmployeesStatus(orgUnitId, semesterId, specialityId),
    enabled: !!orgUnitId && !!semesterId,
  });
};

export const useConfirmEmployees = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => staffApi.confirmEmployees(orgUnitId, semesterId, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.employeesStatus(orgUnitId, semesterId, specialityId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.employees(orgUnitId, semesterId, specialityId) });
    },
  });
};

export const useUnlockEmployees = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => staffApi.unlockEmployees(orgUnitId, semesterId, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.employeesStatus(orgUnitId, semesterId, specialityId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.employees(orgUnitId, semesterId, specialityId) });
    },
  });
};
