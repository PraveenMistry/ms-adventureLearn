import { Request, Response } from 'express';
import { StoryService } from '../services/StoryService';

export class StoryController {
  static async generate(req: Request, res: Response) {
    try {
      const { theme } = req.body;
      const result = await StoryService.generateStory(req.params.childId, theme);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
