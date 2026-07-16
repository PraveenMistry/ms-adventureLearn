import Attendance from '../models/Attendance';
import mongoose from 'mongoose';

export class AttendanceService {
  static async logAttendance(classId: string, dateStr: string, records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }[]) {
    // Normalize date to start of day
    const parsedDate = new Date(dateStr);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const formattedRecords = records.map(r => ({
      studentId: new mongoose.Types.ObjectId(r.studentId) as any,
      status: r.status,
      reason: (r as any).reason || ""
    }));

    // Find and update if exists, or insert new
    const attendance = await Attendance.findOneAndUpdate(
      { classId: new mongoose.Types.ObjectId(classId), date: parsedDate },
      { records: formattedRecords },
      { upsert: true, new: true }
    ).exec();

    return attendance;
  }

  static async getClassAttendance(classId: string, startDateStr?: string, endDateStr?: string) {
    const query: any = { classId: new mongoose.Types.ObjectId(classId) };

    if (startDateStr || endDateStr) {
      query.date = {};
      if (startDateStr) {
        const start = new Date(startDateStr);
        start.setUTCHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDateStr) {
        const end = new Date(endDateStr);
        end.setUTCHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    return Attendance.find(query).sort({ date: 1 }).exec();
  }

  static async getStudentAttendance(studentId: string) {
    return Attendance.find({
      'records.studentId': new mongoose.Types.ObjectId(studentId)
    }).sort({ date: 1 }).exec();
  }

  static async updateStudentAttendanceReason(studentId: string, dateStr: string, reason: string) {
    const parsedDate = new Date(dateStr);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      date: parsedDate,
      'records.studentId': new mongoose.Types.ObjectId(studentId)
    }).exec();

    if (!attendance) {
      throw new Error('No attendance record found for this date');
    }

    attendance.records = attendance.records.map((r: any) => {
      if (r.studentId.toString() === studentId) {
        r.reason = reason;
      }
      return r;
    });

    return attendance.save();
  }
}
