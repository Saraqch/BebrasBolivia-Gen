import type { UserRepository } from '../../repositories/user';

import type { CreateUserInput } from './services';
import { createUserService } from './services';

export const createUser = (repository: UserRepository, input: CreateUserInput) => {
  return createUserService(repository, input);
};
