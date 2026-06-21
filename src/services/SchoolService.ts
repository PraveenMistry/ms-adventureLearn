import User from '../models/User';
import School from '../models/School';
import Classroom from '../models/Classroom';
import bcrypt from 'bcryptjs';

export class SchoolService {
  static async addTeacher(principalId: string, email: string, pass: string, phoneNumber?: string) {
    const school = await School.findOne({ principalId }).exec();
    if (!school) throw new Error('School not found for principal');

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) throw new Error('Email already registered');

    const passwordHash = await bcrypt.hash(pass, 10);
    const newTeacher = new User({
      email,
      passwordHash,
      role: 'TEACHER',
      phoneNumber,
      schoolId: school._id
    });

    return await newTeacher.save();
  }

  static async getTeachers(principalId: string) {
    const school = await School.findOne({ principalId }).exec();
    if (!school) throw new Error('School not found for principal');

    return await User.find({ schoolId: school._id, role: 'TEACHER' })
      .select('email phoneNumber createdAt')
      .exec();
  }

  static async getSchoolStats(principalId: string) {
    const school = await School.findOne({ principalId }).exec();
    if (!school) throw new Error('School not found for principal');

    const teachers = await User.find({ schoolId: school._id, role: 'TEACHER' }).exec();
    const teacherIds = teachers.map(t => t._id);

    const classrooms = await Classroom.find({ teacherId: { $in: teacherIds } })
      .populate('students')
      .exec();

    let totalStudents = 0;
    classrooms.forEach(c => {
      totalStudents += c.students.length;
    });

    return {
      schoolName: school.name,
      totalTeachers: teachers.length,
      totalClasses: classrooms.length,
      totalStudents
    };
  }
}
