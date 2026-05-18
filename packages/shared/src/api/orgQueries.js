import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orgApi, eduApi, wfApi } from './adminApi';
export const useInstitutes = (universityId = 1) => {
  return useQuery({
    queryKey: ['institutes', universityId],
    queryFn: () => orgApi.fetchInstitutes(universityId),
  });
};
export const useCreateInstitute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgApi.createInstitute,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['institutes'] }),
  });
};
export const useUpdateInstitute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => orgApi.updateInstitute(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['institutes'] }),
  });
};
export const useDeleteInstitute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgApi.deleteInstitute,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['institutes'] }),
  });
};
export const useDepartments = (universityId = 1) => {
  return useQuery({
    queryKey: ['departments', universityId],
    queryFn: () => orgApi.fetchDepartments(universityId),
  });
};
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ instituteId, ...data }) => orgApi.createDepartment(instituteId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
};
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => orgApi.updateDepartment(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
};
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgApi.deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
};
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
export const useDegreeLevels = () => {
  return useQuery({
    queryKey: ['degreeLevels'],
    queryFn: eduApi.fetchDegreeLevels,
  });
};
export const useCreateDegreeLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eduApi.createDegreeLevel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['degreeLevels'] }),
  });
};
export const useUpdateDegreeLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateDegreeLevel(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['degreeLevels'] }),
  });
};
export const useDeleteDegreeLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eduApi.deleteDegreeLevel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['degreeLevels'] }),
  });
};
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
