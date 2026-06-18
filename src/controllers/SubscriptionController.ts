import { Request, Response } from 'express';
import MembershipPlan from '../models/MembershipPlan';
import Subscription from '../models/Subscription';
import User from '../models/User';

export class SubscriptionController {
  static async getPlans(req: Request, res: Response) {
    try {
      const plans = await MembershipPlan.find({ isActive: true });
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch plans' });
    }
  }

  static async subscribe(req: Request, res: Response) {
    try {
      const { userId, planId, paymentId } = req.body;
      const plan = await MembershipPlan.findById(planId);
      if (!plan) return res.status(404).json({ message: 'Plan not found' });

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.durationMonths);

      const subscription = new Subscription({
        userId,
        planId,
        endDate,
        paymentId,
        status: 'ACTIVE'
      });

      await subscription.save();

      await User.findByIdAndUpdate(userId, { subscription: subscription._id });

      res.status(201).json(subscription);
    } catch (error) {
      res.status(500).json({ message: 'Subscription failed' });
    }
  }

  static async grantAccess(req: Request, res: Response) {
    const { userId, planId } = req.body;
    
    try {
      const plan = await MembershipPlan.findById(planId);
      if (!plan) return res.status(404).json({ message: 'Plan not found' });

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.durationMonths);

      const subscription = await Subscription.findOneAndUpdate(
        { userId },
        { 
          planId, 
          endDate, 
          status: 'ACTIVE',
          paymentId: 'ADMIN_GRANTED'
        },
        { upsert: true, new: true }
      );

      await User.findByIdAndUpdate(userId, { subscription: subscription._id });

      res.json({ message: 'Access granted successfully', subscription });
    } catch (error) {
      res.status(500).json({ message: 'Grant failed' });
    }
  }

  static async getStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await User.findById(userId).populate({
        path: 'subscription',
        populate: { path: 'planId' }
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user.subscription || null);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch status' });
    }
  }
}
