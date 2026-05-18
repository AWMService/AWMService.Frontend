import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';
const read = (value, key) => value?.[key] ?? value?.[key.charAt(0).toUpperCase() + key.slice(1)];
const readLocalized = (item, field) => {
  const value = read(item, field);
  const pascal = field.charAt(0).toUpperCase() + field.slice(1);
  return {
    ru: value?.ru ?? value?.Ru ?? read(item, `${field}Ru`) ?? read(item, `${pascal}Ru`) ?? '',
    kk: value?.kk ?? value?.Kk ?? value?.kz ?? value?.Kz ?? read(item, `${field}Kz`) ?? read(item, `${pascal}Kz`) ?? '',
    en: value?.en ?? value?.En ?? read(item, `${field}En`) ?? read(item, `${pascal}En`) ?? '',
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
    departmentId: read(item, 'departmentId'),
    supervisorId: read(item, 'supervisorId'),
    academicYearId: read(item, 'academicYearId'),
    workTypeId: read(item, 'workTypeId'),
    currentStateId: read(item, 'currentStateId'),
    currentStateName,
    currentStateDisplayName,
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
  departmentId: user?.departmentId,
  supervisorId: user?.staffId,
  academicYearId: user?.currentAcademicYearId,
  workTypeId,
  titleRu: form.title?.ru?.trim() || '',
  titleKz: form.title?.kk?.trim() || '',
  titleEn: form.title?.en?.trim() || '',
  descriptionRu: form.description?.ru?.trim() || '',
  descriptionKz: form.description?.kk?.trim() || '',
  descriptionEn: form.description?.en?.trim() || '',
});
export const directionsApi = {
  fetchBySupervisor: async ({ supervisorId, academicYearId, workTypeId, stateId, includeDeleted = false }) => {
    const { data } = await apiClient.get('/Directions/by-supervisor', {
      params: { supervisorId, academicYearId, workTypeId, stateId, includeDeleted },
    });
    return data.map(normalizeDirection);
  },
  fetchByDepartment: async ({ departmentId, academicYearId, workTypeId, stateId, supervisorId, includeDeleted = false }) => {
    const { data } = await apiClient.get('/Directions/by-department', {
      params: { departmentId, academicYearId, workTypeId, stateId, supervisorId, includeDeleted },
    });
    return data.map(normalizeDirection);
  },
  fetchById: async (id) => {
    const { data } = await apiClient.get(`/Directions/${id}`);
    return normalizeDirection(data);
  },
  create: async (payload) => {
    const { data } = await apiClient.post('/Directions', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await apiClient.put(`/Directions/${id}`, payload);
    return data;
  },
  submit: async (id) => {
    const { data } = await apiClient.post(`/Directions/${id}/submit`);
    return data;
  },
  approve: async (id) => {
    const { data } = await apiClient.post(`/Directions/${id}/approve`);
    return data;
  },
  reject: async ({ id, comment }) => {
    const { data } = await apiClient.post(`/Directions/${id}/reject`, { comment });
    return data;
  },
  requestRevision: async ({ id, comment }) => {
    const { data } = await apiClient.post(`/Directions/${id}/request-revision`, { comment });
    return data;
  },
};
export const directionKeys = {
  all: ['directions'],
  supervisor: (supervisorId, academicYearId) => [...directionKeys.all, 'supervisor', supervisorId, academicYearId],
  department: (departmentId, academicYearId) => [...directionKeys.all, 'department', departmentId, academicYearId],
  detail: (id) => [...directionKeys.all, 'detail', id],
};
export const useDirectionsBySupervisor = (supervisorId, academicYearId, filters = {}) => useQuery({
  queryKey: [...directionKeys.supervisor(supervisorId, academicYearId), filters],
  queryFn: () => directionsApi.fetchBySupervisor({ supervisorId, academicYearId, ...filters }),
  enabled: !!supervisorId && !!academicYearId,
});
export const useDirectionsByDepartment = (departmentId, academicYearId, filters = {}) => useQuery({
  queryKey: [...directionKeys.department(departmentId, academicYearId), filters],
  queryFn: () => directionsApi.fetchByDepartment({ departmentId, academicYearId, ...filters }),
  enabled: !!departmentId && !!academicYearId,
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
export const useApproveDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: directionsApi.approve,
    onSuccess: () => invalidateDirections(queryClient),
  });
};
export const useRejectDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: directionsApi.reject,
    onSuccess: () => invalidateDirections(queryClient),
  });
};
export const useRequestDirectionRevision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: directionsApi.requestRevision,
    onSuccess: () => invalidateDirections(queryClient),
  });
};
