import WorldFact from '../models/WorldFact';
import Classroom from '../models/Classroom';

export class WorldFactService {
  static async getAllFacts(childId?: string) {
    if (childId) {
      // Find if child is in a classroom
      const classroom = await Classroom.findOne({ students: childId }).exec();
      if (classroom && classroom.teacherId) {
        // Return global facts OR facts created by this student's teacher
        return WorldFact.find({
          $or: [
            { teacherId: { $exists: false } },
            { teacherId: null },
            { teacherId: classroom.teacherId }
          ]
        }).sort({ createdAt: -1 }).exec();
      }
    }

    // Default: return only global facts
    return WorldFact.find({
      $or: [
        { teacherId: { $exists: false } },
        { teacherId: null }
      ]
    }).sort({ createdAt: -1 }).exec();
  }

  static async createFact(question: string, answer: string, options: string[], emoji: string, teacherId?: string) {
    const fact = new WorldFact({
      question,
      answer,
      options,
      emoji: emoji || '🌍',
      teacherId
    });
    return fact.save();
  }

  static async deleteFact(id: string) {
    return WorldFact.findByIdAndDelete(id).exec();
  }
}
