import { Request, Response } from 'express';
import { PortfolioService } from '../services/PortfolioService';

export class PortfolioController {
  static async create(req: Request, res: Response) {
    try {
      const { childId, type, title, description, mediaUrl, meta } = req.body;

      if (!childId || !type || !title) {
        return res.status(400).json({ message: 'childId, type, and title are required fields' });
      }

      const item = await PortfolioService.addItem(
        childId,
        type,
        title,
        description,
        mediaUrl,
        meta
      );

      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getTimeline(req: Request, res: Response) {
    try {
      const { childId } = req.params;
      const user = (req as any).user;
      
      const timeline = await PortfolioService.getTimeline(childId, user);
      res.json(timeline);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { itemId } = req.params;
      await PortfolioService.deleteItem(itemId, user);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
