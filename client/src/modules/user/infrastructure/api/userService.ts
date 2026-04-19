import { createHttpClient } from '@/shared/infrastructure/http/HttpClient';
import type { UserViewModel } from '../domain/UserViewModel';

const httpClient = createHttpClient();

export const userApiService = {
  list: async (): Promise<UserViewModel[]> => {
    return httpClient.get<UserViewModel[]>('/user/getAll');
  },

  create: async (payload: Omit<UserViewModel, 'id'>): Promise<UserViewModel> => {
    return httpClient.post<UserViewModel, Omit<UserViewModel, 'id'>>(
      '/user/create',
      payload,
    );
  },

  update: async (
    payload: Partial<UserViewModel> & { id: string },
  ): Promise<UserViewModel | null> => {
    return httpClient.put<UserViewModel | null, Partial<UserViewModel> & { id: string }>(
      '/user/update',
      payload,
    );
  },
};
