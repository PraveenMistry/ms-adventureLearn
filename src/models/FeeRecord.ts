import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeRecord extends Document {
  classId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  dueDate: Date;
  status: 'PAID' | 'UNPAID';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FeeRecordSchema: Schema = new Schema({
  classId: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['PAID', 'UNPAID'], default: 'UNPAID', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IFeeRecord>('FeeRecord', FeeRecordSchema);
