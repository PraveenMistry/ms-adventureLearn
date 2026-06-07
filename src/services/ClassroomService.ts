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

  static async getClassAnalytics(classId: string) {
    const classroom = await Classroom.findById(classId).populate('students').exec();
    if (!classroom) throw new Error('Classroom not found');

    const analytics = (classroom.students as any[]).map((student: any) => ({
      _id: student._id,
      name: student.name,
      totalStars: student.starCoins,
      modulesCompleted: student.progress.length,
      recentScore: student.progress.length > 0 ? student.progress[student.progress.length - 1].score : 0,
      loginPin: student.loginPin
    }));

    return analytics;
  }

  static async findByCode(classCode: string) {
    const classroom = await Classroom.findOne({ classCode: classCode.toUpperCase() }).populate('students').exec();
    if (!classroom) throw new Error('Invalid Class Code');
    return classroom;
  }
}
