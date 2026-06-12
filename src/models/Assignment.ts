import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  classId: mongoose.Types.ObjectId;
  moduleName: string;
  assignedBy: mongoose.Types.ObjectId;
  dueDate: Date;
  assignedStudents: mongoose.Types.ObjectId[]; // Optional: if specific students are targeted
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  classId: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
  moduleName: { type: String, required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: 'ChildProfile' }]
}, { timestamps: true });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
