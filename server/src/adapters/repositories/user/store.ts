import type { UserEntity } from '../../../domain/entities/user';

const users = new Map<string, UserEntity>();

export const userStore = {
  create: (user: UserEntity): UserEntity => {
    users.set(user.id, user);
    return user;
  },
  findAll: (): UserEntity[] => {
    return [...users.values()];
  },
  findById: (id: string): UserEntity | null => {
    return users.get(id) ?? null;
  },
  update: (id: string, patch: Partial<UserEntity>): UserEntity | null => {
    const existing = users.get(id);

    if (!existing) {
      return null;
    }

    const updated: UserEntity = {
      ...existing,
      ...patch,
      updatedAt: new Date(),
    };

    users.set(id, updated);
    return updated;
  },
};
