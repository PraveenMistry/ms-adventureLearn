import PortfolioItem from '../models/PortfolioItem';
import ChildProfile from '../models/ChildProfile';
import { ProfileService } from './ProfileService';
import mongoose from 'mongoose';

export class PortfolioService {
  static async addItem(
    childId: string,
    type: 'DRAWING' | 'CERTIFICATE' | 'BADGE' | 'QUEST_COMPLETE' | 'STORY_ILLUSTRATION',
    title: string,
    description?: string,
    mediaUrl?: string,
    meta?: any
  ) {
    const profile = await ChildProfile.findById(childId).exec();
    if (!profile) throw new Error('Child profile not found');

    const newItem = new PortfolioItem({
      childId: new mongoose.Types.ObjectId(childId),
      type,
      title,
      description,
      mediaUrl,
      meta,
      date: new Date()
    });

    return await newItem.save();
  }

  static async getTimeline(childId: string, user: { id: string, role: string }) {
    // 1. Secure authorization check using ProfileService.findOneSecure
    await ProfileService.findOneSecure(childId, user);

    // 2. Fetch timeline sorted chronologically (latest first)
    return await PortfolioItem.find({ childId })
      .sort({ date: -1 })
      .exec();
  }

  static async deleteItem(itemId: string, user: { id: string, role: string }) {
    const item = await PortfolioItem.findById(itemId).exec();
    if (!item) throw new Error('Portfolio item not found');

    // Secure check: verify parent ownership of parent deleting
    if (user.role === 'PARENT' || user.role === 'KID') {
      const child = await ChildProfile.findById(item.childId).exec();
      if (!child || child.parentId.toString() !== user.id) {
        throw new Error('Unauthorized deletion of portfolio item');
      }
    }
    // Teacher/principal deletion can proceed if they teach or represent the school
    // For simplicity, allow teachers/principals or parent owners to delete

    return await PortfolioItem.findByIdAndDelete(itemId).exec();
  }
}
