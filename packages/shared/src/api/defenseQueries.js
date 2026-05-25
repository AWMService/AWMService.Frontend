import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

// ================= Pre-Defense =================

export async function fetchPreDefenseSchedule(commissionId) {
  const { data } = await apiClient.get('/v1/pre-defense/schedule', {
    params: { commissionId },
  });
  return data;
}

export function usePreDefenseSchedule(commissionId) {
  return useQuery({
    queryKey: ['preDefense', 'schedule', commissionId],
    queryFn: () => fetchPreDefenseSchedule(commissionId),
    enabled: !!commissionId,
  });
}

export async function fetchPreDefenseAttempts(workId) {
  const { data } = await apiClient.get(`/v1/pre-defense/works/${workId}/attempts`);
  return data;
}

export function usePreDefenseAttempts(workId) {
  return useQuery({
    queryKey: ['preDefense', 'attempts', workId],
    queryFn: () => fetchPreDefenseAttempts(workId),
    enabled: !!workId,
  });
}

export async function fetchFailedPreDefenseStudents(orgUnitId, semesterId, preDefenseNumber = null) {
  const params = { orgUnitId, semesterId };
  if (preDefenseNumber != null) params.preDefenseNumber = preDefenseNumber;
  const { data } = await apiClient.get('/v1/pre-defense/failed-students', { params });
  return data;
}

export function useFailedPreDefenseStudents(orgUnitId, semesterId, preDefenseNumber) {
  return useQuery({
    queryKey: ['preDefense', 'failed', orgUnitId, semesterId, preDefenseNumber],
    queryFn: () => fetchFailedPreDefenseStudents(orgUnitId, semesterId, preDefenseNumber),
    enabled: !!orgUnitId && !!semesterId,
  });
}

export async function schedulePreDefense(workId, scheduleData) {
  const { data } = await apiClient.post(`/v1/pre-defense/works/${workId}/schedule`, scheduleData);
  return data;
}

export function useSchedulePreDefense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workId, ...scheduleData }) => schedulePreDefense(workId, scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
    },
  });
}

export async function recordAttendance(attemptId, attendanceData) {
  await apiClient.put(`/v1/pre-defense/attempts/${attemptId}/attendance`, attendanceData);
}

export function useRecordAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, ...attendanceData }) => recordAttendance(attemptId, attendanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
    },
  });
}

export async function submitPreDefenseGrade(scheduleId, gradeData) {
  const { data } = await apiClient.post(`/v1/pre-defense/schedule/${scheduleId}/grades`, gradeData);
  return data;
}

export function useSubmitPreDefenseGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, ...gradeData }) => submitPreDefenseGrade(scheduleId, gradeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
    },
  });
}

export async function finalizePreDefenseAttempt(attemptId, finalizeData) {
  await apiClient.put(`/v1/pre-defense/attempts/${attemptId}/finalize`, finalizeData);
}

export function useFinalizePreDefenseAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, ...finalizeData }) => finalizePreDefenseAttempt(attemptId, finalizeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
    },
  });
}

export async function startPreDefenseReconciliation(scheduleId) {
  await apiClient.put(`/v1/pre-defense/schedule/${scheduleId}/start-reconciliation`);
}

export function useStartPreDefenseReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startPreDefenseReconciliation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
    },
  });
}

export async function distributePreDefenseStudents(distributeData) {
  const { data } = await apiClient.post('/v1/pre-defense/distribute', distributeData);
  return data;
}

export function useDistributePreDefenseStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: distributePreDefenseStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
    },
  });
}

export async function generatePreDefenseSlots(generateData) {
  const { data } = await apiClient.post('/v1/pre-defense/generate-slots', generateData);
  return data;
}

export function useGeneratePreDefenseSlots() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generatePreDefenseSlots,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
    },
  });
}

export async function generatePreDefenseProtocol(protocolData) {
  const { data } = await apiClient.post('/v1/pre-defense/protocols', protocolData);
  return data;
}

export function useGeneratePreDefenseProtocol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generatePreDefenseProtocol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
    },
  });
}

// ================= Final Defense Schedule =================

