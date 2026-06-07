import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';

export class ProfileController {
  static async create(req: Request, res: Response) {
    try {
      const { parentId, ...data } = req.body;
      const profile = await ProfileService.create(parentId, data);
      res.status(201).json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAllByParent(req: Request, res: Response) {
    try {
      const profiles = await ProfileService.findAllByParent(req.params.parentId);
      res.json(profiles);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findOne(req: Request, res: Response) {
    try {
      const profile = await ProfileService.findOne(req.params.id);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async logMood(req: Request, res: Response) {
    try {
      const profile = await ProfileService.logMood(req.params.id, req.body.mood);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async equip(req: Request, res: Response) {
    try {
      const { type, itemId } = req.body;
      const profile = await ProfileService.equipItem(req.params.id, type, itemId);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async buy(req: Request, res: Response) {
    try {
      const { itemId, cost } = req.body;
      const profile = await ProfileService.buyItem(req.params.id, itemId, cost);
      if (!profile) return res.status(400).json({ message: 'Insufficient stars or item already owned' });
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updatePin(req: Request, res: Response) {
    try {
      const profile = await ProfileService.updatePin(req.params.id, req.body.loginPin);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async linkSchoolProfile(req: Request, res: Response) {
    try {
      const { classCode, studentName, loginPin } = req.body;
      const parentId = (req as any).user.id;
      const profile = await ProfileService.linkSchoolProfile(parentId, classCode, studentName, loginPin);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
