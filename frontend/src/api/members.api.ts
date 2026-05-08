import apiClient from './client';
import type { ListMembersQuery, MemberOption } from './types';

export const membersApi = {
  list: async (query: ListMembersQuery = {}): Promise<MemberOption[]> => {
    const { data } = await apiClient.get<MemberOption[]>('/members', {
      params: query,
    });
    return data;
  },
};