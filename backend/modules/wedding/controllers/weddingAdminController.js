import WeddingVenue from '../models/WeddingVenue.js';
import WeddingEnquiry from '../models/WeddingEnquiry.js';
import User from '../../user/models/User.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalVenues = await WeddingVenue.countDocuments();
    const pendingVenues = await WeddingVenue.countDocuments({ status: 'pending' });
    const totalEnquiries = await WeddingEnquiry.countDocuments();
    const pendingEnquiries = await WeddingEnquiry.countDocuments({ status: 'pending' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const pendingVendors = await User.countDocuments({ role: 'vendor', partnerApprovalStatus: 'pending' });

    res.status(200).json({
      totalVenues,
      pendingVenues,
      totalEnquiries,
      pendingEnquiries,
      totalVendors,
      pendingVendors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' })
      .select('name email phone createdAt')
      .sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminVendors = async (req, res) => {
  try {
    const items = await User.find({ role: 'vendor' })
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const item = await User.findByIdAndUpdate(
      id, 
      { partnerApprovalStatus: status }, 
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Vendor not found' });
    
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
