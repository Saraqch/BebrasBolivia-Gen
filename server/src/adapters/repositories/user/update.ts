import type { UserEntity } from '../../../domain/entities/user';

import { userStore } from './store';

export const updateUserRepository = (
  id: string,
  patch: Partial<UserEntity>,
): Promise<UserEntity | null> => {
  return userStore.update(id, patch);
};
