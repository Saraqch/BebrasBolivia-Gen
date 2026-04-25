import { type User } from '../domain/User';

export interface UserRepository {
  findAll(): User[];
  findById(id: string): User | undefined;
  save(user: User): User;
}
