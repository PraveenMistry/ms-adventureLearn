import { Request, Response } from 'express';
import { AssessmentService } from '../services/AssessmentService';

export class AssessmentController {
  static async create(req: Request, res: Response) {
    try {
      const assessment = await AssessmentService.create(req.body);
      res.status(201).json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findByTeacher(req: Request, res: Response) {
    try {
      const assessments = await AssessmentService.findByTeacher(req.params.teacherId);
      res.json(assessments);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const assessment = await AssessmentService.findById(req.params.id);
      res.json(assessment);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await AssessmentService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
