import mongoose from 'mongoose';
import WeddingVendor from '../models/WeddingVendor.js';
import WeddingVenue from '../models/WeddingVenue.js';
import WeddingEnquiry from '../models/WeddingEnquiry.js';
import WeddingReview from '../models/WeddingReview.js';

/**
 * @desc    Get vendor dashboard stats
 * @route   GET /api/wedding/vendor/dashboard/stats
 * @access  Private (Vendor)
 */
export const getVendorDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Find vendor profile and venues
    const vendor = await WeddingVendor.findOne({ user: userId });
    const venues = await WeddingVenue.find({ vendor: userId });

    const profileId = vendor?._id;
    const venueIds = venues.map(v => v._id);
    const allTargetIds = [];
    if (profileId) allTargetIds.push(profileId);
    venueIds.forEach(id => allTargetIds.push(id));

    // 2. Aggregate stats
    const totalEnquiries = await WeddingEnquiry.countDocuments({ targetId: { $in: allTargetIds } });
    const newLeads = await WeddingEnquiry.countDocuments({ targetId: { $in: allTargetIds }, status: 'New' });
    const totalReviews = await WeddingReview.countDocuments({ targetId: { $in: allTargetIds } });
    
    // Sum views and shortlists from profile and venues
    let totalViews = vendor?.views || 0;
    let totalShortlists = vendor?.shortlistCount || 0;
    
    venues.forEach(v => {
      totalViews += (v.views || 0);
      totalShortlists += (v.shortlistCount || 0);
    });

    // 3. Get recent leads (first 5)
    const recentLeads = await WeddingEnquiry.find({ targetId: { $in: allTargetIds } })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      stats: {
        totalEnquiries,
        newLeads,
        profileViews: totalViews,
        shortlisted: totalShortlists,
        totalReviews
      },
      recentLeads
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Increment view count for a vendor or venue
 * @route   PATCH /api/wedding/increment-view/:type/:id
 * @access  Public
 */
export const incrementView = async (req, res) => {
  try {
    const { type, id } = req.params;
    
    if (type === 'vendor') {
      await WeddingVendor.findByIdAndUpdate(id, { $inc: { views: 1 } });
    } else if (type === 'venue') {
      await WeddingVenue.findByIdAndUpdate(id, { $inc: { views: 1 } });
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    const { basicInfo, portfolio, services, pricing, kyc } = req.body;

    const profileData = {
      user: req.user._id,
      name: basicInfo?.name || req.body.name,
      category: basicInfo?.category || req.body.category,
      location: basicInfo?.location || req.body.location,
      experience: basicInfo?.experience || req.body.experience,
      contactPhone: basicInfo?.phone || req.body.contactPhone,
      contactEmail: basicInfo?.email || req.body.contactEmail,
      portfolio: portfolio || [],
      price: {
        base: pricing?.basePrice || 0,
        type: 'total'
      },
      status: 'pending' // Set status to pending on submission
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

    // Sync status and details to User model for Admin visibility
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(req.user._id, {
      role: 'vendor',
      partnerApprovalStatus: 'pending',
      category: profileData.category,
      location: profileData.location,
      experience: profileData.experience,
      basicPackage: pricing?.basePrice,
      premiumPackage: pricing?.premiumPrice,
      services: services || [],
      // KYC Docs sync if present
      aadhaarFront: kyc?.aadhar,
      panCardImage: kyc?.pan,
      profileImage: kyc?.photo
    });

    res.status(200).json({
      success: true,
      message: 'Profile submitted successfully for approval',
      vendor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Public vendor application — NO login required
 * @route   POST /api/wedding/vendor/apply
 * @access  Public
 */
export const applyAsVendor = async (req, res) => {
  try {
    const { basicInfo, portfolio, services, pricing, kyc } = req.body;

    // Validate required fields
    if (!basicInfo?.name || !basicInfo?.email || !basicInfo?.phone || !basicInfo?.category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, phone, and category are required' 
      });
    }

    const User = mongoose.model('User');
    const bcrypt = (await import('bcryptjs')).default;

    // Check if user already exists with this email or phone
    const normalizedEmail = basicInfo.email.trim().toLowerCase();
    const existingUser = await User.findOne({ 
      $or: [
        { email: normalizedEmail, role: 'vendor' }, 
        { phone: basicInfo.phone, role: 'vendor' }
      ] 
    });

    let user;
    
    if (existingUser) {
      // Update existing user's vendor application
      user = existingUser;
      await User.findByIdAndUpdate(user._id, {
        name: basicInfo.name,
        partnerApprovalStatus: 'pending',
        category: basicInfo.category,
        location: basicInfo.location,
        experience: basicInfo.experience,
        basicPackage: pricing?.basePrice,
        premiumPackage: pricing?.premiumPrice,
        services: services?.filter(s => s.name?.trim()) || [],
        aadhaarFront: kyc?.aadhar,
        panCardImage: kyc?.pan,
        profileImage: kyc?.photo
      });
    } else {
      // Create new user account with a default password (vendor will set it after approval)
      const defaultPassword = await bcrypt.hash(basicInfo.phone + '_vendor', 10);
      user = await User.create({
        name: basicInfo.name,
        email: normalizedEmail,
        phone: basicInfo.phone,
        password: defaultPassword,
        role: 'vendor',
        partnerApprovalStatus: 'pending',
        isVerified: false,
        category: basicInfo.category,
        location: basicInfo.location,
        experience: basicInfo.experience,
        basicPackage: pricing?.basePrice,
        premiumPackage: pricing?.premiumPrice,
        services: services?.filter(s => s.name?.trim()) || [],
        aadhaarFront: kyc?.aadhar,
        panCardImage: kyc?.pan,
        profileImage: kyc?.photo
      });
    }

    // Create or update WeddingVendor profile
    const vendorData = {
      user: user._id,
      name: basicInfo.name,
      category: basicInfo.category,
      location: basicInfo.location,
      experience: basicInfo.experience,
      contactPhone: basicInfo.phone,
      contactEmail: normalizedEmail,
      portfolio: portfolio || [],
      price: {
        base: pricing?.basePrice || 0,
        type: 'total'
      },
      status: 'pending'
    };

    let vendor = await WeddingVendor.findOne({ user: user._id });
    if (vendor) {
      vendor = await WeddingVendor.findOneAndUpdate(
        { user: user._id }, vendorData, { new: true }
      );
    } else {
      vendor = await WeddingVendor.create(vendorData);
    }

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully! You will be notified once approved.',
      vendor
    });
  } catch (error) {
    console.error('Vendor apply error:', error);
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: 'An account with this email or phone already exists. Please login instead.' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
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
    
    if (category) {
      // Create a forgiving regex (e.g. 'Photographers' matches 'Photography' and 'Photographers')
      let searchTerm = category;
      if (category === 'Photographers' || category === 'Photography') {
        searchTerm = 'Photograph';
      } else if (category === 'Planning & Decor') {
        searchTerm = 'Planning|Decor';
      }
      filter.category = { $regex: searchTerm, $options: 'i' };
    }
    if (destinationId && destinationId !== 'undefined') filter.destination = destinationId;

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
