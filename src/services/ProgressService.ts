import ChildProfile from '../models/ChildProfile';
import Reward from '../models/Reward';
import { ProfileService } from './ProfileService';

export class ProgressService {
  static async logProgress(childId: string, moduleName: string, level: number, score: number) {
    const completedAt = new Date();
    const updatedProfile = await ChildProfile.findByIdAndUpdate(childId, {
      $push: { progress: { moduleName, level, score, completedAt } },
      $inc: { starCoins: Math.floor(score / 10) },
    }, { new: true });

    if (!updatedProfile) throw new Error('Profile not found');

    if (score >= 100) {
      const existingReward = await Reward.findOne({ childId, rewardType: 'GOLD_BADGE', 'metadata.moduleName': moduleName });
      if (!existingReward) {
        const reward = new Reward({
          childId,
          rewardType: 'GOLD_BADGE',
          earnedAt: new Date(),
          metadata: { moduleName, level },
        });
        await reward.save();
      }
    }

    // Return the profile with recalculated unlock statuses
    return ProfileService.attachUnlockStatus(updatedProfile);
  }

  static async getChildRewards(childId: string) {
    return Reward.find({ childId }).exec();
  }

  static async getChildProgress(childId: string) {
    const profile = await ChildProfile.findById(childId).select('progress').exec();
    return profile ? profile.progress : [];
  }
}
