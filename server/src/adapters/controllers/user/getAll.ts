import type { UserEntity } from '../../../domain/entities/user';
import type { UserRepository } from '../../../domain/repositories/user';
import { listUsersService } from '../../../domain/services/user/services';

export const getAllUsersController = (
  repository: UserRepository,
): Promise<UserEntity[]> => {
  return listUsersService(repository);
};
