import ChildProfile from '../models/ChildProfile';
import Reward from '../models/Reward';
import PortfolioItem from '../models/PortfolioItem';
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

    // Auto-create portfolio item for Quest Completion
    try {
      await PortfolioItem.create({
        childId,
        type: 'QUEST_COMPLETE',
        title: `Completed ${moduleName} Level ${level} 🗺️`,
        description: `Successfully finished the mission with a score of ${score}% and earned ${starsToAward} Star Coins!`,
        date: completedAt,
        meta: { moduleName, level, score }
      });
    } catch (err) {
      console.error('Failed to log quest portfolio item:', err);
    }

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
        
        // Log Gold Badge to portfolio
        try {
          await PortfolioItem.create({
            childId,
            type: 'BADGE',
            title: `Gold Badge: ${moduleName} 🏅`,
            description: `Earned perfect score of 100% on ${moduleName}!`,
            date: new Date(),
            meta: { rewardType: 'GOLD_BADGE', moduleName, level }
          });
        } catch (err) {
          console.error('Failed to log badge portfolio item:', err);
        }
        
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

         // Log Daily Hero Certificate to portfolio
         try {
           await PortfolioItem.create({
             childId,
             type: 'CERTIFICATE',
             title: `Daily Challenge Champion! 🏆`,
             description: `Successfully accomplished the challenge: "${dailyChallenge?.desc}"!`,
             date: new Date(),
             meta: { rewardType: 'DAILY_HERO', date: today }
           });
         } catch (err) {
           console.error('Failed to log daily challenge certificate to portfolio:', err);
         }
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
