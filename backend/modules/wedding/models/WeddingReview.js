import mongoose from 'mongoose';

const weddingReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true }, // Backup if user is deleted or anonymous
  email: { type: String },
  targetType: { type: String, enum: ['Venue', 'Vendor'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetType', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  reply: { type: String },
  isApproved: { type: Boolean, default: true } // Auto-approve for now
}, { timestamps: true });

export default mongoose.model('WeddingReview', weddingReviewSchema);
