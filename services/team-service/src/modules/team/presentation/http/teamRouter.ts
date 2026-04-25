import { Router, type Request, type Response } from 'express';

import { listTeams } from '../../application/listTeams';

export const teamRouter = Router();

teamRouter.get('/teams', (_req: Request, res: Response) => {
  res.status(200).json(listTeams());
});
