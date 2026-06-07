import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressRecord {
  moduleName: string;
  level: number;
  score: number;
  completedAt: Date;
}

export interface IChildProfile extends Document {
  parentId: mongoose.Types.ObjectId;
  name: string;
  avatarUrl: string;
  age: number;
  starCoins: number;
  progress: IProgressRecord[];
  moodLogs: { mood: string; date: Date }[];
  unlockedItems: string[];
  equippedItems: { skin: string; hat: string };
  loginPin: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressRecordSchema = new Schema({
  moduleName: { type: String, required: true },
  level: { type: Number, required: true },
  score: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

const ChildProfileSchema: Schema = new Schema({
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  avatarUrl: { type: String },
  age: { type: Number, required: true },
  starCoins: { type: Number, default: 0 },
  progress: [ProgressRecordSchema],
  moodLogs: [{ mood: String, date: { type: Date, default: Date.now } }],
  unlockedItems: { type: [String], default: ['base-fox'] },
  equippedItems: { 
    type: Object, 
    default: { skin: 'base-fox', hat: 'none' } 
  },
  loginPin: { type: String, default: "0000" }
}, { timestamps: true });

export default mongoose.model<IChildProfile>('ChildProfile', ChildProfileSchema);
