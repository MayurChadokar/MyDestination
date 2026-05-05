import mongoose from 'mongoose';

const weddingGallerySchema = new mongoose.Schema({
  title: { type: String },
  imageUrl: { type: String, required: true },
  publicId: { type: String }, // Cloudinary public_id for easy deletion
  category: { type: String, enum: ['Destination', 'Venue', 'Decor', 'RealWedding'], default: 'Destination' },
  location: { type: String }, // e.g., "Udaipur"
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('WeddingGallery', weddingGallerySchema);
