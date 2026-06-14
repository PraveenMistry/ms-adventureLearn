import Message, { IMessage } from '../models/Message';

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
    classrooms.forEach(c => {
      c.students.forEach((s: any) => {
        if (s.parentId && s.parentId.role === 'PARENT') {
          parentsMap.set(s.parentId._id.toString(), s.parentId);
        }
      });
    });

    return Array.from(parentsMap.values());
  }
}
