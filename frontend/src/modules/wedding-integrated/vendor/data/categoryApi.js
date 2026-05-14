import { api } from "../../../../services/apiService";

/**
 * Get all available vendor categories from the live database.
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/wedding/categories');
    return { success: true, categories: response.data.categories || [] };
  } catch (error) {
    console.error("Failed to fetch live categories:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};
