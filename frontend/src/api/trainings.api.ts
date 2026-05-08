import apiClient from './client';
import type {
  CreateTrainingPayload,
  ListTrainingsQuery,
  PaginatedResponse,
  Training,
  UpdateTrainingPayload,
} from './types';

export const trainingsApi = {
  list: async (
    query: ListTrainingsQuery = {}
  ): Promise<PaginatedResponse<Training>> => {
    const { data } = await apiClient.get<PaginatedResponse<Training>>(
      '/trainings',
      { params: query }
    );
    return data;
  },

  getById: async (id: string): Promise<Training> => {
    const { data } = await apiClient.get<Training>(`/trainings/${id}`);
    return data;
  },

  create: async (payload: CreateTrainingPayload): Promise<Training> => {
    const { data } = await apiClient.post<Training>('/trainings', payload);
    return data;
  },

  update: async (
    id: string,
    payload: UpdateTrainingPayload
  ): Promise<Training> => {
    const { data } = await apiClient.put<Training>(`/trainings/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/trainings/${id}`);
  },
};