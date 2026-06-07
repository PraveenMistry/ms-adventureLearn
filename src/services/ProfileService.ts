import mongoose from 'mongoose';
import ChildProfile from '../models/ChildProfile';
import Classroom from '../models/Classroom';

const SHOP_ITEMS = [
  { id: 'base-fox', name: 'Original Fox', emoji: '🦊', cost: 0, type: 'skin' },
  { id: 'cool-bear', name: 'Cool Bear', emoji: '🐻', cost: 100, type: 'skin' },
  { id: 'space-cat', name: 'Space Cat', emoji: '🐱‍🚀', cost: 250, type: 'skin' },
  { id: 'wizard-hat', name: 'Wizard Hat', emoji: '🧙‍♂️', cost: 150, type: 'hat' },
  { id: 'crown', name: 'Royal Crown', emoji: '👑', cost: 500, type: 'hat' },
];

export class ProfileService {
  static async create(parentId: string, data: any) {
    const newProfile = new ChildProfile({ ...data, parentId });
    const saved = await newProfile.save();
    return this.attachUnlockStatus(saved);
  }

  static async findAllByParent(parentId: string) {
    const profiles = await ChildProfile.find({ parentId }).exec();
    return profiles.map(p => this.attachUnlockStatus(p));
  }

  static async findOne(id: string) {
    const profile = await ChildProfile.findById(id).exec();
    if (!profile) throw new Error('Profile not found');
    return this.attachUnlockStatus(profile);
  }

  static calculateStreak(profile: any) {
    const progress = profile.progress || [];
    const moodLogs = profile.moodLogs || [];
    
    const dates = new Set<string>();
    progress.forEach((p: any) => {
      if (p.completedAt) dates.add(new Date(p.completedAt).toISOString().split('T')[0]);
    });
    moodLogs.forEach((m: any) => {
      if (m.date) dates.add(new Date(m.date).toISOString().split('T')[0]);
    });
    
    if (dates.size === 0) return 0;

    const sortedDates = Array.from(dates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    let today = new Date().toISOString().split('T')[0];
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesterdayStr = yesterday.toISOString().split('T')[0];

    if (sortedDates[0] !== today && sortedDates[0] !== yesterdayStr) return 0;

    let current = new Date(sortedDates[0]);
    for (let i = 0; i < sortedDates.length; i++) {
       const d = new Date(sortedDates[i]);
       const diff = Math.round((current.getTime() - d.getTime()) / (1000 * 3600 * 24));
       
       if (diff <= 1) {
          if (diff === 1) streak++;
          else if (i === 0) streak = 1;
          current = d;
       } else {
          break;
       }
    }

    return streak;
  }

  static attachUnlockStatus(profile: any) {
    const p = profile.toObject ? profile.toObject() : profile;
    const progress = p.progress || [];
    
    const isCompleted = (name: string) => {
      return progress.some((pr: any) => {
        const pName = (pr.moduleName || "").trim().toLowerCase();
        const target = name.trim().toLowerCase();
        return pName === target || pName.includes(target);
      });
    };

    const getBestScore = (name: string) => {
      const target = name.trim().toLowerCase();
      const records = progress.filter((pr: any) => {
        const pName = (pr.moduleName || "").trim().toLowerCase();
        return pName === target || pName.includes(target);
      });
      return records.length > 0 ? Math.max(...records.map((r: any) => r.score || 0)) : 0;
    };

    // Day Streak
    p.dayStreak = this.calculateStreak(p);

    // Module Unlocking Logic
    p.unlockedModules = {
      'abc-typing': true,
      'phonics': isCompleted('abc typing') || isCompleted('abc-typing'),
      'numbers': isCompleted('typing quest') || isCompleted('voice volcano') || isCompleted('phonics quest'),
      'art': isCompleted('math mountain') || isCompleted('number world'),
      'world': progress.length >= 8
    };

    // Difficulty Unlocking Logic
    p.unlockedDifficulty = {
      'abc-typing': {
        'easy': true,
        'middle': isCompleted('abc typing - easy') || isCompleted('abc typing'),
        'fast': getBestScore('abc typing - middle') >= 50
      }
    };

    // Shop Items
    p.availableItems = SHOP_ITEMS;

    return p;
  }

  static async logMood(id: string, mood: string) {
    const profile = await ChildProfile.findByIdAndUpdate(
      id,
      { $push: { moodLogs: { mood, date: new Date() } } },
      { new: true }
    ).exec();
    return profile ? this.attachUnlockStatus(profile) : null;
  }

  static async equipItem(id: string, type: 'skin' | 'hat', itemId: string) {
    const update: any = {};
    update[`equippedItems.${type}`] = itemId;
    const profile = await ChildProfile.findByIdAndUpdate(id, { $set: update }, { new: true }).exec();
    return profile ? this.attachUnlockStatus(profile) : null;
  }

  static async buyItem(id: string, itemId: string, cost: number) {
    const profile = await ChildProfile.findOneAndUpdate(
      { _id: id, starCoins: { $gte: cost } },
      { 
        $inc: { starCoins: -cost },
        $addToSet: { unlockedItems: itemId }
      },
      { new: true }
    ).exec();
    return profile ? this.attachUnlockStatus(profile) : null;
  }

  static async updatePin(id: string, newPin: string) {
    const profile = await ChildProfile.findByIdAndUpdate(id, { loginPin: newPin }, { new: true }).exec();
    return profile ? this.attachUnlockStatus(profile) : null;
  }

  static async linkSchoolProfile(parentId: string, classCode: string, studentName: string, loginPin: string) {
    const classroom = await Classroom.findOne({ classCode: classCode.toUpperCase() }).populate('students').exec();
    
    if (!classroom) throw new Error('Invalid Class Code');

    const student = (classroom.students as any[]).find(
      s => s.name.toLowerCase() === studentName.toLowerCase() && s.loginPin === loginPin
    );

    if (!student) throw new Error('Student not found or incorrect PIN');

    const updated = await ChildProfile.findByIdAndUpdate(student._id, { parentId }, { new: true }).exec();
    return this.attachUnlockStatus(updated);
  }
}
