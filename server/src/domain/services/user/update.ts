import type { UserRepository } from '../../repositories/user';

import type { UpdateUserInput } from './services';
import { updateUserService } from './services';

export const updateUser = (
  repository: UserRepository,
  id: string,
  input: UpdateUserInput,
) => {
  return updateUserService(repository, id, input);
};
