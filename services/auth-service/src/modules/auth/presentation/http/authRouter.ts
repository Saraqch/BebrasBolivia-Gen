import { Router, type Request, type Response } from 'express';

import { login, type LoginPayload } from '../../application/login';

export const authRouter = Router();

authRouter.post('/auth/login', (req: Request<unknown, unknown, LoginPayload>, res: Response) => {
  try {
    const session = login(req.body ?? {});
    res.status(200).json(session);
  } catch (error) {
    if (error instanceof Error && error.message === 'email and password are required') {
      res.status(400).json({ message: error.message, status: 'error' });
      return;
    }

    throw error;
  }
});
