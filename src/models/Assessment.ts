import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface IAssessment extends Document {
  title: string;
  teacherId: mongoose.Types.ObjectId;
  curriculumMapping: {
    subject: string;
    topic: string;
    level: number;
  };
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const AssessmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  curriculumMapping: {
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    level: { type: Number, required: true }
  },
  questions: [QuestionSchema]
}, { timestamps: true });

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);
