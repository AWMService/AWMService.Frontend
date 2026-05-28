import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

// ================= Evaluation Criteria =================

export const evaluationApi = {
  fetchCriteria: async (workTypeId, orgUnitId = null, specialityId = null) => {
    const params = { workTypeId };
    if (orgUnitId) params.orgUnitId = orgUnitId;
    if (specialityId) params.specialityId = specialityId;
    
    const { data } = await apiClient.get('/v1/evaluation-criteria', { params });
    return data;
  },
  createCriteria: async (criteriaData) => {
    const { data } = await apiClient.post('/v1/evaluation-criteria', criteriaData);
    return data;
  },
  updateCriteria: async (id, criteriaData) => {
    const { data } = await apiClient.put(`/v1/evaluation-criteria/${id}`, criteriaData);
    return data;
  },
  deleteCriteria: async (id) => {
    const { data } = await apiClient.delete(`/v1/evaluation-criteria/${id}`);
    return data;
  }
};

export function useEvaluationCriteria(workTypeId, orgUnitId = null, specialityId = null) {
  return useQuery({
    queryKey: ['evaluation', 'criteria', workTypeId, orgUnitId, specialityId],
    queryFn: () => evaluationApi.fetchCriteria(workTypeId, orgUnitId, specialityId),
    enabled: !!workTypeId,
  });
}

export function useCreateEvaluationCriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: evaluationApi.createCriteria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation', 'criteria'] });
    },
  });
}

// ================= Schedules & Grading =================

export const scheduleApi = {
  fetchGrades: async (scheduleId) => {
    const { data } = await apiClient.get(`/v1/schedules/${scheduleId}/grades`);
    return data;
  },
  addGrade: async (scheduleId, gradeData) => {
    const { data } = await apiClient.post(`/v1/schedules/${scheduleId}/grades`, gradeData);
    return data;
  },
  startReconciliation: async (scheduleId) => {
    const { data } = await apiClient.post(`/v1/schedules/${scheduleId}/start-reconciliation`);
    return data;
  },
  generateSchedule: async (generateData) => {
    // generateData includes: CommissionId, StartDate, Location, SlotDurationMinutes, WorkIds
    const { data } = await apiClient.post('/v1/schedules/generate', generateData);
    return data;
  }
};

export function useGenerateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (generateData) => scheduleApi.generateSchedule(generateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export function useGradesBySchedule(scheduleId) {
  return useQuery({
    queryKey: ['evaluation', 'grades', scheduleId],
    queryFn: () => scheduleApi.fetchGrades(scheduleId),
    enabled: !!scheduleId,
  });
}

export function useSubmitGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, ...gradeData }) => scheduleApi.addGrade(scheduleId, gradeData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evaluation', 'grades', variables.scheduleId] });
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export function useStartReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId) => scheduleApi.startReconciliation(scheduleId),
    onSuccess: (_, scheduleId) => {
      queryClient.invalidateQueries({ queryKey: ['evaluation', 'grades', scheduleId] });
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

// ================= Protocols =================

export const protocolApi = {
  createProtocol: async (protocolData) => {
    const { data } = await apiClient.post('/v1/protocols', protocolData);
    return data;
  },
  finalizeProtocol: async (id, isStudentPresent = true) => {
    const { data } = await apiClient.post(`/v1/protocols/${id}/finalize`, { isStudentPresent });
    return data;
  },
  fetchProtocol: async (id) => {
    const { data } = await apiClient.get(`/v1/protocols/${id}`);
    return data;
  },
  downloadProtocolPdf: async (protocolId) => {
    const response = await apiClient.get(`/v1/protocols/${protocolId}/pdf`, { responseType: 'blob' });
    return response.data;
  }
};

export function useGenerateProtocol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: protocolApi.createProtocol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
    },
  });
}

export function useFinalizeProtocol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isStudentPresent = true }) => protocolApi.finalizeProtocol(id, isStudentPresent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export function useProtocolDetail(protocolId) {
  return useQuery({
    queryKey: ['protocols', 'detail', protocolId],
    queryFn: () => protocolApi.fetchProtocol(protocolId),
    enabled: !!protocolId,
  });
}

export function useDownloadProtocolPdf() {
  return useMutation({
    mutationFn: (id) => protocolApi.downloadProtocolPdf(id),
    onSuccess: (data, id) => {
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `protocol_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  });
}

// ================= Legacy / Compatibility =================
// Keep these for now if they are used elsewhere, but point them to new unified logic where possible

export const useSubmitPreDefenseGrade = useSubmitGrade;
export const useStartPreDefenseReconciliation = useStartReconciliation;
export const useStartDefenseReconciliation = useStartReconciliation;
export const useGeneratePreDefenseProtocol = useGenerateProtocol;
export const usePreDefenseGradesBySchedule = useGradesBySchedule;

export async function fetchPreDefenseSchedule(commissionId) {
  const { data } = await apiClient.get('/v1/schedules', {
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

export const useDefenseSchedule = usePreDefenseSchedule;
export const useProtocol = useProtocolDetail;


