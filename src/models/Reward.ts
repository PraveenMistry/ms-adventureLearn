import mongoose, { Schema, Document } from 'mongoose';

export interface IReward extends Document {
  childId: mongoose.Types.ObjectId;
  rewardType: string;
  earnedAt: Date;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema: Schema = new Schema({
  childId: { type: Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
  rewardType: { type: String, required: true },
  earnedAt: { type: Date, required: true },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IReward>('Reward', RewardSchema);
