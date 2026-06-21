import { Request, Response } from 'express';
import { SchoolEventService } from '../services/SchoolEventService';

export class SchoolEventController {
  static async create(req: Request, res: Response) {
    try {
      const publishedBy = (req as any).user.id;
      const { title, date, description, location, classId, schoolId } = req.body;

      if (!title || !date) {
        return res.status(400).json({ message: 'Title and Date are required fields' });
      }

      const event = await SchoolEventService.createEvent(
        publishedBy,
        title,
        new Date(date),
        description,
        location,
        classId,
        schoolId
      );

      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findByClass(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const events = await SchoolEventService.getEventsByClass(classId);
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      const events = await SchoolEventService.getEventsBySchool(schoolId);
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findByParent(req: Request, res: Response) {
    try {
      const parentId = (req as any).user.id;
      const events = await SchoolEventService.getParentEvents(parentId);
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async submitRsvp(req: Request, res: Response) {
    try {
      const parentId = (req as any).user.id;
      const { eventId } = req.params;
      const { status } = req.body;

      if (!status || !['YES', 'NO', 'MAYBE'].includes(status)) {
        return res.status(400).json({ message: 'Invalid RSVP status: must be YES, NO, or MAYBE' });
      }

      const updated = await SchoolEventService.submitRsvp(eventId, parentId, status);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { eventId } = req.params;
      await SchoolEventService.deleteEvent(eventId, userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
