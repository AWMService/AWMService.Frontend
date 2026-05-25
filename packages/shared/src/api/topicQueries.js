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

/**
 * Normalizes topic status from backend TopicStatus enum string.
 * Backend returns: "Draft", "Pending", "Approved", "Rejected", "Closed"
 */
const normalizeTopicStatus = (item) => {
  const raw = String(read(item, 'status') || '').toLowerCase();
  if (['draft', 'pending', 'approved', 'rejected', 'closed'].includes(raw)) return raw;
  return 'draft';
};

export const normalizeApplicationStatus = (status) => {
  const raw = String(status || '').toLowerCase();
  if (raw.includes('accept') || raw.includes('approved')) return 'approved';
  if (raw.includes('reject')) return 'rejected';
  if (raw.includes('withdraw')) return 'withdrawn';
  return 'pending';
};

export const normalizeTopicApplication = (item) => {
  const status = normalizeApplicationStatus(read(item, 'statusText') ?? read(item, 'status'));
  const topicTitle = readLocalized(item, 'topicTitle');
  const directionTitle = readLocalized(item, 'directionTitle');

  return {
    ...item,
    id: read(item, 'id'),
    topicId: read(item, 'topicId'),
    studentId: read(item, 'studentId'),
    studentName: read(item, 'studentName'),
    studentGroupCode: read(item, 'studentGroupCode'),
    motivationLetter: read(item, 'motivationLetter'),
    appliedAt: read(item, 'appliedAt'),
    reviewedAt: read(item, 'reviewedAt'),
    reviewComment: read(item, 'reviewComment'),
    status,
    isPending: status === 'pending',
    isAccepted: status === 'approved',
    topicTitle,
    theme: topicTitle,
    directionTitle,
    supervisorId: read(item, 'supervisorId'),
    supervisorName: read(item, 'supervisorName'),
    workTypeId: read(item, 'workTypeId'),
    workTypeName: read(item, 'workTypeName'),
    topicMaxParticipants: read(item, 'topicMaxParticipants'),
    topicAvailableSpots: read(item, 'topicAvailableSpots'),
  };
};

export const normalizeTopic = (item) => {
  const applications = (read(item, 'applications') || []).map(normalizeTopicApplication);
  const pendingApplicationsCount = read(item, 'pendingApplicationsCount') ?? applications.filter((app) => app.status === 'pending').length;
  const acceptedApplicationsCount = read(item, 'acceptedApplicationsCount') ?? applications.filter((app) => app.status === 'approved').length;
  const maxParticipants = read(item, 'maxParticipants') ?? 1;
  const status = normalizeTopicStatus(item);

  return {
    ...item,
    id: read(item, 'id'),
    directionId: read(item, 'directionId'),
    orgUnitId: read(item, 'orgUnitId'),
    supervisorId: read(item, 'supervisorId'),
    semesterId: read(item, 'semesterId'),
    workTypeId: read(item, 'workTypeId'),
    title: readLocalized(item, 'title'),
    description: readLocalized(item, 'description'),
    directionTitle: readLocalized(item, 'directionTitle'),
    supervisorName: read(item, 'supervisorName'),
    workTypeName: read(item, 'workTypeName'),
    maxParticipants,
    participantCount: acceptedApplicationsCount,
    availableSpots: read(item, 'availableSpots') ?? Math.max(0, maxParticipants - acceptedApplicationsCount),
    acceptedApplicationsCount,
    pendingApplicationsCount,
    applicationsCount: read(item, 'applicationsCount') ?? applications.length,
    status,
    isApproved: status === 'approved',
    isClosed: status === 'closed',
    reviewComment: read(item, 'reviewComment'),
    createdAt: read(item, 'createdAt'),
    applications,
    students: applications
      .filter((app) => app.status === 'approved')
      .map((app) => ({
        id: app.studentId,
        fullName: app.studentName,
        group: app.studentGroupCode,
      })),
    requests: applications
      .filter((app) => app.status === 'pending')
      .map((app) => ({
        id: app.id,
        student: {
          id: app.studentId,
          fullName: app.studentName,
          group: app.studentGroupCode,
        },
        motivationLetter: app.motivationLetter,
        createdAt: app.appliedAt,
      })),
  };
};

