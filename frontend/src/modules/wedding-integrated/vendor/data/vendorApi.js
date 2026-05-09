import { api } from "../../../../services/apiService";

// Helper to get the best available auth token for vendor
const getVendorAuthHeader = () => {
  const vendorToken = localStorage.getItem('vendor_token');
  const token = localStorage.getItem('token');
  const effectiveToken = vendorToken || token;
  return effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {};
};

/**
 * Public vendor application — NO login/token required.
 * Creates a new vendor application in the database.
 */
export const applyAsVendor = async (data) => {
  try {
    const response = await api.post('/wedding/vendor/apply', data);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Create or Update a vendor profile (requires auth token).
 */
export const createVendor = async (data) => {
  try {
    const response = await api.post('/wedding/vendor/profile', data, {
      headers: getVendorAuthHeader()
    });
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Get current vendor profile.
 */
export const getVendor = async () => {
  try {
    const response = await api.get('/wedding/vendor/profile');
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Update an existing vendor profile.
 */
export const updateVendor = async (id, data) => {
  try {
    const response = await api.post('/wedding/vendor/profile', data);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Get public vendor listings
 */
export const getPublicVendors = async (filters = {}) => {
  try {
    const response = await api.get('/wedding/vendors', { params: filters });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return [];
  }
};

/**
 * Get single vendor detail (Public)
 */
export const getVendorById = async (id) => {
  try {
    const response = await api.get(`/wedding/vendors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch vendor detail:", error);
    return null;
  }
};
