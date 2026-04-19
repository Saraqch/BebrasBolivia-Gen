import type { UserEntity } from '../../../domain/entities/user';
import type { UserRepository } from '../../../domain/repositories/user';
import { updateUser } from '../../../domain/services/user/update';

export interface UpdateUserInput {
  email?: string;
  name?: string;
  role?: string;
}

export const updateUserController = async (
  repository: UserRepository,
  id: string,
  input: UpdateUserInput,
): Promise<UserEntity | null> => {
  return updateUser(repository, id, input);
};
