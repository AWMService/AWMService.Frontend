import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

const read = (value, key) => {
  if (!value) return undefined;
  
  if (value[key] !== undefined) return value[key];
  
  
  const pascal = key.charAt(0).toUpperCase() + key.slice(1);
  if (value[pascal] !== undefined) return value[pascal];

  
  const lowerKey = key.toLowerCase();
  const realKey = Object.keys(value).find(k => k.toLowerCase() === lowerKey);
  return realKey ? value[realKey] : undefined;
};

const readLocalized = (item, field) => {
  if (!item) return { ru: '', kk: '', en: '' };
  
  
  const existing = read(item, field);
  if (existing && typeof existing === 'object') {
    return {
      ru: read(existing, 'ru') || '',
      kk: read(existing, 'kk') || read(existing, 'kz') || '',
      en: read(existing, 'en') || '',
    };
  }

  
  return {
    ru: read(item, `${field}Ru`) || '',
    kk: read(item, `${field}Kz`) || read(item, `${field}Kk`) || '',
    en: read(item, `${field}En`) || '',
  };
};

export const directionStatusFromState = (stateName, displayName) => {
  const raw = `${stateName || ''} ${displayName || ''}`.toLowerCase();

  if (raw.includes('draft') || raw.includes('черновик')) return 'draft';
  if (raw.includes('submitted') || raw.includes('на рассмотр')) return 'pending';
  if (raw.includes('approved') || raw.includes('одобр') || raw.includes('утвержд')) return 'approved';
  if (raw.includes('rejected') || raw.includes('отклон')) return 'rejected';
  if (raw.includes('revision') || raw.includes('requiresrevision') || raw.includes('доработ')) return 'revision';

  return 'pending';
};

export const normalizeDirection = (item) => {
  const currentStateName = read(item, 'currentStateName');
  const currentStateDisplayName = read(item, 'currentStateDisplayName');

  return {
    ...item,
    id: read(item, 'id'),
    orgUnitId: read(item, 'orgUnitId'),
    supervisorId: read(item, 'supervisorId'),
    semesterId: read(item, 'semesterId'),
    workTypeId: read(item, 'workTypeId'),
    currentStateId: read(item, 'currentStateId'),
    currentStateName,
    currentStateDisplayName,
    supervisorFullName: read(item, 'supervisorFullName'),
    title: readLocalized(item, 'title'),
    description: readLocalized(item, 'description'),
    status: directionStatusFromState(currentStateName, currentStateDisplayName),
    submittedAt: read(item, 'submittedAt'),
    reviewedAt: read(item, 'reviewedAt'),
    reviewComment: read(item, 'reviewComment'),
    createdAt: read(item, 'createdAt'),
    isDeleted: read(item, 'isDeleted') ?? false,
  };
};

export const directionPayloadFromForm = ({ form, user, workTypeId }) => ({
  orgUnitId: user?.orgUnitId,
  supervisorId: user?.userId,
  semesterId: user?.currentSemesterId,
  workTypeId,
  titleRu: form.title?.ru?.trim() || '',
  titleKz: form.title?.kk?.trim() || '',
  titleEn: form.title?.en?.trim() || '',
  descriptionRu: form.description?.ru?.trim() || '',
  descriptionKz: form.description?.kk?.trim() || '',
  descriptionEn: form.description?.en?.trim() || '',
});

export const directionsApi = {
  fetchBySupervisor: async ({ semesterId }) => {
    const { data } = await apiClient.get('/v1/directions/my', {
      params: { semesterId },
    });
    return data.map(normalizeDirection);
  },

  fetchByDepartment: async ({ orgUnitId, semesterId, stateId }) => {
    const { data } = await apiClient.get(`/v1/directions/org-unit/${orgUnitId}`, {
      params: { semesterId, stateId },
    });
    return data.map(normalizeDirection);
  },

  fetchById: async (id) => {
    const { data } = await apiClient.get(`/v1/directions/${id}`);
    return normalizeDirection(data);
  },

  create: async (payload) => {
    const { data } = await apiClient.post('/v1/directions', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await apiClient.put(`/v1/directions/${id}`, payload);
    return data;
  },

  submit: async (id) => {
    const { data } = await apiClient.post(`/v1/directions/${id}/submit`);
    return data;
  },

  review: async ({ id, decisionId, comment }) => {
    const { data } = await apiClient.post(`/v1/directions/${id}/review`, { decisionId, comment });
    return data;
  },
};

export const directionKeys = {
  all: ['directions'],
  supervisor: (supervisorId, semesterId) => [...directionKeys.all, 'supervisor', supervisorId, semesterId],
  department: (orgUnitId, semesterId) => [...directionKeys.all, 'department', orgUnitId, semesterId],
  detail: (id) => [...directionKeys.all, 'detail', id],
};

export const useDirectionsBySupervisor = (supervisorId, semesterId, filters = {}) => useQuery({
  queryKey: [...directionKeys.supervisor(supervisorId, semesterId), filters],
  queryFn: () => directionsApi.fetchBySupervisor({ semesterId, ...filters }),
});

export const useDirectionsByDepartment = (orgUnitId, semesterId, filters = {}) => useQuery({
  queryKey: [...directionKeys.department(orgUnitId, semesterId), filters],
  queryFn: () => directionsApi.fetchByDepartment({ orgUnitId, semesterId, ...filters }),
  enabled: !!orgUnitId,
});

export const useDirectionDetail = (id) => useQuery({
  queryKey: directionKeys.detail(id),
  queryFn: () => directionsApi.fetchById(id),
  enabled: !!id,
});

const invalidateDirections = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: directionKeys.all });
};

export const useCreateDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: directionsApi.create,
    onSuccess: () => invalidateDirections(queryClient),
  });
};

export const useUpdateDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => directionsApi.update(id, payload),
    onSuccess: () => invalidateDirections(queryClient),
  });
};

export const useSubmitDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: directionsApi.submit,
    onSuccess: () => invalidateDirections(queryClient),
  });
};

export const useReviewDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: directionsApi.review,
    onSuccess: () => invalidateDirections(queryClient),
  });
};

export const useApproveDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => directionsApi.review({ id, decisionId: 1, comment: null }),
    onSuccess: () => invalidateDirections(queryClient),
  });
};

export const useRejectDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }) => directionsApi.review({ id, decisionId: 2, comment }),
    onSuccess: () => invalidateDirections(queryClient),
  });
};

export const useRequestDirectionRevision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }) => directionsApi.review({ id, decisionId: 3, comment }),
    onSuccess: () => invalidateDirections(queryClient),
  });
};
