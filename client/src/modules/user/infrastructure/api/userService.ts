import { getEnvConfig } from '../../../../shared/infrastructure/config/env';
import { createHttpClient } from '../../../../shared/infrastructure/http/HttpClient';
import type { UserViewModel } from '../../domain/UserViewModel';

const env = getEnvConfig();
const httpClient = createHttpClient({ baseUrl: env.userServiceUrl });

export const userApiService = {
  list: (): Promise<UserViewModel[]> => {
    return httpClient.get<UserViewModel[]>('/user/getAll');
  },

  create: (payload: Omit<UserViewModel, 'id'>): Promise<UserViewModel> => {
    return httpClient.post<UserViewModel, Omit<UserViewModel, 'id'>>(
      '/user/create',
      payload,
    );
  },

  update: (
    payload: Partial<UserViewModel> & { id: string },
  ): Promise<UserViewModel | null> => {
    return httpClient.put<UserViewModel | null, Partial<UserViewModel> & { id: string }>(
      '/user/update',
      payload,
    );
  },
};
