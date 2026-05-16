import { useQuery } from '@tanstack/react-query';
import { apiClient } from './apiClient';

export const workKeys = {
  all: ['works'],
  myProgress: () => [...workKeys.all, 'my-progress'],
};

export const fetchMyWorkProgress = async () => {
  const { data } = await apiClient.get('/works/my-progress');
  return data;
};

export const useMyWorkProgress = (options = {}) => {
  return useQuery({
    queryKey: workKeys.myProgress(),
    queryFn: fetchMyWorkProgress,
    ...options,
  });
};
