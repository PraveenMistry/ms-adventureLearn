import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'adventure-admin-2024';
  const adminKey = req.headers['x-admin-key'] || req.body.adminKey;

  if (!adminKey || adminKey !== ADMIN_SECRET_KEY) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Admin Key' });
  }

  next();
};
