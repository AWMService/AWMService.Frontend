import { useQuery } from '@tanstack/react-query';
import { apiClient } from './apiClient';
export const workKeys = {
  all: ['works'],
  myProgress: () => [...workKeys.all, 'my-progress'],
  mySupervised: () => [...workKeys.all, 'my-supervised'],
  defenseStep: () => [...workKeys.all, 'defense-step'],
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
export const fetchMySupervisedWorks = async () => {
  const { data } = await apiClient.get('/works/my-supervised');
  return data;
};
export const useMySupervisedWorks = (options = {}) => {
  return useQuery({
    queryKey: workKeys.mySupervised(),
    queryFn: fetchMySupervisedWorks,
    ...options,
  });
};
export const fetchStudentDefenseStep = async () => {
  const { data } = await apiClient.get('/works/my-defense-step');
  return data;
};
export const useStudentDefenseStep = (options = {}) => {
  return useQuery({
    queryKey: workKeys.defenseStep(),
    queryFn: fetchStudentDefenseStep,
    ...options,
  });
};