export const normalizeCoordinationSummary = (summary) => ({
  totalTopics: read(summary, 'totalTopics') ?? 0,
  approvedTopics: read(summary, 'approvedTopics') ?? 0,
  topicsWithStudents: read(summary, 'topicsWithStudents') ?? 0,
  topicsWithoutStudents: read(summary, 'topicsWithoutStudents') ?? 0,
  closedTopics: read(summary, 'closedTopics') ?? 0,
  totalAcceptedApplications: read(summary, 'totalAcceptedApplications') ?? 0,
  totalAvailableSpots: read(summary, 'totalAvailableSpots') ?? 0,
  topics: (read(summary, 'topics') || []).map((item) => {
    const status = String(read(item, 'status') || '').toLowerCase();
    return {
      id: read(item, 'topicId'),
      topicId: read(item, 'topicId'),
      title: readLocalized(item, 'title'),
      supervisorId: read(item, 'supervisorId'),
      supervisorName: read(item, 'supervisorName'),
      maxParticipants: read(item, 'maxParticipants') ?? 1,
      applicationsCount: read(item, 'applicationsCount') ?? 0,
      acceptedCount: read(item, 'acceptedCount') ?? 0,
      pendingCount: read(item, 'pendingCount') ?? 0,
      rejectedCount: read(item, 'rejectedCount') ?? 0,
      availableSpots: read(item, 'availableSpots') ?? 0,
      lastRejectionReason: read(item, 'lastRejectionReason'),
      status,
      isApproved: status === 'approved',
      isClosed: status === 'closed',
    };
  }),
});

export const topicPayloadFromForm = ({ form, user, workTypeId }) => {
  const titleRu = form.title?.ru?.trim() || form.title?.kk?.trim() || form.title?.en?.trim() || '';

  return {
    orgUnitId: user?.orgUnitId,
    supervisorId: user?.userId,
    semesterId: user?.currentSemesterId,
    workTypeId: Number(form.workTypeId || form.workType || workTypeId),
    directionId: form.directionId ? Number(form.directionId) : null,
    titleRu,
    titleKz: form.title?.kk?.trim() || '',
    titleEn: form.title?.en?.trim() || '',
    descriptionRu: form.description?.ru?.trim() || form.description?.kk?.trim() || form.description?.en?.trim() || '',
    descriptionKz: form.description?.kk?.trim() || '',
    descriptionEn: form.description?.en?.trim() || '',
    maxParticipants: Number(form.maxParticipants || form.studentCount || form.participantCount || 1),
  };
};

