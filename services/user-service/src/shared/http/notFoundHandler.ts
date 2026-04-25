import { type NextFunction, type Request, type Response } from 'express';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    message: `route ${req.method} ${req.originalUrl} not found`,
    status: 'error',
  });
};
