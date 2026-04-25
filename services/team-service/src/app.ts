import express, { type Request, type Response } from 'express';

import { env } from './config/env';
import { teamRouter } from './modules/team/presentation/http/teamRouter';
import { errorHandler } from './shared/http/errorHandler';
import { notFoundHandler } from './shared/http/notFoundHandler';

export const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    service: env.serviceName,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use(teamRouter);
app.use(notFoundHandler);
app.use(errorHandler);
