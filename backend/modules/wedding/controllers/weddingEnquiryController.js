import WeddingEnquiry from '../models/WeddingEnquiry.js';
import WeddingVendor from '../models/WeddingVendor.js';
import WeddingVenue from '../models/WeddingVenue.js';

/**
 * @desc    Create a new enquiry (User Side)
 */
export const createEnquiry = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      weddingDate, 
      guestCount, 
      budget, 
      message, 
      targetType, 
      targetId 
    } = req.body;
    
    if (!name || !email || !phone || !targetType || !targetId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const enquiry = await WeddingEnquiry.create({
      name,
      email,
      phone,
      weddingDate,
      guestCount,
      budget,
      message,
      targetType,
      targetId
    });

    res.status(201).json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get leads for a specific vendor
 */
export const getVendorLeads = async (req, res) => {
  try {
    // 1. Find the vendor profile(s) for this user
    const vendorProfile = await WeddingVendor.findOne({ user: req.user._id });
    const venueProfile = await WeddingVenue.findOne({ vendor: req.user._id });

    const targetIds = [];
    if (vendorProfile) targetIds.push(vendorProfile._id);
    if (venueProfile) targetIds.push(venueProfile._id);

    if (targetIds.length === 0) {
      return res.status(200).json([]);
    }

    // 2. Find enquiries targeting these profiles
    const enquiries = await WeddingEnquiry.find({ 
      targetId: { $in: targetIds } 
    }).sort({ createdAt: -1 });

    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update lead status (Vendor Side)
 */
export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if the enquiry belongs to this vendor
    const enquiry = await WeddingEnquiry.findById(id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    // Verify ownership (simplified: check if target is owned by user)
    const vendorProfile = await WeddingVendor.findOne({ user: req.user._id });
    const venueProfile = await WeddingVenue.findOne({ vendor: req.user._id });
    
    const isOwner = (vendorProfile && enquiry.targetId.equals(vendorProfile._id)) || 
                    (venueProfile && enquiry.targetId.equals(venueProfile._id));

    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    enquiry.status = status;
    await enquiry.save();
    
    res.status(200).json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminEnquiries = async (req, res) => {
  try {
    const enquiries = await WeddingEnquiry.find()
      .populate('targetId')
      .sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const enquiry = await WeddingEnquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    
    res.status(200).json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await WeddingEnquiry.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
