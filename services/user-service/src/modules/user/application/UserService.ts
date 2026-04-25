import { randomUUID } from 'node:crypto';

import { type CreateUserPayload, type UpdateUserPayload, type User } from '../domain/User';

import { type UserRepository } from './UserRepository';

export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  public createUser(payload: CreateUserPayload): User {
    const { email, name } = payload;

    if (!email || !name) {
      throw new Error('name and email are required');
    }

    const now = new Date().toISOString();
    const user: User = {
      createdAt: now,
      email,
      id: randomUUID(),
      name,
      updatedAt: now,
    };

    return this.userRepository.save(user);
  }

  public getAllUsers(): User[] {
    return this.userRepository.findAll();
  }

  public updateUser(payload: UpdateUserPayload): User {
    const { email, id, name } = payload;

    if (!id) {
      throw new Error('id is required');
    }

    const existing = this.userRepository.findById(id);

    if (!existing) {
      throw new Error('user not found');
    }

    return this.userRepository.save({
      ...existing,
      email: email ?? existing.email,
      name: name ?? existing.name,
      updatedAt: new Date().toISOString(),
    });
  }
}
