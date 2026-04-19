import type { UserEntity } from '../../../domain/entities/user';

import { userStore } from './store';

export const updateUserRepository = (
  id: string,
  patch: Partial<UserEntity>,
): Promise<UserEntity | null> => {
  return Promise.resolve(userStore.update(id, patch));
};
