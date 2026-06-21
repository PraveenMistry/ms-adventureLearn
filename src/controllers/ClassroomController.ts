import { Request, Response } from 'express';
import { ClassroomService } from '../services/ClassroomService';

export class ClassroomController {
  static async create(req: Request, res: Response) {
    try {
      const teacherId = (req as any).user.id;
      const { name } = req.body;
      const classroom = await ClassroomService.create(teacherId, name);
      res.status(201).json(classroom);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAllByTeacher(req: Request, res: Response) {
    try {
      const teacherId = (req as any).user.id;
      const role = (req as any).user.role;
      const classrooms = await ClassroomService.findAllByTeacher(teacherId, role);
      res.json(classrooms);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async join(req: Request, res: Response) {
    try {
      const { classCode, studentId } = req.body;
      const classroom = await ClassroomService.addStudentByCode(classCode, studentId);
      res.json(classroom);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async bulkOnboard(req: Request, res: Response) {
    try {
      const teacherId = (req as any).user.id;
      const { classCode, students } = req.body;
      const profiles = await ClassroomService.bulkAddStudents(classCode, teacherId, students);
      res.status(201).json(profiles);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ClassroomService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async removeStudent(req: Request, res: Response) {
    try {
      const { id, studentId } = req.params;
      const classroom = await ClassroomService.removeStudent(id, studentId);
      res.json(classroom);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await ClassroomService.getClassAnalytics(req.params.id);
      res.json(analytics);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findByCode(req: Request, res: Response) {
    try {
      const classroom = await ClassroomService.findByCode(req.params.code);
      res.json(classroom);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}
