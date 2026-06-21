import mongoose, { Schema, Document } from 'mongoose';

export interface IRsvp {
  parentId: mongoose.Types.ObjectId;
  status: 'YES' | 'NO' | 'MAYBE';
}

export interface ISchoolEvent extends Document {
  classId?: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  publishedBy: mongoose.Types.ObjectId;
  rsvps: IRsvp[];
  createdAt: Date;
  updatedAt: Date;
}

const RsvpSchema = new Schema({
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['YES', 'NO', 'MAYBE'], default: 'MAYBE' }
}, { _id: false });

const SchoolEventSchema: Schema = new Schema({
  classId: { type: Schema.Types.ObjectId, ref: 'Classroom' },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  publishedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rsvps: [RsvpSchema]
}, { timestamps: true });

export default mongoose.model<ISchoolEvent>('SchoolEvent', SchoolEventSchema);
