import { Request, Response } from 'express';
import { WorldFactService } from '../services/WorldFactService';

export class WorldFactController {
  static async getAll(req: Request, res: Response) {
    try {
      const childId = req.query.childId as string | undefined;
      const facts = await WorldFactService.getAllFacts(childId);
      res.json(facts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { question, answer, options, emoji } = req.body;
      if (!question || !answer || !options || !Array.isArray(options)) {
        res.status(400).json({ message: 'Question, answer, and options array are required' });
        return;
      }
      const teacherId = (req as any).user?.id;
      const newFact = await WorldFactService.createFact(question, answer, options, emoji, teacherId);
      res.status(201).json(newFact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await WorldFactService.deleteFact(req.params.id);
      if (!result) {
        res.status(404).json({ message: 'Fact not found' });
        return;
      }
      res.json({ message: 'Fact deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
