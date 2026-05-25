import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

const CHECK_TYPES = {
  NormControl: 0,
  SoftwareCheck: 1,
  AntiPlagiarism: 2,
};

export async function fetchQualityChecks(workId) {
  const { data } = await apiClient.get(`/v1/quality-checks/by-work/${workId}`);
  return data;
}

export function useQualityChecks(workId) {
  return useQuery({
    queryKey: ['qualityChecks', workId],
    queryFn: () => fetchQualityChecks(workId),
    enabled: !!workId,
  });
}

export async function submitForCheck(workId, checkType) {
  const typeValue = CHECK_TYPES[checkType] ?? 0;
  const { data } = await apiClient.post(`/v1/quality-checks/works/${workId}/submit`, {
    checkType: typeValue,
  });
  return data;
}

export function useSubmitForCheck(workId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (checkType) => submitForCheck(workId, checkType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityChecks', workId] });
    },
  });
}

export async function fetchPendingChecks(orgUnitId, semesterId, checkType) {
  const params = { orgUnitId, semesterId };
  if (checkType != null) params.checkType = CHECK_TYPES[checkType] ?? checkType;
  const { data } = await apiClient.get('/v1/quality-checks/pending', { params });
  return data;
}

export function usePendingChecks(orgUnitId, semesterId, checkType) {
  return useQuery({
    queryKey: ['pendingChecks', orgUnitId, semesterId, checkType],
    queryFn: () => fetchPendingChecks(orgUnitId, semesterId, checkType),
    enabled: !!orgUnitId && !!semesterId,
  });
}
