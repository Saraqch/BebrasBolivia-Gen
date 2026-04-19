import type { UserEntity } from '../../entities/user';
import type { UserRepository } from '../../repositories/user';
import { generateId } from '../../../utils/script';

export interface CreateUserInput {
  email: string;
  name: string;
  role?: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  role?: string;
}

export const createUserService = async (
  repository: UserRepository,
  input: CreateUserInput,
): Promise<UserEntity> => {
  const user: UserEntity = {
    createdAt: new Date(),
    email: input.email.trim().toLowerCase(),
    id: generateId(),
    name: input.name.trim(),
    role: input.role,
    updatedAt: new Date(),
  };

  return repository.create(user);
};

export const updateUserService = async (
  repository: UserRepository,
  id: string,
  input: UpdateUserInput,
): Promise<UserEntity | null> => {
  return repository.update(id, {
    email: input.email?.trim().toLowerCase(),
    name: input.name?.trim(),
    role: input.role,
    updatedAt: new Date(),
  });
};

export const listUsersService = async (repository: UserRepository): Promise<UserEntity[]> => {
  return repository.findAll();
};
