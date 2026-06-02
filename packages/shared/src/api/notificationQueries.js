import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

export async function fetchNotifications(skip = 0, take = 20, onlyUnread = null) {
  const params = { skip, take };
  if (onlyUnread != null) params.onlyUnread = onlyUnread;
  const { data } = await apiClient.get('/v1/notifications', { params });
  return data;
}

export function useNotifications(skip = 0, take = 20, onlyUnread = null) {
  return useQuery({
    queryKey: ['notifications', skip, take, onlyUnread],
    queryFn: () => fetchNotifications(skip, take, onlyUnread),
  });
}

export async function markNotificationAsRead(notificationId) {
  await apiClient.post(`/v1/notifications/${notificationId}/read`);
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

export async function markAllNotificationsAsRead() {
  await apiClient.post('/v1/notifications/read-all');
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

export async function fetchUnreadCount() {
  const { data } = await apiClient.get('/v1/notifications/unread-count');
  return data;
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
  });
}
