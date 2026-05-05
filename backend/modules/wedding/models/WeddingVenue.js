import mongoose from 'mongoose';

const weddingVenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorName: { type: String }, // For easier display
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'WeddingDestination', required: true },
  address: { type: String },
  capacity: { type: Number },
  pricePerDay: { type: Number },
  priceRange: { type: String }, // e.g., "₹₹₹", "Budget", "Luxury"
  image: { type: String }, // Main display image
  images: [{ type: String }],
  description: { type: String },
  amenities: [{ type: String }],
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('WeddingVenue', weddingVenueSchema);
