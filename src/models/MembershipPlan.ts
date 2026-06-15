import mongoose, { Schema, Document } from 'mongoose';

export interface IMembershipPlan extends Document {
  name: string;
  durationMonths: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipPlanSchema: Schema = new Schema({
  name: { type: String, required: true },
  durationMonths: { type: Number, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IMembershipPlan>('MembershipPlan', MembershipPlanSchema);
