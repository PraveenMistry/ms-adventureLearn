import { Request, Response } from 'express';
import { AttendanceService } from '../services/AttendanceService';

export class AttendanceController {
  static async log(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const { date, records } = req.body;
      if (!classId || !date || !records) {
        return res.status(400).json({ message: 'Missing classId, date, or records' });
      }
      const attendance = await AttendanceService.logAttendance(classId, date, records);
      res.status(201).json(attendance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const { startDate, endDate } = req.query;
      const attendance = await AttendanceService.getClassAttendance(
        classId, 
        startDate as string | undefined, 
        endDate as string | undefined
      );
      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getStudent(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const attendance = await AttendanceService.getStudentAttendance(studentId);
      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateReason(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { date, reason } = req.body;
      if (!studentId || !date || !reason) {
        return res.status(400).json({ message: 'Missing studentId, date, or reason' });
      }
      const attendance = await AttendanceService.updateStudentAttendanceReason(studentId, date, reason);
      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
