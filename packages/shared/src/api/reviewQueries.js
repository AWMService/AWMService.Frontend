import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

// Reviews for a specific work
export async function fetchReviewsByWork(workId) {
  const { data } = await apiClient.get(`/v1/works/${workId}/reviews`);
  return data;
}

export function useReviewsByWork(workId) {
  return useQuery({
    queryKey: ['reviews', 'work', workId],
    queryFn: () => fetchReviewsByWork(workId),
    enabled: !!workId,
  });
}

// Supervisor review
export async function createSupervisorReview(workId, formData) {
  const { data } = await apiClient.post(`/v1/works/${workId}/reviews/supervisor`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export function useCreateSupervisorReview(workId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => createSupervisorReview(workId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'work', workId] });
    },
  });
}

// External review upload
export async function uploadExternalReview(workId, reviewId, formData) {
  await apiClient.post(`/v1/works/${workId}/reviews/external/${reviewId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function useUploadExternalReview(workId, reviewId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => uploadExternalReview(workId, reviewId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'work', workId] });
    },
  });
}

// Review status for department (for secretaries / department heads)
export async function fetchReviewStatus(orgUnitId, semesterId) {
  const { data } = await apiClient.get('/v1/works/review-status', {
    params: { orgUnitId, semesterId },
  });
  return data;
}

export function useReviewStatus(orgUnitId, semesterId) {
  return useQuery({
    queryKey: ['reviewStatus', orgUnitId, semesterId],
    queryFn: () => fetchReviewStatus(orgUnitId, semesterId),
    enabled: !!orgUnitId && !!semesterId,
  });
}

// Assigned reviewer for a work
export async function fetchAssignedReviewer(workId) {
  const { data } = await apiClient.get(`/v1/works/${workId}/assigned-reviewer`);
  return data;
}

export function useAssignedReviewer(workId) {
  return useQuery({
    queryKey: ['assignedReviewer', workId],
    queryFn: () => fetchAssignedReviewer(workId),
    enabled: !!workId,
  });
}

// Assign reviewer to a work
export async function assignReviewerToWork(workId, reviewerId) {
  const { data } = await apiClient.post(`/v1/works/${workId}/assign-reviewer`, { reviewerId });
  return data;
}

export function useAssignReviewer(workId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewerId) => assignReviewerToWork(workId, reviewerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignedReviewer', workId] });
      queryClient.invalidateQueries({ queryKey: ['reviewStatus'] });
    },
  });
}

// My reviewer assignments
export async function fetchMyReviewerAssignments() {
  const { data } = await apiClient.get('/v1/reviews/my-assignments');
  return data;
}

export function useMyReviewerAssignments() {
  return useQuery({
    queryKey: ['reviews', 'my-assignments'],
    queryFn: fetchMyReviewerAssignments,
  });
}
