import mongoose from 'mongoose';

const weddingDestinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String },
  category: { type: String, enum: ['Heritage', 'Beach', 'Hill', 'Resort'], default: 'Heritage' },
  startingPrice: { type: Number },
  avgCost: { type: String },
  bestSeason: { type: String },
  description: { type: String },
  image: { type: String },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('WeddingDestination', weddingDestinationSchema);
