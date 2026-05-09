import mongoose from 'mongoose';

const weddingCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String }, // Icon name or image URL
  parentCategory: { type: String, default: null }, // e.g., "WMG SERVICE"
  type: { type: String, enum: ['primary', 'sub'], default: 'primary' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('WeddingCategory', weddingCategorySchema);
