import WeddingVendor from '../models/WeddingVendor.js';

/**
 * @desc    Get current vendor profile
 * @route   GET /api/wedding/vendor/profile
 * @access  Private (Vendor)
 */
export const getVendorProfile = async (req, res) => {
  try {
    let vendor = await WeddingVendor.findOne({ user: req.user._id })
      .populate('destination', 'name location');

    if (!vendor) {
      // If no profile exists, return a draft-like structure or 404
      return res.status(200).json({ 
        success: true, 
        vendor: { 
          status: 'draft',
          name: req.user.name,
          contactEmail: req.user.email,
          contactPhone: req.user.phone,
          category: req.user.category
        } 
      });
    }

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create or Update vendor profile
 * @route   POST /api/wedding/vendor/profile
 * @access  Private (Vendor)
 */
export const updateVendorProfile = async (req, res) => {
  try {
    const profileData = {
      ...req.body,
      user: req.user._id
    };

    let vendor = await WeddingVendor.findOne({ user: req.user._id });

    if (vendor) {
      // Update existing
      vendor = await WeddingVendor.findOneAndUpdate(
        { user: req.user._id },
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      vendor = await WeddingVendor.create(profileData);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      vendor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all active vendors (Public)
 * @route   GET /api/wedding/vendors
 * @access  Public
 */
export const getPublicVendors = async (req, res) => {
  try {
    const { category, destinationId } = req.query;
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    if (destinationId) filter.destination = destinationId;

    const vendors = await WeddingVendor.find(filter)
      .populate('destination', 'name location')
      .sort({ rating: -1, createdAt: -1 });

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get vendor detail (Public)
 * @route   GET /api/wedding/vendors/:id
 * @access  Public
 */
export const getVendorDetail = async (req, res) => {
  try {
    const vendor = await WeddingVendor.findById(req.params.id)
      .populate('destination', 'name location');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
