import mongoose from 'mongoose';

const weddingTestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }, // e.g. "Goa Wedding"
  text: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  image: { type: String }, // User image/avatar
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('WeddingTestimonial', weddingTestimonialSchema);
