import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  teacherId: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  category: 'LITERACY' | 'MATH' | 'ADVENTURE';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema: Schema = new Schema({
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, enum: ['LITERACY', 'MATH', 'ADVENTURE'], default: 'ADVENTURE' },
  description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IBadge>('Badge', BadgeSchema);
