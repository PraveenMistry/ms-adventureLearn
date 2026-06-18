import { Request, Response } from 'express';
import { MessageService } from '../services/MessageService';

export class MessageController {
  static async send(req: Request, res: Response) {
    try {
      const senderId = (req as any).user.id;
      const { receiverId, content, type, studentId } = req.body;
      const message = await MessageService.sendMessage({ senderId, receiverId, content, type, studentId });
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getConversation(req: Request, res: Response) {
    try {
      const user1 = (req as any).user.id;
      const { user2 } = req.params;
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
      const teacherId = (req as any).user.id;
      const parents = await MessageService.getTeacherParents(teacherId);
      res.json(parents);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
