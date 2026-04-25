import { type UserRepository } from '../application/UserRepository';
import { type User } from '../domain/User';

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  public findAll(): User[] {
    return [...this.users.values()];
  }

  public findById(id: string): User | undefined {
    return this.users.get(id);
  }

  public save(user: User): User {
    this.users.set(user.id, user);
    return user;
  }
}
