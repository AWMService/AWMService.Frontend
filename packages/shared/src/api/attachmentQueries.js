import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';
const ATTACHMENT_TYPES = {
  Draft: 0,
  Final: 1,
  Presentation: 2,
  Software: 3,
};
export const ATTACHMENT_TYPE_LABELS = {
  Draft: 'Draft',
  Final: 'Final',
  Presentation: 'Presentation',
  Software: 'Software',
};
function buildUrl(workId, attachmentId) {
  const base = `/works/${workId}/attachments`;
  return attachmentId != null ? `${base}/${attachmentId}` : base;
}
export async function fetchAttachments(workId) {
  const { data } = await apiClient.get(buildUrl(workId));
  return data;
}
export function useAttachments(workId) {
  return useQuery({
    queryKey: ['attachments', workId],
    queryFn: () => fetchAttachments(workId),
    enabled: !!workId,
  });
}
export async function uploadAttachment(workId, file, attachmentType = 'Draft') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('attachmentType', ATTACHMENT_TYPES[attachmentType] ?? 0);
  const { data } = await apiClient.post(buildUrl(workId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export function useUploadAttachment(workId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, attachmentType }) => uploadAttachment(workId, file, attachmentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', workId] });
    },
  });
}
export async function downloadAttachment(workId, attachmentId, fileName) {
  const response = await apiClient.get(`${buildUrl(workId, attachmentId)}/download`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName || 'attachment');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
export async function deleteAttachment(workId, attachmentId) {
  await apiClient.delete(buildUrl(workId, attachmentId));
}
export function useDeleteAttachment(workId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId) => deleteAttachment(workId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', workId] });
    },
  });
}
export async function fetchCurrentWorkId() {
  const { data } = await apiClient.get('/works/my');
  if (!data || data.length === 0) return null;
  return data[0].id;
}
export function useCurrentWorkId() {
  return useQuery({
    queryKey: ['currentWorkId'],
    queryFn: fetchCurrentWorkId,
    staleTime: 5 * 60 * 1000,
  });
}
