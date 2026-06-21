import { Request, Response } from 'express';
import { SchoolService } from '../services/SchoolService';

export class SchoolController {
  static async addTeacher(req: Request, res: Response) {
    try {
      const principalId = (req as any).user.id;
      const { email, password, phoneNumber } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const teacher = await SchoolService.addTeacher(principalId, email, password, phoneNumber);
      res.status(201).json({
        id: teacher._id,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
        role: teacher.role
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getTeachers(req: Request, res: Response) {
    try {
      const principalId = (req as any).user.id;
      const teachers = await SchoolService.getTeachers(principalId);
      res.json(teachers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const principalId = (req as any).user.id;
      const stats = await SchoolService.getSchoolStats(principalId);
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
