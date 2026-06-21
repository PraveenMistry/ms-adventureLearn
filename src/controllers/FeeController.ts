import { Request, Response } from 'express';
import { FeeService } from '../services/FeeService';

export class FeeController {
  static async create(req: Request, res: Response) {
    try {
      const teacherId = (req as any).user.id;
      const { classId, title, amount, dueDate, studentId } = req.body;
      
      if (!classId || !title || !amount || !dueDate) {
        return res.status(400).json({ message: 'Missing required fields: classId, title, amount, dueDate' });
      }

      const fees = await FeeService.createFee(classId, teacherId, title, amount, new Date(dueDate), studentId);
      res.status(201).json(fees);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findByClass(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const fees = await FeeService.getClassFees(classId);
      res.json(fees);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async toggleStatus(req: Request, res: Response) {
    try {
      const teacherId = (req as any).user.id;
      const { id } = req.params;
      const { status } = req.body;
      const updated = await FeeService.toggleFeeStatus(id, teacherId, status);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const teacherId = (req as any).user.id;
      const { id } = req.params;
      await FeeService.deleteFee(id, teacherId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findByChild(req: Request, res: Response) {
    try {
      const parentId = (req as any).user.id;
      const { childId } = req.params;
      const fees = await FeeService.getChildFees(childId, parentId);
      res.json(fees);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
