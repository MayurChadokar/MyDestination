import mongoose from 'mongoose';

const weddingEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  weddingDate: { type: Date },
  guestCount: { type: Number },
  budget: { type: String },
  message: { type: String },
  targetType: { type: String, enum: ['Venue', 'Vendor', 'General'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetType' }, // Dynamic ref
  status: { type: String, enum: ['New', 'Contacted', 'Booked', 'Lost'], default: 'New' }
}, { timestamps: true });

export default mongoose.model('WeddingEnquiry', weddingEnquirySchema);
