import apiClient from './client';
import type {
  CreateReservationPayload,
  PaginatedResponse,
  Reservation,
} from './types';

export const reservationsApi = {
  listByTraining: async (
    trainingId: string
  ): Promise<PaginatedResponse<Reservation>> => {
    const { data } = await apiClient.get<PaginatedResponse<Reservation>>(
      `/trainings/${trainingId}/reservations`
    );
    return data;
  },

  create: async (
    trainingId: string,
    payload: CreateReservationPayload
  ): Promise<Reservation> => {
    const { data } = await apiClient.post<Reservation>(
      `/trainings/${trainingId}/reservations`,
      payload
    );
    return data;
  },

  remove: async (trainingId: string, reservationId: string): Promise<void> => {
    await apiClient.delete(
      `/trainings/${trainingId}/reservations/${reservationId}`
    );
  },
};