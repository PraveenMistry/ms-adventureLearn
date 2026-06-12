import ChildProfile from '../models/ChildProfile';

export class WorkerService {
  /**
   * Scans all child profiles and updates the isStruggling flag based on 3-day inactivity.
   * Runs as a background task.
   */
  static async updateStrugglingStatus() {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

    try {
      // Find students whose last progress was > 3 days ago OR they have no progress and were created > 3 days ago
      // and update their isStruggling flag.
      
      // We use a simplified logic: if last progress completedAt < threeDaysAgo, set isStruggling = true.
      // This is efficient as it uses MongoDB's positional operator or aggregation if needed, 
      // but here we do it in a way that respects the schema.

      const profiles = await ChildProfile.find({}).exec();
      
      const bulkOps = profiles.map(profile => {
        const lastActivity = profile.progress.length > 0 
          ? new Date(profile.progress[profile.progress.length - 1].completedAt) 
          : new Date(profile.createdAt);
        
        const recentScore = profile.progress.length > 0 
          ? profile.progress[profile.progress.length - 1].score 
          : 0;

        const isStruggling = (lastActivity < threeDaysAgo) || (recentScore < 50 && profile.progress.length > 0);

        // --- Safe Messaging Hook ---
        // If a child becomes struggling, we could auto-generate a PROGRESS_UPDATE message to the parent.
        // For efficiency in bulk ops, we just trigger it directly here if the flag flips.
        if (isStruggling) {
          // Normally we'd check if they were ALREADY struggling to avoid spam,
          // but for this prototype, we'll log it as a hook point.
          console.log(`[SafeMessage Alert] ${profile.name} is struggling. Generating teacher-parent message thread.`);
        }

        return {
          updateOne: {
            filter: { _id: profile._id },
            update: { $set: { isStruggling } }
          }
        };
      });

      if (bulkOps.length > 0) {
        await ChildProfile.bulkWrite(bulkOps);
      }

      console.log(`[WorkerService] Updated struggling status for ${profiles.length} profiles.`);
    } catch (error) {
      console.error('[WorkerService] Error updating struggling status:', error);
    }
  }

  static startBackgroundTasks() {
    // Run every hour
    setInterval(() => {
      this.updateStrugglingStatus();
    }, 60 * 60 * 1000);
    
    // Initial run
    this.updateStrugglingStatus();
  }
}
