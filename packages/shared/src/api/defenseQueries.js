import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';



export const evaluationApi = {
  fetchCriteria: async (workTypeId, orgUnitId = null, specialityId = null, defenseStageType = null) => {
    const params = { workTypeId };
    if (orgUnitId) params.orgUnitId = orgUnitId;
    if (specialityId) params.specialityId = specialityId;
    if (defenseStageType) params.defenseStageType = defenseStageType;

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

export function useEvaluationCriteria(workTypeId, orgUnitId = null, specialityId = null, defenseStageType = null) {
  return useQuery({
    queryKey: ['evaluation', 'criteria', workTypeId, orgUnitId, specialityId, defenseStageType],
    queryFn: () => evaluationApi.fetchCriteria(workTypeId, orgUnitId, specialityId, defenseStageType),
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



export const scheduleApi = {
  fetchScheduleByWork: async (workId) => {
    const { data } = await apiClient.get(`/v1/schedules/by-work/${workId}`);
    return data;
  },
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

    const { data } = await apiClient.post('/v1/schedules/generate', generateData);
    return data;
  },
  updateSchedule: async (id, scheduleData) => {
    const { data } = await apiClient.put(`/v1/schedules/${id}`, scheduleData);
    return data;
  },
  deleteSchedule: async (id) => {
    const { data } = await apiClient.delete(`/v1/schedules/${id}`);
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

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => scheduleApi.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => scheduleApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preDefense'] });
      queryClient.invalidateQueries({ queryKey: ['defenseSchedule'] });
    },
  });
}

export function useScheduleByWork(workId) {
  return useQuery({
    queryKey: ['schedule', 'byWork', workId],
    queryFn: () => scheduleApi.fetchScheduleByWork(workId),
    enabled: !!workId && workId > 0,
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
  },
  downloadAdmittedStudentsList: async (orgUnitId, semesterId) => {
    const response = await apiClient.get('/v1/protocols/admitted-list', {
      params: { orgUnitId, semesterId },
      responseType: 'blob',
    });
    return response.data;
  },
  downloadScheduleReport: async (commissionId) => {
    const response = await apiClient.get('/v1/protocols/schedule-report', {
      params: { commissionId },
      responseType: 'blob',
    });
    return response.data;
  },
  notifyUnreadyStudents: async (orgUnitId, semesterId, specialityId = null) => {
    const response = await apiClient.post('/v1/protocols/notify-unready', {
      orgUnitId,
      semesterId,
      specialityId,
    });
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

export function useDownloadAdmittedStudentsList() {
  return useMutation({
    mutationFn: ({ orgUnitId, semesterId }) =>
      protocolApi.downloadAdmittedStudentsList(orgUnitId, semesterId),
    onSuccess: (data, variables) => {
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admitted_${variables.orgUnitId}_${variables.semesterId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  });
}

export function useDownloadScheduleReport() {
  return useMutation({
    mutationFn: (commissionId) => protocolApi.downloadScheduleReport(commissionId),
    onSuccess: (data, commissionId) => {
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule_commission_${commissionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  });
}

export function useNotifyUnreadyStudents() {
  return useMutation({
    mutationFn: ({ orgUnitId, semesterId, specialityId }) =>
      protocolApi.notifyUnreadyStudents(orgUnitId, semesterId, specialityId),
  });
}




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