export async function fetchDefenseSchedule(commissionId) {
  const { data } = await apiClient.get('/v1/defense-schedule', {
    params: { commissionId },
  });
  return data;
}

export function useDefenseSchedule(commissionId) {
  return useQuery({
    queryKey: ['defenseSchedule', commissionId],
    queryFn: () => fetchDefenseSchedule(commissionId),
    enabled: !!commissionId,
  });
}

export async function fetchDefenseSlot(slotId) {
  const { data } = await apiClient.get(`/v1/defense-schedule/${slotId}`);
  return data;
}

export function useDefenseSlot(slotId) {
  return useQuery({
    queryKey: ['defenseSchedule', 'slot', slotId],
    queryFn: () => fetchDefenseSlot(slotId),
    enabled: !!slotId,
  });
}

export async function createDefenseSlot(slotData) {
  const { data } = await apiClient.post('/v1/defense-schedule', slotData);
  return data;
}

export function useCreateDefenseSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDefenseSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export async function updateDefenseSlot(scheduleId, slotData) {
  await apiClient.put(`/v1/defense-schedule/${scheduleId}`, slotData);
}

export function useUpdateDefenseSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, ...slotData }) => updateDefenseSlot(scheduleId, slotData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export async function assignWorkToSlot(scheduleId, assignmentData) {
  await apiClient.post(`/v1/defense-schedule/${scheduleId}/assign`, assignmentData);
}

export function useAssignWorkToSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, ...assignmentData }) => assignWorkToSlot(scheduleId, assignmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export async function generateDefenseSlots(generateData) {
  const { data } = await apiClient.post('/v1/defense-schedule/generate-slots', generateData);
  return data;
}

export function useGenerateDefenseSlots() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateDefenseSlots,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export async function startDefenseReconciliation(scheduleId) {
  await apiClient.put(`/v1/defense-schedule/${scheduleId}/start-reconciliation`);
}

export function useStartDefenseReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startDefenseReconciliation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

// ================= Evaluation =================

export async function fetchEvaluationCriteria(workTypeId, orgUnitId = null) {
  const params = { workTypeId };
  if (orgUnitId != null) params.orgUnitId = orgUnitId;
  const { data } = await apiClient.get('/v1/evaluation/criteria', { params });
  return data;
}

export function useEvaluationCriteria(workTypeId, orgUnitId) {
  return useQuery({
    queryKey: ['evaluation', 'criteria', workTypeId, orgUnitId],
    queryFn: () => fetchEvaluationCriteria(workTypeId, orgUnitId),
    enabled: !!workTypeId,
  });
}

export async function fetchGradesBySchedule(scheduleId) {
  const { data } = await apiClient.get(`/v1/evaluation/schedule/${scheduleId}/grades`);
  return data;
}

export function useGradesBySchedule(scheduleId) {
  return useQuery({
    queryKey: ['evaluation', 'grades', scheduleId],
    queryFn: () => fetchGradesBySchedule(scheduleId),
    enabled: !!scheduleId,
  });
}

export async function submitGrade(scheduleId, gradeData) {
  const { data } = await apiClient.post(`/v1/evaluation/schedule/${scheduleId}/grades`, gradeData);
  return data;
}

export function useSubmitGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, ...gradeData }) => submitGrade(scheduleId, gradeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation'] });
    },
  });
}

export async function finalizeDefense(scheduleId) {
  await apiClient.put(`/v1/evaluation/schedule/${scheduleId}/finalize`);
}

export function useFinalizeDefense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: finalizeDefense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation'] });
    },
  });
}

// ================= Protocols =================

export async function fetchProtocol(protocolId) {
  const { data } = await apiClient.get(`/v1/protocols/${protocolId}`);
  return data;
}

export function useProtocol(protocolId) {
  return useQuery({
    queryKey: ['protocols', protocolId],
    queryFn: () => fetchProtocol(protocolId),
    enabled: !!protocolId,
  });
}

export async function generateProtocol(protocolData) {
  const { data } = await apiClient.post('/v1/protocols', protocolData);
  return data;
}

export function useGenerateProtocol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateProtocol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
    },
  });
}
