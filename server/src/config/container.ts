import type { UserRepository } from '../domain/repositories/user';
import { userStore } from '../adapters/repositories/user/store';

export interface AppContainer {
  userRepository: UserRepository;
}

export const createContainer = (): AppContainer => {
  return {
    userRepository: {
      create: async (user) => userStore.create(user),
      findAll: async () => userStore.findAll(),
      findById: async (id) => userStore.findById(id),
      update: async (id, user) => userStore.update(id, user),
    },
  };
};
