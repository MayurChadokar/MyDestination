import mongoose from 'mongoose';

const weddingRealWeddingSchema = new mongoose.Schema({
  coupleName: { type: String, required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'WeddingDestination' },
  locationName: { type: String }, // Display name for location
  guests: { type: Number },
  budgetMin: { type: String },
  budgetMax: { type: String },
  coverImage: { type: String },
  photos: [{ type: String }],
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('WeddingRealWedding', weddingRealWeddingSchema);
