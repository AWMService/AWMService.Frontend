import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

export const workKeys = {
  all: ['works'],
  myProgress: () => [...workKeys.all, 'my-progress'],
  mySupervised: () => [...workKeys.all, 'my-supervised'],
  defenseStep: () => [...workKeys.all, 'defense-step'],
  readiness: (orgUnitId, semesterId, specialityId) => [...workKeys.all, 'readiness', orgUnitId, semesterId, specialityId],
};

export const fetchMyWorkProgress = async () => {
  const { data } = await apiClient.get('/v1/works/my-progress');
  return data;
};

export const useMyWorkProgress = (options = {}) => {
  return useQuery({
    queryKey: workKeys.myProgress(),
    queryFn: fetchMyWorkProgress,
    ...options,
  });
};

export const fetchMySupervisedWorks = async () => {
  const { data } = await apiClient.get('/v1/works/my-supervised');
  return data;
};

export const useMySupervisedWorks = (options = {}) => {
  return useQuery({
    queryKey: workKeys.mySupervised(),
    queryFn: fetchMySupervisedWorks,
    ...options,
  });
};

export const fetchWorkHistory = async (workId) => {
  const { data } = await apiClient.get(`/v1/works/${workId}/history`);
  return data;
};

export const useWorkHistory = (workId, options = {}) => {
  return useQuery({
    queryKey: [...workKeys.all, 'history', workId],
    queryFn: () => fetchWorkHistory(workId),
    enabled: !!workId && workId > 0,
    ...options,
  });
};

export const fetchStudentDefenseStep = async () => {
  const { data } = await apiClient.get('/v1/schedules/my-defense-step');
  return data;
};

export const useStudentDefenseStep = (options = {}) => {
  return useQuery({
    queryKey: workKeys.defenseStep(),
    queryFn: fetchStudentDefenseStep,
    ...options,
  });
};

export const fetchDefenseReadiness = async ({ orgUnitId, semesterId, specialityId }) => {
  const { data } = await apiClient.get('/v1/works/defense-readiness', {
    params: { orgUnitId, semesterId, specialityId }
  });
  return data;
};

export const useDefenseReadiness = (params, options = {}) => {
  return useQuery({
    queryKey: workKeys.readiness(params.orgUnitId, params.semesterId, params.specialityId),
    queryFn: () => fetchDefenseReadiness(params),
    enabled: !!params.orgUnitId && !!params.semesterId,
    ...options,
  });
};

export const useAdmitToDefense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workId) => {
      await apiClient.post(`/v1/works/${workId}/admit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workKeys.all });
    }
  });
};

/**
 * Saves the GitHub/GitLab repo URL for a software check submission.
 * Stores it in StudentWork.MetadataJson under key "softwareCheckRepoUrl".
 */
export const useSaveRepoUrl = (workId) => {
  return useMutation({
    mutationFn: async (repoUrl) => {
      await apiClient.put(`/v1/works/${workId}/repo-url`, { repoUrl });
    },
  });
};

export const useGraduateWorks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workIds) => {
      await apiClient.post('/v1/works/graduate', { workIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workKeys.all });
    }
  });
};