export const topicsApi = {
  fetchBySupervisor: async ({ semesterId }) => {
    const { data } = await apiClient.get('/v1/topics/my', {
      params: { semesterId },
    });
    return data.map(normalizeTopic);
  },

  fetchAvailable: async ({ orgUnitId, semesterId } = {}) => {
    const { data } = await apiClient.get('/v1/topics/available', {
      params: { orgUnitId, semesterId },
    });
    return data.map(normalizeTopic);
  },

  fetchById: async (id) => {
    const { data } = await apiClient.get(`/v1/topics/${id}`);
    return normalizeTopic(data);
  },

  create: async (payload) => {
    const { data } = await apiClient.post('/v1/topics', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await apiClient.put(`/v1/topics/${id}`, payload);
    return data;
  },

  submitForApproval: async (topicIds) => {
    const { data } = await apiClient.post('/v1/topics/submit', { topicIds });
    return data;
  },

  approve: async (id, payload = { isApproved: true }) => {
    const { data } = await apiClient.post(`/v1/topics/${id}/review`, payload);
    return data;
  },

  close: async (id) => {
    await apiClient.post(`/v1/topics/${id}/close`);
  },

  /** @deprecated Redirects to review with isApproved=false. Will be removed. */
  deactivate: async (id, comment = '') => {
    return topicsApi.approve(id, { isApproved: false, comment });
  },

  fetchCoordinationSummary: async ({ orgUnitId, semesterId }) => {
    const { data } = await apiClient.get('/v1/topics/department', {
      params: { orgUnitId, semesterId },
    });
    return normalizeCoordinationSummary(data);
  },

  // --- Below endpoints require backend implementation (Topic Coordination phase) ---

  bulkApprove: async (topicIds) => {
    const { data } = await apiClient.post('/v1/topics/bulk-approve', { topicIds });
    return data;
  },

  completeCoordination: async ({ orgUnitId, semesterId }) => {
    const { data } = await apiClient.post('/v1/topics/complete-coordination', { orgUnitId, semesterId });
    return data;
  },
};

export const applicationsApi = {
  fetchMy: async ({ semesterId } = {}) => {
    const { data } = await apiClient.get('/v1/applications/my', { params: { semesterId } });
    return data.map(normalizeTopicApplication);
  },

  fetchByTopic: async (topicId) => {
    const { data } = await apiClient.get(`/v1/applications/by-topic/${topicId}`);
    return data.map(normalizeTopicApplication);
  },

  create: async ({ topicId, motivationLetter }) => {
    const { data } = await apiClient.post('/v1/applications', { topicId, motivationLetter });
    return data;
  },

  accept: async (id) => {
    const { data } = await apiClient.post(`/v1/applications/${id}/accept`);
    return data;
  },

  reject: async ({ id, rejectReason }) => {
    const { data } = await apiClient.post(`/v1/applications/${id}/reject`, { reason: rejectReason });
    return data;
  },

  withdraw: async (id) => {
    const { data } = await apiClient.delete(`/v1/applications/${id}`);
    return data;
  },
};

export const topicKeys = {
  all: ['topics'],
  supervisor: (supervisorId, semesterId) => [...topicKeys.all, 'supervisor', supervisorId, semesterId],
  available: (orgUnitId, semesterId) => [...topicKeys.all, 'available', orgUnitId, semesterId],
  detail: (id) => [...topicKeys.all, 'detail', id],
  coordination: (orgUnitId, semesterId) => [...topicKeys.all, 'coordination', orgUnitId, semesterId],
};

export const applicationKeys = {
  all: ['applications'],
  my: (semesterId) => [...applicationKeys.all, 'my', semesterId],
  topic: (topicId) => [...applicationKeys.all, 'topic', topicId],
};

export const useTopicsBySupervisor = (supervisorId, semesterId) => useQuery({
  queryKey: topicKeys.supervisor(supervisorId, semesterId),
  queryFn: () => topicsApi.fetchBySupervisor({ supervisorId, semesterId }),
  enabled: !!supervisorId && !!semesterId,
});

export const useAvailableTopics = (orgUnitId, semesterId) => useQuery({
  queryKey: topicKeys.available(orgUnitId, semesterId),
  queryFn: () => topicsApi.fetchAvailable({ orgUnitId, semesterId }),
});

export const useTopicDetail = (id) => useQuery({
  queryKey: topicKeys.detail(id),
  queryFn: () => topicsApi.fetchById(id),
  enabled: !!id,
});

export const useTopicCoordinationSummary = (orgUnitId, semesterId) => useQuery({
  queryKey: topicKeys.coordination(orgUnitId, semesterId),
  queryFn: () => topicsApi.fetchCoordinationSummary({ orgUnitId, semesterId }),
  enabled: !!orgUnitId && !!semesterId,
});

const invalidateTopics = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: topicKeys.all });
  queryClient.invalidateQueries({ queryKey: applicationKeys.all });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicsApi.create,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => topicsApi.update(id, payload),
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useSubmitTopicsForApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicsApi.submitForApproval,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useApproveTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicsApi.approve,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useCloseTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicsApi.close,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

/** @deprecated Use useApproveTopic with isApproved=false instead. */
export const useDeactivateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicsApi.deactivate,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useBulkApproveTopics = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicsApi.bulkApprove,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useCompleteTopicCoordination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicsApi.completeCoordination,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useMyApplications = (semesterId) => useQuery({
  queryKey: applicationKeys.my(semesterId),
  queryFn: () => applicationsApi.fetchMy({ semesterId }),
});

export const useApplicationsByTopic = (topicId) => useQuery({
  queryKey: applicationKeys.topic(topicId),
  queryFn: () => applicationsApi.fetchByTopic(topicId),
  enabled: !!topicId,
});

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationsApi.create,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useAcceptApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationsApi.accept,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationsApi.reject,
    onSuccess: () => invalidateTopics(queryClient),
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationsApi.withdraw,
    onSuccess: () => invalidateTopics(queryClient),
  });
};
