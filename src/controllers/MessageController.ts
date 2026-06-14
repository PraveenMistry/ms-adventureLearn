import { Request, Response } from 'express';
import { MessageService } from '../services/MessageService';

export class MessageController {
  static async send(req: Request, res: Response) {
    try {
      const message = await MessageService.sendMessage(req.body);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getConversation(req: Request, res: Response) {
    try {
      const { user1, user2 } = req.params;
      const messages = await MessageService.getConversation(user1, user2);
      res.json(messages);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const message = await MessageService.markAsRead(req.params.id);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getTeacherParents(req: Request, res: Response) {
    try {
      const parents = await MessageService.getTeacherParents(req.params.teacherId);
      res.json(parents);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
