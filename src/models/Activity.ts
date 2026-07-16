import mongoose, { Schema, Document } from 'mongoose';

export interface IActivitySession {
  date: Date;
  status: 'ATTENDED' | 'ABSENT' | 'LATE';
  topic?: string;
  notes?: string;
}

export interface IActivitySkill {
  name: string;
  percentage: number; // 0 to 100
}

export interface IActivity extends Document {
  childId: mongoose.Types.ObjectId;
  name: string; // e.g. "Karate", "Swimming", "Piano"
  coachName?: string;
  schedule?: string; // e.g. "Tuesday & Thursday"
  currentLevel?: string; // e.g. "Yellow belt", "Stage 4"
  levelColor?: string; // e.g. "danger", "info", "success"
  skills: IActivitySkill[];
  sessions: IActivitySession[];
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySessionSchema = new Schema({
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['ATTENDED', 'ABSENT', 'LATE'], required: true },
  topic: { type: String, default: "" },
  notes: { type: String, default: "" }
});

const ActivitySkillSchema = new Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 }
});

const ActivitySchema: Schema = new Schema({
  childId: { type: Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
  name: { type: String, required: true },
  coachName: { type: String, default: "" },
  schedule: { type: String, default: "" },
  currentLevel: { type: String, default: "" },
  levelColor: { type: String, default: "info" },
  skills: [ActivitySkillSchema],
  sessions: [ActivitySessionSchema]
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
