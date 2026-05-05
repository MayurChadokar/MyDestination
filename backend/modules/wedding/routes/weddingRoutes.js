import express from 'express';
import { 
  registerVendor, 
  loginVendor,
  updatePassword
} from '../controllers/weddingAuthController.js';
import { 
  getVenues, 
  getVenueDetail,
  getAdminVenues, 
  updateVenueStatus 
} from '../controllers/weddingVenueController.js';
import {
  getVendorProfile,
  updateVendorProfile,
  getPublicVendors,
  getVendorDetail
} from '../controllers/weddingVendorController.js';
import { 
  getDestinations, 
  addDestination, 
  updateDestination, 
  deleteDestination,
  getCategories
} from '../controllers/weddingDestinationController.js';
import { 
  createEnquiry, 
  getAdminEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry,
  getVendorLeads,
  updateLeadStatus
} from '../controllers/weddingEnquiryController.js';
import { 
  getGallery, 
  addGalleryImage, 
  deleteGalleryImage,
  getRealWeddings,
  addRealWedding,
  deleteRealWedding
} from '../controllers/weddingGalleryController.js';
import {
  createReview,
  getVendorReviews,
  replyToReview,
  getPublicReviews
} from '../controllers/weddingReviewController.js';
import { 
  getAdminStats, 
  getAdminCustomers, 
  getAdminVendors, 
  updateVendorStatus 
} from '../controllers/weddingAdminController.js';
import { protect, authorizedRoles } from '../../../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/categories', getCategories);
router.get('/destinations', getDestinations);
router.get('/venues', getVenues);
router.get('/venues/:id', getVenueDetail);
router.post('/enquiry', createEnquiry);
router.get('/gallery', getGallery);
router.get('/real-weddings', getRealWeddings);
router.get('/vendors', getPublicVendors);
router.get('/vendors/:id', getVendorDetail);

// Public Review Routes
router.get('/reviews/:targetId', getPublicReviews);
router.post('/reviews', protect, createReview);

// Auth Routes (Vendor)
router.post('/vendor/register', registerVendor);
router.post('/vendor/login', loginVendor);

// Vendor Profile Routes (Protected)
router.get('/vendor/profile', protect, authorizedRoles('vendor'), getVendorProfile);
router.post('/vendor/profile', protect, authorizedRoles('vendor'), updateVendorProfile);
router.patch('/vendor/password', protect, authorizedRoles('vendor'), updatePassword);

// Vendor Lead Routes (Protected)
router.get('/vendor/leads', protect, authorizedRoles('vendor'), getVendorLeads);
router.patch('/vendor/leads/:id/status', protect, authorizedRoles('vendor'), updateLeadStatus);

// Vendor Review Routes (Protected)
router.get('/vendor/reviews', protect, authorizedRoles('vendor'), getVendorReviews);
router.patch('/vendor/reviews/:id/reply', protect, authorizedRoles('vendor'), replyToReview);

// Admin Routes (Protected)
router.get('/admin/stats', protect, authorizedRoles('admin', 'superadmin'), getAdminStats);
router.get('/admin/enquiries', protect, authorizedRoles('admin', 'superadmin'), getAdminEnquiries);
router.patch('/admin/enquiries/:id/status', protect, authorizedRoles('admin', 'superadmin'), updateEnquiryStatus);
router.delete('/admin/enquiries/:id', protect, authorizedRoles('admin', 'superadmin'), deleteEnquiry);
router.get('/admin/customers', protect, authorizedRoles('admin', 'superadmin'), getAdminCustomers);

// Admin Gallery/Weddings
router.post('/admin/gallery', protect, authorizedRoles('admin', 'superadmin'), addGalleryImage);
router.delete('/admin/gallery/:id', protect, authorizedRoles('admin', 'superadmin'), deleteGalleryImage);
router.post('/admin/real-weddings', protect, authorizedRoles('admin', 'superadmin'), addRealWedding);
router.delete('/admin/real-weddings/:id', protect, authorizedRoles('admin', 'superadmin'), deleteRealWedding);

// Admin Venues
router.get('/admin/venues', protect, authorizedRoles('admin', 'superadmin'), getAdminVenues);
router.patch('/admin/venues/:id/status', protect, authorizedRoles('admin', 'superadmin'), updateVenueStatus);

// Admin Vendor Routes
router.get('/admin/vendors', protect, authorizedRoles('admin', 'superadmin'), getAdminVendors);
router.patch('/admin/vendors/:id/status', protect, authorizedRoles('admin', 'superadmin'), updateVendorStatus);

// Admin Destination Routes
router.post('/admin/destinations', protect, authorizedRoles('admin', 'superadmin'), addDestination);
router.patch('/admin/destinations/:id', protect, authorizedRoles('admin', 'superadmin'), updateDestination);
router.delete('/admin/destinations/:id', protect, authorizedRoles('admin', 'superadmin'), deleteDestination);

export default router;
