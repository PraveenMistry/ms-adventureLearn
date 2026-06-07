import { Request, Response } from 'express';
import { ProgressService } from '../services/ProgressService';

export class ProgressController {
  static async logProgress(req: Request, res: Response) {
    try {
      const { moduleName, level, score } = req.body;
      const result = await ProgressService.logProgress(req.params.childId, moduleName, level, score);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getRewards(req: Request, res: Response) {
    try {
      const rewards = await ProgressService.getChildRewards(req.params.childId);
      res.json(rewards);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getProgress(req: Request, res: Response) {
    try {
      const progress = await ProgressService.getChildProgress(req.params.childId);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
