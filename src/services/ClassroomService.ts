import Classroom from '../models/Classroom';
import ChildProfile from '../models/ChildProfile';

export class ClassroomService {
  static async create(teacherId: string, name: string) {
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newClass = new Classroom({ teacherId, name, classCode });
    return newClass.save();
  }

  static async findAllByTeacher(teacherId: string) {
    return Classroom.find({ teacherId }).populate('students').exec();
  }

  static async addStudentByCode(classCode: string, studentId: string) {
    const classroom = await Classroom.findOne({ classCode }).exec();
    if (!classroom) throw new Error('Classroom not found');
    
    if (!classroom.students.includes(studentId as any)) {
      classroom.students.push(studentId as any);
      await classroom.save();
    }
    return classroom;
  }

  static async bulkAddStudents(classCode: string, teacherId: string, studentsData: { name: string; age: number; avatarUrl?: string; loginPin?: string }[]) {
    const classroom = await Classroom.findOne({ classCode }).exec();
    if (!classroom) throw new Error('Classroom not found');

    const createdProfiles = [];
    const studentIds = [];

    for (const data of studentsData) {
      const pin = data.loginPin || Math.floor(1000 + Math.random() * 9000).toString();
      const profile = new ChildProfile({
        name: data.name,
        age: data.age,
        parentId: teacherId, // Assuming teacher manages year groups for now
        avatarUrl: data.avatarUrl || '🦊',
        loginPin: pin
      });
      const saved = await profile.save();
      createdProfiles.push(saved);
      studentIds.push(saved._id);
    }

    // Update classroom with all new student IDs
    await Classroom.updateOne(
      { _id: classroom._id },
      { $addToSet: { students: { $each: studentIds } } }
    );

    return createdProfiles;
  }

  static async delete(classId: string) {
    return Classroom.findByIdAndDelete(classId).exec();
  }

  static async removeStudent(classId: string, studentId: string) {
    return Classroom.findByIdAndUpdate(
      classId,
      { $pull: { students: studentId } },
      { new: true }
    ).exec();
  }

  static async getClassAnalytics(classId: string) {
    const classroom = await Classroom.findById(classId).populate('students').exec();
    if (!classroom) throw new Error('Classroom not found');

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

    const analytics = (classroom.students as any[]).map((student: any) => {
      const recentProgress = student.progress.length > 0 ? student.progress[student.progress.length - 1] : null;
      const lastActivity = recentProgress ? new Date(recentProgress.completedAt) : new Date(student.createdAt);
      
      const isInactive3Days = lastActivity < threeDaysAgo;
      const recentScore = recentProgress ? recentProgress.score : 0;

      let ragStatus: 'RED' | 'AMBER' | 'GREEN' = 'GREEN';
      
      if (isInactive3Days || recentScore < 50) {
        ragStatus = 'RED';
      } else if (recentScore < 80 || (now.getTime() - lastActivity.getTime()) > (24 * 60 * 60 * 1000)) {
        ragStatus = 'AMBER';
      }

      return {
        _id: student._id,
        name: student.name,
        totalStars: student.starCoins,
        modulesCompleted: student.progress.length,
        recentScore: recentScore,
        loginPin: student.loginPin,
        ragStatus,
        lastActivity,
        isStruggling: isInactive3Days || (recentScore < 50 && student.progress.length > 3)
      };
    });

    return analytics;
  }

  static async findByCode(classCode: string) {
    const classroom = await Classroom.findOne({ classCode: classCode.toUpperCase() }).populate('students').exec();
    if (!classroom) throw new Error('Invalid Class Code');
    return classroom;
  }
}
