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
}
