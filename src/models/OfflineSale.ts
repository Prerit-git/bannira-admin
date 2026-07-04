import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IOfflineSale extends Document {
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  customerGst?: string;
  sellThrough: string;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMode: "Cash" | "UPI" | "Card";
  createdAt: Date;
}

const OfflineSaleSchema = new Schema<IOfflineSale>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, default: "Walk-in Customer" },
    customerPhone: { type: String },
    customerGst: { type: String },
    sellThrough: { 
      type: String, 
      required: true, 
      default: "In-store" 
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMode: { type: String, required: true, enum: ["Cash", "UPI", "Card"], default: "Cash" },
  },
  { timestamps: true }
);

// const OfflineSale = models.OfflineSale || model<IOfflineSale>("OfflineSale", OfflineSaleSchema);
const OfflineSale = models.OfflineSale || model("OfflineSale", OfflineSaleSchema);
export default OfflineSale;