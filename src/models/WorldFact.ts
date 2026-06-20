import mongoose, { Schema, Document } from 'mongoose';

export interface IWorldFact extends Document {
  question: string;
  answer: string;
  options: string[];
  emoji: string;
  teacherId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WorldFactSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  options: [{ type: String, required: true }],
  emoji: { type: String, required: true, default: "🌍" },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

export default mongoose.model<IWorldFact>('WorldFact', WorldFactSchema);
