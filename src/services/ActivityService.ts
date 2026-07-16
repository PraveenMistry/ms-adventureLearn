import Activity, { IActivity, IActivitySession, IActivitySkill } from '../models/Activity';
import ChildProfile from '../models/ChildProfile';
import { ProfileService } from './ProfileService';
import mongoose from 'mongoose';

export class ActivityService {
  /**
   * Add a new extracurricular activity for a child profile.
   */
  static async addActivity(
    childId: string,
    name: string,
    coachName?: string,
    schedule?: string,
    currentLevel?: string,
    levelColor?: string,
    skills: IActivitySkill[] = [],
    user?: { id: string; role: string }
  ) {
    // Secure check
    if (user) {
      await ProfileService.findOneSecure(childId, user);
    } else {
      const profile = await ChildProfile.findById(childId).exec();
      if (!profile) throw new Error('Child profile not found');
    }

    const newActivity = new Activity({
      childId: new mongoose.Types.ObjectId(childId),
      name,
      coachName,
      schedule,
      currentLevel,
      levelColor: levelColor || 'info',
      skills,
      sessions: []
    });

    return await newActivity.save();
  }

  /**
   * Get all extracurricular activities for a child.
   */
  static async getActivities(childId: string, user: { id: string; role: string }) {
    // Secure check
    await ProfileService.findOneSecure(childId, user);

    return await Activity.find({ childId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Log a new session/attendance check-in for an activity.
   */
  static async addSession(
    activityId: string,
    status: 'ATTENDED' | 'ABSENT' | 'LATE',
    date: Date = new Date(),
    topic?: string,
    notes?: string,
    user?: { id: string; role: string }
  ) {
    const activity = await Activity.findById(activityId).exec();
    if (!activity) throw new Error('Activity not found');

    // Secure check
    if (user) {
      await ProfileService.findOneSecure(activity.childId.toString(), user);
    }

    const newSession: IActivitySession = {
      date,
      status,
      topic: topic || '',
      notes: notes || ''
    };

    activity.sessions.push(newSession);
    return await activity.save();
  }

  /**
   * Update skill percentages for an activity.
   */
  static async updateSkills(
    activityId: string,
    skills: IActivitySkill[],
    user?: { id: string; role: string }
  ) {
    const activity = await Activity.findById(activityId).exec();
    if (!activity) throw new Error('Activity not found');

    // Secure check
    if (user) {
      await ProfileService.findOneSecure(activity.childId.toString(), user);
    }

    activity.skills = skills;
    return await activity.save();
  }

  /**
   * Update header metadata (name, coach, level, schedule, etc.)
   */
  static async updateActivityHeader(
    activityId: string,
    updateFields: {
      name?: string;
      coachName?: string;
      schedule?: string;
      currentLevel?: string;
      levelColor?: string;
    },
    user?: { id: string; role: string }
  ) {
    const activity = await Activity.findById(activityId).exec();
    if (!activity) throw new Error('Activity not found');

    // Secure check
    if (user) {
      await ProfileService.findOneSecure(activity.childId.toString(), user);
    }

    if (updateFields.name !== undefined) activity.name = updateFields.name;
    if (updateFields.coachName !== undefined) activity.coachName = updateFields.coachName;
    if (updateFields.schedule !== undefined) activity.schedule = updateFields.schedule;
    if (updateFields.currentLevel !== undefined) activity.currentLevel = updateFields.currentLevel;
    if (updateFields.levelColor !== undefined) activity.levelColor = updateFields.levelColor;

    return await activity.save();
  }

  /**
   * Delete an extracurricular activity.
   */
  static async deleteActivity(activityId: string, user: { id: string; role: string }) {
    const activity = await Activity.findById(activityId).exec();
    if (!activity) throw new Error('Activity not found');

    // Secure check
    await ProfileService.findOneSecure(activity.childId.toString(), user);

    return await Activity.findByIdAndDelete(activityId).exec();
  }
}
