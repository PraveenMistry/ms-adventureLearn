import { Request, Response } from 'express';
import { ActivityService } from '../services/ActivityService';

export class ActivityController {
  static async create(req: Request, res: Response) {
    try {
      const { childId, name, coachName, schedule, currentLevel, levelColor, skills } = req.body;
      const user = (req as any).user;

      if (!childId || !name) {
        return res.status(400).json({ message: 'childId and name are required fields' });
      }

      const activity = await ActivityService.addActivity(
        childId,
        name,
        coachName,
        schedule,
        currentLevel,
        levelColor,
        skills,
        user
      );

      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getByChild(req: Request, res: Response) {
    try {
      const { childId } = req.params;
      const user = (req as any).user;

      const activities = await ActivityService.getActivities(childId, user);
      res.json(activities);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async addSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, date, topic, notes } = req.body;
      const user = (req as any).user;

      if (!status) {
        return res.status(400).json({ message: 'status is a required field' });
      }

      const activity = await ActivityService.addSession(
        id,
        status,
        date ? new Date(date) : undefined,
        topic,
        notes,
        user
      );

      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateSkills(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { skills } = req.body;
      const user = (req as any).user;

      if (!skills || !Array.isArray(skills)) {
        return res.status(400).json({ message: 'skills must be an array' });
      }

      const activity = await ActivityService.updateSkills(id, skills, user);
      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateHeader(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, coachName, schedule, currentLevel, levelColor } = req.body;
      const user = (req as any).user;

      const activity = await ActivityService.updateActivityHeader(
        id,
        { name, coachName, schedule, currentLevel, levelColor },
        user
      );

      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      await ActivityService.deleteActivity(id, user);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
