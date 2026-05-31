import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

export const CHECK_TYPES = {
  NormControl: 1,
  AntiPlagiarism: 2,
  SoftwareCheck: 3,
};

export async function fetchQualityChecks(workId) {
  const { data } = await apiClient.get(`/v1/quality-checks/by-work/${workId}`);
  // Alias checkTypeName → checkType for consistent filtering in consumers (e.g. ReviewStepPage)
  return data.map(c => ({ ...c, checkType: c.checkTypeName }));
}

export function useQualityChecks(workId) {
  return useQuery({
    queryKey: ['qualityChecks', workId],
    queryFn: () => fetchQualityChecks(workId),
    enabled: !!workId,
  });
}

export async function submitForCheck(workId, checkType) {
  const typeId = typeof checkType === 'number' ? checkType : (CHECK_TYPES[checkType] ?? 1);
  const { data } = await apiClient.post(`/v1/quality-checks/works/${workId}/submit`, {
    checkTypeId: typeId,
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
  if (checkType != null) {
    params.checkTypeId = typeof checkType === 'number' ? checkType : (CHECK_TYPES[checkType] ?? checkType);
  }
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

// Fetch all checks for expert (pending + approved + revision) — stable across page reloads
export async function fetchAllExpertChecks(orgUnitId, semesterId, checkType) {
  const params = { orgUnitId, semesterId, includeCompleted: true };
  if (checkType != null) {
    params.checkTypeId = typeof checkType === 'number' ? checkType : (CHECK_TYPES[checkType] ?? checkType);
  }
  const { data } = await apiClient.get('/v1/quality-checks/pending', { params });
  return data;
}

export function useAllExpertChecks(orgUnitId, semesterId, checkType) {
  return useQuery({
    queryKey: ['allExpertChecks', orgUnitId, semesterId, checkType],
    queryFn: () => fetchAllExpertChecks(orgUnitId, semesterId, checkType),
    enabled: !!orgUnitId && !!semesterId,
  });
}

// Complete quality check (expert decision)
export async function completeQualityCheck(workId, checkId, checkData) {
  const { data } = await apiClient.post(`/v1/quality-checks/works/${workId}/${checkId}/complete`, checkData);
  return data;
}

export function useCompleteQualityCheck(workId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ checkId, checkData }) => completeQualityCheck(workId, checkId, checkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityChecks', workId] });
      queryClient.invalidateQueries({ queryKey: ['pendingChecks'] });
      queryClient.invalidateQueries({ queryKey: ['allExpertChecks'] });
    },
  });
}

// Generic version — workId passed per-call, for list pages where each item has its own workId
export function useCompleteQualityCheckMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workId, checkId, checkData }) => completeQualityCheck(workId, checkId, checkData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['qualityChecks', variables.workId] });
      queryClient.invalidateQueries({ queryKey: ['pendingChecks'] });
      queryClient.invalidateQueries({ queryKey: ['allExpertChecks'] });
    },
  });
}

// Fetch Check Configurations for a department
export async function fetchCheckConfigurations(orgUnitId) {
  const { data } = await apiClient.get('/v1/quality-checks/configurations', {
    params: { orgUnitId },
  });
  return data;
}

export function useCheckConfigurations(orgUnitId) {
  return useQuery({
    queryKey: ['checkConfigurations', orgUnitId],
    queryFn: () => fetchCheckConfigurations(orgUnitId),
    enabled: !!orgUnitId,
  });
}

// Save Check Configuration
export async function saveCheckConfiguration(configData) {
  const { data } = await apiClient.post('/v1/quality-checks/configurations', configData);
  return data;
}

export function useSaveCheckConfiguration(orgUnitId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveCheckConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkConfigurations', orgUnitId] });
    },
  });
}

// Delete Check Configuration
export async function deleteCheckConfiguration(id) {
  const { data } = await apiClient.delete(`/v1/quality-checks/configurations/${id}`);
  return data;
}

export function useDeleteCheckConfiguration(orgUnitId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCheckConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkConfigurations', orgUnitId] });
    },
  });
}

// Fetch active check configurations for a student's org unit and speciality
// Returns only IsActive=true records. Empty array → no rules configured → caller should show all steps.
export async function fetchActiveCheckConfigurations(orgUnitId, specialityId) {
  const params = { orgUnitId };
  if (specialityId != null) params.specialityId = specialityId;
  const { data } = await apiClient.get('/v1/quality-checks/configurations/active', { params });
  return data;
}

export function useActiveCheckConfigurations(orgUnitId, specialityId) {
  return useQuery({
    queryKey: ['activeCheckConfigurations', orgUnitId, specialityId ?? null],
    queryFn: () => fetchActiveCheckConfigurations(orgUnitId, specialityId),
    enabled: !!orgUnitId,
  });
}

// Fetch Assigned Experts for a department
export async function fetchAssignedExperts(orgUnitId) {
  const { data } = await apiClient.get('/v1/quality-checks/experts', {
    params: { orgUnitId },
  });
  return data;
}

export function useAssignedExperts(orgUnitId) {
  return useQuery({
    queryKey: ['assignedExperts', orgUnitId],
    queryFn: () => fetchAssignedExperts(orgUnitId),
    enabled: !!orgUnitId,
  });
}

// Save Expert Assignments
export async function saveExpertAssignments(assignmentData) {
  const { data } = await apiClient.post('/v1/quality-checks/experts', assignmentData);
  return data;
}

export function useSaveExpertAssignments(orgUnitId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveExpertAssignments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignedExperts', orgUnitId] });
    },
  });
}

