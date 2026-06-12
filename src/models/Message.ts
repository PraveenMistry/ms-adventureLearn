import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId; // Optional link to a specific student context
  content: string;
  type: 'DIRECT' | 'PROGRESS_UPDATE';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'ChildProfile' },
  content: { type: String, required: true },
  type: { type: String, enum: ['DIRECT', 'PROGRESS_UPDATE'], default: 'DIRECT' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);
