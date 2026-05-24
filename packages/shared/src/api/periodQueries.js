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
  "FinalDefense": 8
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
  8: "FinalDefense"
};

export const periodApi = {
  fetchPeriods: async (orgUnitId, semesterId) => {
    const { data } = await apiClient.get('/stages/periods', {
      params: { semesterId: semesterId, orgUnitId: orgUnitId }
    });
    return data.map(p => ({
      id: p.workflowStageId,
      workflowStage: STAGE_MAP_REV[p.workflowStageId] || `Stage_${p.workflowStageId}`,
      startDate: p.startDate,
      endDate: p.endDate
    }));
  },
  fetchActivePeriod: async (orgUnitId, semesterId, stage) => {
    const stageId = STAGE_MAP[stage] || 0;
    const { data } = await apiClient.get('/stages/periods', {
      params: { semesterId: semesterId, orgUnitId: orgUnitId }
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
    // Legacy support
    return periodData;
  },
  updatePeriod: async (orgUnitId, periodId, periodData) => {
    // Legacy support
    return periodData;
  },
  approveInitialPeriods: async (orgUnitId, semesterId, periods) => {
    const payload = {
      semesterId: semesterId,
      orgUnitId: orgUnitId,
      periods: periods.map(p => ({
        workflowStageId: STAGE_MAP[p.workflowStage] || 0,
        startDate: p.startDate,
        endDate: p.endDate
      })).filter(p => p.workflowStageId !== 0)
    };
    const { data } = await apiClient.post('/stages/periods', payload);
    return data;
  },
  approveDefensePeriods: async (orgUnitId, semesterId, periods) => {
    const payload = {
      semesterId: semesterId,
      orgUnitId: orgUnitId,
      periods: periods.map(p => ({
        workflowStageId: STAGE_MAP[p.workflowStage] || 0,
        startDate: p.startDate,
        endDate: p.endDate
      })).filter(p => p.workflowStageId !== 0)
    };
    const { data } = await apiClient.post('/stages/periods', payload);
    return data;
  }
};

export const periodKeys = {
  all: ['periods'],
  byDepartment: (orgUnitId, semesterId) => [...periodKeys.all, 'department', orgUnitId, semesterId],
  active: (orgUnitId, semesterId, stage) => [...periodKeys.all, 'active', orgUnitId, semesterId, stage]
};

export const usePeriods = (orgUnitId, semesterId) => {
  return useQuery({
    queryKey: periodKeys.byDepartment(orgUnitId, semesterId),
    queryFn: () => periodApi.fetchPeriods(orgUnitId, semesterId),
    enabled: !!orgUnitId && !!semesterId,
  });
};

export const useActivePeriod = (orgUnitId, semesterId, stage) => {
  return useQuery({
    queryKey: periodKeys.active(orgUnitId, semesterId, stage),
    queryFn: () => periodApi.fetchActivePeriod(orgUnitId, semesterId, stage),
    enabled: !!orgUnitId && !!semesterId && !!stage,
  });
};

export const useApproveInitialPeriods = (orgUnitId, semesterId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periods) => periodApi.approveInitialPeriods(orgUnitId, semesterId, periods),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.byDepartment(orgUnitId, semesterId) });
    },
  });
};

export const useApproveDefensePeriods = (orgUnitId, semesterId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (periods) => periodApi.approveDefensePeriods(orgUnitId, semesterId, periods),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.byDepartment(orgUnitId, semesterId) });
    },
  });
};

