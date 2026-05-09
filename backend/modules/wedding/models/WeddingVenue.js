import mongoose from 'mongoose';

const weddingVenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorName: { type: String }, // For easier display
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'WeddingDestination', required: true },
  address: { type: String },
  type: { type: String, default: 'Resort' },
  capacity: { type: Number },
  pricePerDay: { type: Number },
  priceRange: { type: String }, 
  image: { type: String }, 
  images: [{ type: String }],
  description: { type: String },
  amenities: [{ type: String }],
  rentalHours: { type: String, default: '12 PM – 12 AM' },
  cancellationPolicy: { type: String },
  outsideCatering: { type: String },
  alcoholPolicy: { type: String },
  rating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  shortlistCount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('WeddingVenue', weddingVenueSchema);
