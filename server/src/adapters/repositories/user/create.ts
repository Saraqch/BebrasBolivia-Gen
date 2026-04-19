import type { UserEntity } from '../../../domain/entities/user';

import { userStore } from './store';

export const createUserRepository = (user: UserEntity): Promise<UserEntity> => {
  return userStore.create(user);
};
