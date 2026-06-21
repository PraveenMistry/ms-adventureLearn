import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  principalId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema: Schema = new Schema({
  name: { type: String, required: true },
  principalId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }
}, { timestamps: true });

export default mongoose.model<ISchool>('School', SchoolSchema);
