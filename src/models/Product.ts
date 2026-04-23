import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true }, 
  images: [String], 
  badge: { type: String },
  description: { type: String },
  fabric: { type: String },
  occasion: { type: String },
  work: { type: String },
  sizes: [String],
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  color: { type: String },
  colorCode: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default models.Product || model("Product", ProductSchema);