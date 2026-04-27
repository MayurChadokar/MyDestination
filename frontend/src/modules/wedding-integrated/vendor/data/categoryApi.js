import { mockCategories } from "./categoryMockData";

/**
 * Simulate network delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all available vendor categories.
 * Simulates fetching from a backend database.
 */
export const getCategories = async () => {
  await delay(600);
  return { success: true, categories: [...mockCategories] };
};
