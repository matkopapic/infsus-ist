import apiClient from './client';
import type { TrainerOption } from './types';

export const trainersApi = {
  list: async (): Promise<TrainerOption[]> => {
    const { data } = await apiClient.get<TrainerOption[]>('/trainers');
    return data;
  },
};