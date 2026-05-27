import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

const STAGE_MAP = {
  // Frontend String -> Backend Int
  "DirectionSubmission": 1,
  "TopicCreation": 2,
  "TopicSelection": 3,
  "Preparation": 4,
  "PreDefense1": 5,
  "PreDefense2": 6,
  "PreDefense3": 7,
  "FinalDefense": 8,
  "ChecksPeriod": 9,
};

const STAGE_MAP_REV = {
  // Backend Int -> Frontend String
  1: "DirectionSubmission",
  2: "TopicCreation",
  3: "TopicSelection",
  4: "Preparation",
  5: "PreDefense1",
  6: "PreDefense2",
  7: "PreDefense3",
  8: "FinalDefense",
  9: "ChecksPeriod",
};

export const periodApi = {
  fetchPeriods: async (orgUnitId, semesterId, specialityId = null) => {
    const { data } = await apiClient.get('/v1/stages/periods', {
      params: { semesterId, orgUnitId, specialityId }
    });
    return data.map(p => ({
      id: p.workflowStageId,
      workflowStage: STAGE_MAP_REV[p.workflowStageId] || `Stage_${p.workflowStageId}`,
      startDate: p.startDate,
      endDate: p.endDate
    }));
  },
  fetchActivePeriod: async (orgUnitId, semesterId, stage, specialityId = null) => {
    const stageId = STAGE_MAP[stage] || 0;
    const { data } = await apiClient.get('/v1/stages/periods', {
      params: { semesterId, orgUnitId, specialityId }
    });
    const period = data.find(p => p.workflowStageId === stageId);
    if (!period) return null;
    return {
      id: period.workflowStageId,
      workflowStage: stage,
      startDate: period.startDate,
      endDate: period.endDate
    };
  },
  createPeriod: async (orgUnitId, periodData) => {
    return periodData;
  },
  updatePeriod: async (orgUnitId, periodId, periodData) => {
    return periodData;
  },
  approveInitialPeriods: async (orgUnitId, semesterId, periods, specialityId = null) => {
    const payload = {
      semesterId: semesterId,
      orgUnitId: orgUnitId,
      specialityId: specialityId,
      periods: periods.map(p => ({
        workflowStageId: STAGE_MAP[p.workflowStage] || 0,
        startDate: p.startDate,
        endDate: p.endDate
      })).filter(p => p.workflowStageId !== 0)
    };
    const { data } = await apiClient.post('/v1/stages/periods', payload);
    return data;
  },
  approveDefensePeriods: async (orgUnitId, semesterId, periods, specialityId = null) => {
    const payload = {
      semesterId: semesterId,
      orgUnitId: orgUnitId,
      specialityId: specialityId,
      periods: periods.map(p => ({
        workflowStageId: STAGE_MAP[p.workflowStage] || 0,
        startDate: p.startDate,
        endDate: p.endDate
      })).filter(p => p.workflowStageId !== 0)
    };
    const { data } = await apiClient.post('/v1/stages/periods', payload);
    return data;
  },
  fetchOrgUnitSpecialities: async (orgUnitId) => {
    const { data } = await apiClient.get('/v1/stages/specialities', {
      params: { orgUnitId }
    });
    return data;
  },
  resetStagesOverride: async (orgUnitId, semesterId, specialityId) => {
    const { data } = await apiClient.delete('/v1/stages/override', {
      params: { orgUnitId, semesterId, specialityId }
    });
    return data;
  }
};

export const periodKeys = {
  all: ['periods'],
  byDepartment: (orgUnitId, semesterId, specialityId = null) => [...periodKeys.all, 'department', orgUnitId, semesterId, specialityId],
  active: (orgUnitId, semesterId, stage, specialityId = null) => [...periodKeys.all, 'active', orgUnitId, semesterId, stage, specialityId],
  specialities: (orgUnitId) => ['specialities', 'department', orgUnitId]
};

export const usePeriods = (orgUnitId, semesterId, specialityId = null) => {
  return useQuery({
    queryKey: periodKeys.byDepartment(orgUnitId, semesterId, specialityId),
    queryFn: () => periodApi.fetchPeriods(orgUnitId, semesterId, specialityId),
    enabled: !!orgUnitId && !!semesterId,
  });
};

export const useActivePeriod = (orgUnitId, semesterId, stage, specialityId = null) => {
  return useQuery({
    queryKey: periodKeys.active(orgUnitId, semesterId, stage, specialityId),
    queryFn: () => periodApi.fetchActivePeriod(orgUnitId, semesterId, stage, specialityId),
    enabled: !!orgUnitId && !!semesterId && !!stage,
  });
};

export const useApproveInitialPeriods = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periods) => periodApi.approveInitialPeriods(orgUnitId, semesterId, periods, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.all });
    },
  });
};

export const useApproveDefensePeriods = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periods) => periodApi.approveDefensePeriods(orgUnitId, semesterId, periods, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.all });
    },
  });
};

export const useApproveChecksPeriods = (orgUnitId, semesterId, specialityId = null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periods) => periodApi.approveDefensePeriods(orgUnitId, semesterId, periods, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.all });
    },
  });
};

export const useOrgUnitSpecialities = (orgUnitId) => {
  return useQuery({
    queryKey: periodKeys.specialities(orgUnitId),
    queryFn: () => periodApi.fetchOrgUnitSpecialities(orgUnitId),
    enabled: !!orgUnitId,
  });
};

export const useResetStagesOverride = (orgUnitId, semesterId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (specialityId) => periodApi.resetStagesOverride(orgUnitId, semesterId, specialityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.all });
    },
  });
};

