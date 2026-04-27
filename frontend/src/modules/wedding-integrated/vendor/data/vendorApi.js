import { mockVendor } from "./vendorMockData";

const STORAGE_KEY = "vendor_data";
const DRAFT_KEY = "vendor_onboarding_draft";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create a new vendor profile.
 * Saves to localStorage and clears the onboarding draft.
 */
export const createVendor = async (data) => {
  await delay(1500);
  const vendor = {
    ...data,
    id: `vendor-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vendor));

  try {
    const activeSession = JSON.parse(localStorage.getItem('vendor_active_session'));
    if (activeSession) {
      const dbRows = JSON.parse(localStorage.getItem('vendor_users_db') || "[]");
      const userIdx = dbRows.findIndex(u => u.id === activeSession.id);

      if (userIdx !== -1) {
        const expandedUser = {
          ...dbRows[userIdx],
          experience: data.basicInfo?.experience,
          services: data.services,
          basicPackage: data.pricing?.basePrice,
          premiumPackage: data.pricing?.premiumPrice,
          kycStatus: data.kyc?.aadhar ? "Verified" : "Pending Verification",
          portfolio: data.portfolio,
          name: data.basicInfo?.name || dbRows[userIdx].name,
          category: data.basicInfo?.category || dbRows[userIdx].category,
          location: data.basicInfo?.location || dbRows[userIdx].location,
        };
        dbRows[userIdx] = expandedUser;
        localStorage.setItem('vendor_users_db', JSON.stringify(dbRows));
        localStorage.setItem('vendor_active_session', JSON.stringify(expandedUser));
      }
    }
  } catch (e) { }

  localStorage.removeItem(DRAFT_KEY);
  return { success: true, vendor };
};

/**
 * Get vendor by id.
 * Returns from localStorage if available, otherwise returns mock data.
 */
export const getVendor = async (id) => {
  await delay(800);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const vendor = JSON.parse(stored);
    if (!id || vendor.id === id) return { success: true, vendor };
  }
  return { success: true, vendor: { ...mockVendor } };
};

/**
 * Update an existing vendor profile.
 * Merges partial data into the stored vendor object.
 */
export const updateVendor = async (id, data) => {
  await delay(1000);
  const stored = localStorage.getItem(STORAGE_KEY);
  const existing = stored ? JSON.parse(stored) : { ...mockVendor };
  const updated = { ...existing, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { success: true, vendor: updated };
};
