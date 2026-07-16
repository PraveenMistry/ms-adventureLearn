import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceRecord {
  studentId: mongoose.Types.ObjectId;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  reason?: string;
}

export interface IAttendance extends Document {
  classId: mongoose.Types.ObjectId;
  date: Date;
  records: IAttendanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE'], default: 'PRESENT', required: true },
  reason: { type: String, default: "" }
});

const AttendanceSchema: Schema = new Schema({
  classId: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
  date: { type: Date, required: true },
  records: [AttendanceRecordSchema]
}, { timestamps: true });

// Make classId + date combination unique to avoid duplicate registers for same day
AttendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
