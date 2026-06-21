import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'PARENT' | 'TEACHER' | 'PRINCIPAL';
  phoneNumber?: string;
  childProfiles: mongoose.Types.ObjectId[];
  subscription?: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['PARENT', 'TEACHER', 'PRINCIPAL'], default: 'PARENT' },
  phoneNumber: { type: String },
  childProfiles: [{ type: Schema.Types.ObjectId, ref: 'ChildProfile' }],
  subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School' }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
