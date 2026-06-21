import SchoolEvent from '../models/SchoolEvent';
import Classroom from '../models/Classroom';
import ChildProfile from '../models/ChildProfile';
import mongoose from 'mongoose';

export class SchoolEventService {
  static async createEvent(
    publishedBy: string,
    title: string,
    date: Date,
    description?: string,
    location?: string,
    classId?: string,
    schoolId?: string
  ) {
    const newEvent = new SchoolEvent({
      publishedBy,
      title,
      date,
      description,
      location,
      classId: classId ? new mongoose.Types.ObjectId(classId) : undefined,
      schoolId: schoolId ? new mongoose.Types.ObjectId(schoolId) : undefined,
      rsvps: []
    });

    return await newEvent.save();
  }

  static async getEventsByClass(classId: string) {
    return await SchoolEvent.find({ classId })
      .populate('publishedBy', 'email role')
      .sort({ date: 1 })
      .exec();
  }

  static async getEventsBySchool(schoolId: string) {
    return await SchoolEvent.find({ schoolId })
      .populate('publishedBy', 'email role')
      .sort({ date: 1 })
      .exec();
  }

  static async getParentEvents(parentId: string) {
    // 1. Find all child profiles for this parent
    const profiles = await ChildProfile.find({ parentId }).exec();
    if (profiles.length === 0) return [];

    const studentIds = profiles.map(p => p._id);

    // 2. Find all classrooms containing these children
    const classrooms = await Classroom.find({ students: { $in: studentIds } }).exec();
    const classIds = classrooms.map(c => c._id);

    // 3. Find events that are either:
    //    - Scoped to one of these classrooms
    //    - Or scoped to a school (if principal/school system linked)
    //    - Or classId is empty but schoolId is matched
    // For simplicity, we fetch class-scoped events for classrooms parent is associated with,
    // plus any general events.
    return await SchoolEvent.find({
      $or: [
        { classId: { $in: classIds } },
        { classId: { $exists: false }, schoolId: { $exists: true } } // school-wide
      ]
    })
    .populate('publishedBy', 'email role')
    .sort({ date: 1 })
    .exec();
  }

  static async submitRsvp(eventId: string, parentId: string, status: 'YES' | 'NO' | 'MAYBE') {
    const event = await SchoolEvent.findById(eventId).exec();
    if (!event) throw new Error('Event not found');

    // Remove existing RSVP for this parent if it exists
    event.rsvps = event.rsvps.filter(r => r.parentId.toString() !== parentId);
    
    // Add new RSVP
    event.rsvps.push({
      parentId: new mongoose.Types.ObjectId(parentId),
      status
    });

    return await event.save();
  }

  static async deleteEvent(eventId: string, userId: string) {
    const event = await SchoolEvent.findById(eventId).exec();
    if (!event) throw new Error('Event not found');

    if (event.publishedBy.toString() !== userId) {
      throw new Error('Unauthorized: You did not publish this event');
    }

    return await SchoolEvent.findByIdAndDelete(eventId).exec();
  }
}
