import mongoose from 'mongoose';
import Message, { IMessage } from '../models/Message';
import Classroom from '../models/Classroom';

export class MessageService {
  static async sendMessage(data: Partial<IMessage>) {
    const message = new Message(data);
    return message.save();
  }

  static async getConversation(userId1: string, userId2: string) {
    return Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'email role')
    .populate('receiverId', 'email role')
    .exec();
  }

  static async getUnreadCount(userId: string) {
    return Message.countDocuments({ receiverId: userId, isRead: false }).exec();
  }

  static async markAsRead(messageId: string) {
    return Message.findByIdAndUpdate(messageId, { isRead: true }, { new: true }).exec();
  }

  static async getTeacherParents(teacherId: string) {
    const classrooms = await Classroom.find({ teacherId }).populate({
      path: 'students',
      populate: { path: 'parentId', select: 'email role' }
    }).exec();

    const parentsMap = new Map();
    classrooms.forEach((c: any) => {
      c.students.forEach((s: any) => {
        if (s.parentId && s.parentId.role === 'PARENT') {
          parentsMap.set(s.parentId._id.toString(), s.parentId);
        }
      });
    });

    return Array.from(parentsMap.values());
  }

  static async getParentTeachers(parentId: string) {
    const ChildProfile = mongoose.model('ChildProfile');
    const kids = await ChildProfile.find({ parentId }).select('_id').exec();
    const kidIds = kids.map(k => k._id);

    const classrooms = await Classroom.find({ students: { $in: kidIds } }).populate('teacherId', 'email role').exec();
    
    const teachersMap = new Map();
    classrooms.forEach((c: any) => {
      if (c.teacherId && c.teacherId.role === 'TEACHER') {
        teachersMap.set(c.teacherId._id.toString(), c.teacherId);
      }
    });

    return Array.from(teachersMap.values());
  }
}
