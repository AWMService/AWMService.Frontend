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
export async function uploadExternalReview(workId, formData) {
  await apiClient.post(`/v1/works/${workId}/reviews/external`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function useUploadExternalReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workId, formData }) => uploadExternalReview(workId, formData),
    onSuccess: (data, { workId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'work', workId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my-assignments'] });
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

// Assign reviewer to a work (reviewerEntityId = Reviewer entity ID, not UserId)
export async function assignReviewerToWork(workId, reviewerEntityId) {
  const { data } = await apiClient.post(`/v1/works/${workId}/assign-reviewer`, { reviewerEntityId });
  return data;
}

export function useAssignReviewer(workId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewerEntityId) => assignReviewerToWork(workId, reviewerEntityId),
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

// Fetch all reviewers
export async function fetchReviewers(searchTerm) {
  const { data } = await apiClient.get('/v1/reviewers', {
    params: { searchTerm },
  });
  return data;
}

export function useReviewers(searchTerm) {
  return useQuery({
    queryKey: ['reviewers', searchTerm],
    queryFn: () => fetchReviewers(searchTerm),
  });
}

// Create reviewer
export async function createReviewer(reviewerData) {
  const { data } = await apiClient.post('/v1/reviewers', reviewerData);
  return data;
}

export function useCreateReviewer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReviewer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewers'] });
    },
  });
}

// Update reviewer
export async function updateReviewer(id, reviewerData) {
  const { data } = await apiClient.put(`/v1/reviewers/${id}`, reviewerData);
  return data;
}

export function useUpdateReviewer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateReviewer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewers'] });
    },
  });
}

// Delete reviewer
export async function deleteReviewer(id) {
  const { data } = await apiClient.delete(`/v1/reviewers/${id}`);
  return data;
}

export function useDeleteReviewer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReviewer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewers'] });
    },
  });
}
