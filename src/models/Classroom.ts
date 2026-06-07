import mongoose, { Schema, Document } from 'mongoose';

export interface IClassroom extends Document {
  name: string;
  teacherId: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  classCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassroomSchema: Schema = new Schema({
  name: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'ChildProfile' }],
  classCode: { type: String, unique: true, required: true }
}, { timestamps: true });

export default mongoose.model<IClassroom>('Classroom', ClassroomSchema);
