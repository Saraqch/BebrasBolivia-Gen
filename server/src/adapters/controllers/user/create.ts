import type { UserEntity } from '../../../domain/entities/user';
import type { UserRepository } from '../../../domain/repositories/user';
import { createUser } from '../../../domain/services/user/create';

export interface CreateUserInput {
  email: string;
  name: string;
  role?: string;
}

export const createUserController = async (
  repository: UserRepository,
  input: CreateUserInput,
): Promise<UserEntity> => {
  return createUser(repository, input);
};
