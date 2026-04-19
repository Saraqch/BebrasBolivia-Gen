import { userStore } from '../adapters/repositories/user/store';
import type { UserRepository } from '../domain/repositories/user';

export interface AppContainer {
  userRepository: UserRepository;
}

export const createContainer = (): AppContainer => {
  return {
    userRepository: {
      create: (user) => userStore.create(user),
      findAll: () => userStore.findAll(),
      findById: (id) => userStore.findById(id),
      update: (id, user) => userStore.update(id, user),
    },
  };
};
