import { Request, Response } from 'express';
import { BadgeService } from '../services/BadgeService';

export class BadgeController {
  static async create(req: Request, res: Response) {
    try {
      const teacherId = (req as any).user.id;
      const badge = await BadgeService.create(teacherId, req.body);
      res.status(201).json(badge);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const badges = await BadgeService.findAll();
      res.json(badges);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await BadgeService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
