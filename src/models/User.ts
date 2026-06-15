import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'PARENT' | 'TEACHER';
  phoneNumber?: string;
  childProfiles: mongoose.Types.ObjectId[];
  subscription?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['PARENT', 'TEACHER'], default: 'PARENT' },
  phoneNumber: { type: String },
  childProfiles: [{ type: Schema.Types.ObjectId, ref: 'ChildProfile' }],
  subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
