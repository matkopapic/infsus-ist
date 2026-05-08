import apiClient from './client';
import type {
  CreateMembershipPayload,
  ListMembershipsQuery,
  Membership,
  PaginatedResponse,
  UpdateMembershipPayload,
} from './types';

export const membershipsApi = {
  list: async (
    query: ListMembershipsQuery = {}
  ): Promise<PaginatedResponse<Membership>> => {
    const { data } = await apiClient.get<PaginatedResponse<Membership>>(
      '/memberships',
      { params: query }
    );
    return data;
  },

  getById: async (id: string): Promise<Membership> => {
    const { data } = await apiClient.get<Membership>(`/memberships/${id}`);
    return data;
  },

  create: async (payload: CreateMembershipPayload): Promise<Membership> => {
    const { data } = await apiClient.post<Membership>('/memberships', payload);
    return data;
  },

  update: async (
    id: string,
    payload: UpdateMembershipPayload
  ): Promise<Membership> => {
    const { data } = await apiClient.put<Membership>(
      `/memberships/${id}`,
      payload
    );
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/memberships/${id}`);
  },
};