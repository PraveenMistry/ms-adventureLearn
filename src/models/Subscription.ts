import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], 
    default: 'ACTIVE' 
  },
  paymentId: { type: String }
}, { timestamps: true });

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
