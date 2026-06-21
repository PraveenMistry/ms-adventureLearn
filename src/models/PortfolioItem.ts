import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolioItem extends Document {
  childId: mongoose.Types.ObjectId;
  type: 'DRAWING' | 'CERTIFICATE' | 'BADGE' | 'QUEST_COMPLETE' | 'STORY_ILLUSTRATION';
  title: string;
  description?: string;
  mediaUrl?: string; // Can be a data URL for drawings, or badge icon URL, or certificate template reference
  date: Date;
  meta?: any; // Additional payload data (e.g. score, level, game difficulty)
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema: Schema = new Schema({
  childId: { type: Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
  type: { 
    type: String, 
    enum: ['DRAWING', 'CERTIFICATE', 'BADGE', 'QUEST_COMPLETE', 'STORY_ILLUSTRATION'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  mediaUrl: { type: String },
  date: { type: Date, default: Date.now },
  meta: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);
