import WeddingReview from '../models/WeddingReview.js';
import WeddingVendor from '../models/WeddingVendor.js';
import WeddingVenue from '../models/WeddingVenue.js';

/**
 * @desc    Create a new review (User Side)
 */
export const createReview = async (req, res) => {
  try {
    const { name, email, targetType, targetId, rating, comment } = req.body;
    
    if (!targetType || !targetId || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const review = await WeddingReview.create({
      user: req.user?._id,
      name: name || req.user?.name,
      email: email || req.user?.email,
      targetType,
      targetId,
      rating,
      comment
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get reviews for a specific vendor (Vendor Panel)
 */
export const getVendorReviews = async (req, res) => {
  try {
    const vendorProfile = await WeddingVendor.findOne({ user: req.user._id });
    const venueProfile = await WeddingVenue.findOne({ vendor: req.user._id });

    const targetIds = [];
    if (vendorProfile) targetIds.push(vendorProfile._id);
    if (venueProfile) targetIds.push(venueProfile._id);

    if (targetIds.length === 0) {
      return res.status(200).json([]);
    }

    const reviews = await WeddingReview.find({ 
      targetId: { $in: targetIds } 
    }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Reply to a review (Vendor Side)
 */
export const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    
    const review = await WeddingReview.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Verify ownership
    const vendorProfile = await WeddingVendor.findOne({ user: req.user._id });
    const venueProfile = await WeddingVenue.findOne({ vendor: req.user._id });
    
    const isOwner = (vendorProfile && review.targetId.equals(vendorProfile._id)) || 
                    (venueProfile && review.targetId.equals(venueProfile._id));

    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to reply to this review' });
    }

    review.reply = reply;
    await review.save();
    
    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get public reviews for a vendor/venue
 */
export const getPublicReviews = async (req, res) => {
  try {
    const { targetId } = req.params;
    const reviews = await WeddingReview.find({ targetId, isApproved: true })
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
