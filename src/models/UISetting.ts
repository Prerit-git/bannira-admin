import mongoose, { Schema, Document } from 'mongoose';

export interface IUISetting extends Document {
  topStripText: string[];
  discountCode: string;
  discountValue: number;
  heroBanners: any[];
  featuredProductIds: mongoose.Types.ObjectId[];
  shippingCost: number;
  shippingFreeLimit: number;
  gstPercentage: number;
  coupons: any[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UISettingSchema = new Schema({
  topStripText: { type: [String], default: [] },
  discountCode: { type: String, default: "" },
  discountValue: { type: Number, default: 0 },
  heroBanners: { type: Array, default: [] } as any,
  featuredProductIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  shippingCost: { type: Number, default: 150 },
  shippingFreeLimit: { type: Number, default: 2999 },
  gstPercentage: { type: Number, default: 18 },
  coupons: { type: Array, default: [] } as any,
  isActive: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

export default mongoose.models.UISetting || mongoose.model('UISetting', UISettingSchema);