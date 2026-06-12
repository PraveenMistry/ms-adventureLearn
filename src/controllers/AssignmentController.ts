import { Request, Response } from 'express';
import { AssignmentService } from '../services/AssignmentService';

export class AssignmentController {
  static async create(req: Request, res: Response) {
    try {
      const assignment = await AssignmentService.create(req.body);
      res.status(201).json(assignment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findByClass(req: Request, res: Response) {
    try {
      const assignments = await AssignmentService.findByClass(req.params.classId);
      res.json(assignments);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await AssignmentService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
