import { Router, type Request, type Response } from 'express';

import { UserService } from '../../application/UserService';
import { type CreateUserPayload, type UpdateUserPayload } from '../../domain/User';
import { InMemoryUserRepository } from '../../infrastructure/InMemoryUserRepository';

export const userRouter = Router();

const userService = new UserService(new InMemoryUserRepository());

userRouter.post('/user/create', (req: Request<unknown, unknown, CreateUserPayload>, res: Response) => {
  try {
    const user = userService.createUser(req.body ?? {});
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error && error.message === 'name and email are required') {
      res.status(400).json({ message: error.message, status: 'error' });
      return;
    }

    throw error;
  }
});

userRouter.get('/user/getAll', (_req: Request, res: Response) => {
  res.status(200).json(userService.getAllUsers());
});

userRouter.put('/user/update', (req: Request<unknown, unknown, UpdateUserPayload>, res: Response) => {
  try {
    const user = userService.updateUser(req.body ?? {});
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.message === 'id is required') {
      res.status(400).json({ message: error.message, status: 'error' });
      return;
    }

    if (error instanceof Error && error.message === 'user not found') {
      res.status(404).json({ message: error.message, status: 'error' });
      return;
    }

    throw error;
  }
});
