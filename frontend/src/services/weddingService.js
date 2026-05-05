import { api } from './apiService';

export const weddingService = {
  getDestinations: async () => {
    try {
      const response = await api.get('/wedding/destinations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getVenues: async (destinationId) => {
    try {
      const url = destinationId ? `/wedding/venues?destinationId=${destinationId}` : '/wedding/venues';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createEnquiry: async (enquiryData) => {
    try {
      const response = await api.post('/wedding/enquiry', enquiryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin Services
  getAdminStats: async () => {
    try {
      const response = await api.get('/wedding/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAdminEnquiries: async (params = {}) => {
    try {
      const response = await api.get('/wedding/admin/enquiries', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateEnquiryStatus: async (id, status) => {
    try {
      const response = await api.patch(`/wedding/admin/enquiries/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteEnquiry: async (id) => {
    try {
      const response = await api.delete(`/wedding/admin/enquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAdminCustomers: async () => {
    try {
      const response = await api.get('/wedding/admin/customers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getGallery: async (params = {}) => {
    try {
      const response = await api.get('/wedding/gallery', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addGalleryImage: async (formData) => {
    try {
      const response = await api.post('/wedding/admin/gallery', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteGalleryImage: async (id) => {
    try {
      const response = await api.delete(`/wedding/admin/gallery/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRealWeddings: async () => {
    try {
      const response = await api.get('/wedding/real-weddings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addRealWedding: async (data) => {
    try {
      const response = await api.post('/wedding/admin/real-weddings', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteRealWedding: async (id) => {
    try {
      const response = await api.delete(`/wedding/admin/real-weddings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAdminVenues: async () => {
    try {
      const response = await api.get('/wedding/admin/venues');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateVenueStatus: async (id, status) => {
    try {
      const response = await api.patch(`/wedding/admin/venues/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAdminVendors: async () => {
    try {
      const response = await api.get('/wedding/admin/vendors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateVendorStatus: async (id, status) => {
    try {
      const response = await api.patch(`/wedding/admin/vendors/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addDestination: async (data) => {
    try {
      const response = await api.post('/wedding/admin/destinations', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateDestination: async (id, data) => {
    try {
      const response = await api.patch(`/wedding/admin/destinations/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDestination: async (id) => {
    try {
      const response = await api.delete(`/wedding/admin/destinations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
