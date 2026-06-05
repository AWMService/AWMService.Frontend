import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orgApi, eduApi, wfApi } from './adminApi';

// Org Units
export const useOrgUnits = (typeId) => {
  return useQuery({
    queryKey: ['orgUnits', typeId],
    queryFn: () => orgApi.fetchOrgUnits(typeId),
  });
};

export const useCreateOrgUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgApi.createOrgUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orgUnits'] }),
  });
};

export const useUpdateOrgUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => orgApi.updateOrgUnit(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orgUnits'] }),
  });
};

export const useDeleteOrgUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgApi.deleteOrgUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orgUnits'] }),
  });
};

// Programs
export const usePrograms = () => {
  return useQuery({
    queryKey: ['programs'],
    queryFn: eduApi.fetchPrograms,
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eduApi.createProgram,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] }),
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => eduApi.updateProgram(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] }),
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eduApi.deleteProgram,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] }),
  });
};

// Speciality Levels
export const useSpecialityLevels = () => {
  return useQuery({
    queryKey: ['specialityLevels'],
    queryFn: eduApi.fetchSpecialityLevels,
  });
};

export const useCreateSpecialityLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eduApi.createSpecialityLevel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specialityLevels'] }),
  });
};

export const useUpdateSpecialityLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => eduApi.updateSpecialityLevel(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specialityLevels'] }),
  });
};

export const useDeleteSpecialityLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eduApi.deleteSpecialityLevel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specialityLevels'] }),
  });
};

// Work Types
export const useWorkTypes = () => {
  return useQuery({
    queryKey: ['workTypes'],
    queryFn: wfApi.fetchWorkTypes,
  });
};

export const useCreateWorkType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wfApi.createWorkType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workTypes'] }),
  });
};

export const useUpdateWorkType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => wfApi.updateWorkType(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workTypes'] }),
  });
};

export const useDeleteWorkType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wfApi.deleteWorkType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workTypes'] }),
  });
};
