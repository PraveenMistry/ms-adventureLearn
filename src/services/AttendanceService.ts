import Attendance from '../models/Attendance';
import mongoose from 'mongoose';

export class AttendanceService {
  static async logAttendance(classId: string, dateStr: string, records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }[]) {
    // Normalize date to start of day
    const parsedDate = new Date(dateStr);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const formattedRecords = records.map(r => ({
      studentId: new mongoose.Types.ObjectId(r.studentId) as any,
      status: r.status
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
}
