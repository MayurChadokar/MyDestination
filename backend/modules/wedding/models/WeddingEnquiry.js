import mongoose from 'mongoose';

const weddingEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  weddingDate: { type: String }, // Storing as string to match frontend input type="date"
  guestCount: { type: String },
  destination: { type: String },
  budget: { type: String },
  actualAmount: { type: Number, default: 0 },
  commissionAmount: { type: Number, default: 0 },
  services: [{ type: String }],
  message: { type: String },
  targetType: { type: String, enum: ['Venue', 'Vendor', 'General'], default: 'General' },
  targetId: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetType' }, // Dynamic ref
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['New', 'Contacted', 'Booked', 'Lost'], default: 'New' }
}, { timestamps: true });

export default mongoose.model('WeddingEnquiry', weddingEnquirySchema);
