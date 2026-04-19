import { userStore } from '../adapters/repositories/user/store';
import type { UserRepository } from '../domain/repositories/user';

export interface AppContainer {
  userRepository: UserRepository;
}

export const createContainer = (): AppContainer => {
  return {
    userRepository: {
      create: (user) => Promise.resolve(userStore.create(user)),
      findAll: () => Promise.resolve(userStore.findAll()),
      findById: (id) => Promise.resolve(userStore.findById(id)),
      update: (id, user) => Promise.resolve(userStore.update(id, user)),
    },
  };
};
