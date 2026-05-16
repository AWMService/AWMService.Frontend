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

const normalizeTopicStatus = (item) => {
  if (read(item, 'isClosed') || read(item, 'isDeleted')) return 'closed';
  if (read(item, 'isApproved')) return 'approved';
  if (read(item, 'isSubmittedForApproval')) return 'pending';
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

  return {
    ...item,
    id: read(item, 'id'),
    directionId: read(item, 'directionId'),
    departmentId: read(item, 'departmentId'),
    supervisorId: read(item, 'supervisorId'),
    academicYearId: read(item, 'academicYearId'),
    workTypeId: read(item, 'workTypeId'),
    title: readLocalized(item, 'title'),
    description: readLocalized(item, 'description'),
    directionTitle: readLocalized(item, 'directionTitle'),
    supervisorName: read(item, 'supervisorName'),
    workTypeName: read(item, 'workTypeName'),
    maxParticipants,
    participantCount: maxParticipants,
    availableSpots: read(item, 'availableSpots') ?? Math.max(0, maxParticipants - acceptedApplicationsCount),
    acceptedApplicationsCount,
    pendingApplicationsCount,
    applicationsCount: read(item, 'applicationsCount') ?? applications.length,
    isSubmittedForApproval: read(item, 'isSubmittedForApproval') ?? false,
    isApproved: read(item, 'isApproved') ?? false,
    isClosed: read(item, 'isClosed') ?? false,
    status: normalizeTopicStatus(item),
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
  topics: (read(summary, 'topics') || []).map((item) => ({
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
    isApproved: read(item, 'isApproved') ?? false,
    isClosed: read(item, 'isClosed') ?? false,
  })),
});

export const topicPayloadFromForm = ({ form, user, workTypeId }) => {
  const titleRu = form.title?.ru?.trim() || form.title?.kk?.trim() || form.title?.en?.trim() || '';

  return {
    departmentId: user?.departmentId,
    supervisorId: user?.staffId,
    academicYearId: user?.currentAcademicYearId,
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
  fetchBySupervisor: async ({ supervisorId, academicYearId }) => {
    const { data } = await apiClient.get('/Topics/by-supervisor', {
      params: { supervisorId, academicYearId },
    });
    return data.map(normalizeTopic);
  },

  fetchByDirection: async (directionId) => {
    const { data } = await apiClient.get(`/Topics/by-direction/${directionId}`);
    return data.map(normalizeTopic);
  },

  fetchAvailable: async ({ departmentId, academicYearId } = {}) => {
    const { data } = await apiClient.get('/Topics/available', {
      params: { departmentId, academicYearId },
    });
    return data.map(normalizeTopic);
  },

  fetchById: async (id) => {
    const { data } = await apiClient.get(`/Topics/${id}`);
    return normalizeTopic(data);
  },

  create: async (payload) => {
    const { data } = await apiClient.post('/Topics', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await apiClient.put(`/Topics/${id}`, payload);
    return data;
  },

  submitForApproval: async (topicIds) => {
    const { data } = await apiClient.post('/Topics/submit-for-approval', { topicIds });
    return data;
  },

  approve: async (id) => {
    const { data } = await apiClient.post(`/Topics/${id}/approve`);
    return data;
  },

  close: async (id) => {
    const { data } = await apiClient.post(`/Topics/${id}/close`);
    return data;
  },

  deactivate: async (id) => {
    const { data } = await apiClient.post(`/Topics/${id}/deactivate`);
    return data;
  },

  fetchCoordinationSummary: async ({ departmentId, academicYearId }) => {
    const { data } = await apiClient.get('/Topics/coordination-summary', {
      params: { departmentId, academicYearId },
    });
    return normalizeCoordinationSummary(data);
  },

  bulkApprove: async (topicIds) => {
    const { data } = await apiClient.post('/Topics/bulk-approve', { topicIds });
    return data;
  },

  completeCoordination: async ({ departmentId, academicYearId }) => {
    const { data } = await apiClient.post('/Topics/complete-coordination', { departmentId, academicYearId });
    return data;
  },
};

export const applicationsApi = {
  fetchMy: async ({ academicYearId } = {}) => {
    const { data } = await apiClient.get('/applications/my', { params: { academicYearId } });
    return data.map(normalizeTopicApplication);
  },

  fetchByTopic: async (topicId) => {
    const { data } = await apiClient.get(`/applications/by-topic/${topicId}`);
    return data.map(normalizeTopicApplication);
  },

  create: async ({ topicId, motivationLetter }) => {
    const { data } = await apiClient.post('/applications', { topicId, motivationLetter });
    return data;
  },

  accept: async (id) => {
    const { data } = await apiClient.post(`/applications/${id}/accept`);
    return data;
  },

  reject: async ({ id, rejectReason }) => {
    const { data } = await apiClient.post(`/applications/${id}/reject`, { rejectReason });
    return data;
  },

  withdraw: async (id) => {
    const { data } = await apiClient.delete(`/applications/${id}`);
    return data;
  },
};

export const topicKeys = {
  all: ['topics'],
  supervisor: (supervisorId, academicYearId) => [...topicKeys.all, 'supervisor', supervisorId, academicYearId],
  available: (departmentId, academicYearId) => [...topicKeys.all, 'available', departmentId, academicYearId],
  direction: (directionId) => [...topicKeys.all, 'direction', directionId],
  detail: (id) => [...topicKeys.all, 'detail', id],
  coordination: (departmentId, academicYearId) => [...topicKeys.all, 'coordination', departmentId, academicYearId],
};

export const applicationKeys = {
  all: ['applications'],
  my: (academicYearId) => [...applicationKeys.all, 'my', academicYearId],
  topic: (topicId) => [...applicationKeys.all, 'topic', topicId],
};

export const useTopicsBySupervisor = (supervisorId, academicYearId) => useQuery({
  queryKey: topicKeys.supervisor(supervisorId, academicYearId),
  queryFn: () => topicsApi.fetchBySupervisor({ supervisorId, academicYearId }),
  enabled: !!supervisorId && !!academicYearId,
});

export const useTopicsByDirection = (directionId) => useQuery({
  queryKey: topicKeys.direction(directionId),
  queryFn: () => topicsApi.fetchByDirection(directionId),
  enabled: !!directionId,
});

export const useAvailableTopics = (departmentId, academicYearId) => useQuery({
  queryKey: topicKeys.available(departmentId, academicYearId),
  queryFn: () => topicsApi.fetchAvailable({ departmentId, academicYearId }),
});

export const useTopicDetail = (id) => useQuery({
  queryKey: topicKeys.detail(id),
  queryFn: () => topicsApi.fetchById(id),
  enabled: !!id,
});

export const useTopicCoordinationSummary = (departmentId, academicYearId) => useQuery({
  queryKey: topicKeys.coordination(departmentId, academicYearId),
  queryFn: () => topicsApi.fetchCoordinationSummary({ departmentId, academicYearId }),
  enabled: !!departmentId && !!academicYearId,
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

export const useMyApplications = (academicYearId) => useQuery({
  queryKey: applicationKeys.my(academicYearId),
  queryFn: () => applicationsApi.fetchMy({ academicYearId }),
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
