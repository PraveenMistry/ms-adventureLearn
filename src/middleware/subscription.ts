import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Subscription from '../models/Subscription';

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).populate('subscription');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'TEACHER') {
      const sub = user.subscription as any;
      if (!sub || sub.status !== 'ACTIVE' || new Date(sub.endDate) < new Date()) {
        return res.status(403).json({ 
          message: 'Active membership required', 
          code: 'MEMBERSHIP_REQUIRED' 
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
