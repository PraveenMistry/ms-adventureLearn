import ChildProfile from '../models/ChildProfile';
import Reward from '../models/Reward';
import { ProfileService } from './ProfileService';

export class ProgressService {
  static async logProgress(childId: string, moduleName: string, level: number, score: number) {
    const completedAt = new Date();
    
    // First, let's get the profile BEFORE we add the new progress to check daily challenge
    const currentProfile = await ChildProfile.findById(childId);
    if (!currentProfile) throw new Error('Profile not found');
    
    const profileWithStatus = ProfileService.attachUnlockStatus(currentProfile);
    const dailyChallenge = profileWithStatus.dailyChallenge;
    
    // Calculate stars to award
    let starsToAward = Math.floor(score / 10);
    
    // Check if this new progress completes the daily challenge!
    let challengeCompletedNow = false;
    if (dailyChallenge && !dailyChallenge.completed) {
      if (moduleName.includes(dailyChallenge.targetModule) && score >= dailyChallenge.requiredScore) {
        starsToAward += dailyChallenge.bonus;
        challengeCompletedNow = true;
      }
    }

    const updatedProfile = await ChildProfile.findByIdAndUpdate(childId, {
      $push: { progress: { moduleName, level, score, completedAt } },
      $inc: { starCoins: starsToAward },
    }, { new: true });

    if (!updatedProfile) throw new Error('Profile not found during update');

    // Handle Gold Badges
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
        
        // --- Safe Messaging Hook ---
        console.log(`[SafeMessage Alert] ${updatedProfile.name} earned a Gold Badge in ${moduleName}! Generating teacher-parent message.`);
      }
    }
    
    // If challenge was completed, let's also award a special Daily Challenge badge if they don't have one for today
    if (challengeCompletedNow) {
       const today = new Date().toISOString().split('T')[0];
       const existingDaily = await Reward.findOne({ childId, rewardType: 'DAILY_HERO', 'metadata.date': today });
       if (!existingDaily) {
         const reward = new Reward({
           childId,
           rewardType: 'DAILY_HERO',
           earnedAt: new Date(),
           metadata: { date: today, moduleName },
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
