import { destinations as staticDestinations, realWeddings as staticRealWeddings } from "../data/weddingData";

const STORAGE_KEYS = {
  ADMIN_DESTINATIONS: 'admin_destinations',
  VENDOR_VENUES: 'vendor_venues',
  REAL_WEDDINGS: 'real_weddings',
  ADMIN_VENDORS: 'admin_vendors',
};

export const getAdminDestinations = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DESTINATIONS) || "[]"); }
  catch { return []; }
};

export const saveAdminDestination = (dest) => {
  const existing = getAdminDestinations();
  const newDest = { ...dest, id: `custom-${Date.now()}`, plannerIds: [], venues: [] };
  existing.push(newDest);
  localStorage.setItem(STORAGE_KEYS.ADMIN_DESTINATIONS, JSON.stringify(existing));
  return newDest;
};

export const updateAdminDestination = (updatedDest) => {
  const existing = getAdminDestinations();
  const index = existing.findIndex(d => d.id === updatedDest.id);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updatedDest };
    localStorage.setItem(STORAGE_KEYS.ADMIN_DESTINATIONS, JSON.stringify(existing));
    return existing[index];
  }
  return null;
};

export const deleteAdminDestination = (id) => {
  const existing = getAdminDestinations().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.ADMIN_DESTINATIONS, JSON.stringify(existing));
};

export const getAllDestinations = () => {
  const adminDests = getAdminDestinations();
  return [...staticDestinations, ...adminDests];
};

export const getAdminRealWeddings = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.REAL_WEDDINGS) || "[]"); }
  catch { return []; }
};

export const saveAdminRealWedding = (wedding) => {
  const existing = getAdminRealWeddings();
  const newWedding = { ...wedding, id: `rw-custom-${Date.now()}` };
  existing.push(newWedding);
  localStorage.setItem(STORAGE_KEYS.REAL_WEDDINGS, JSON.stringify(existing));
  return newWedding;
};

export const updateAdminRealWedding = (updatedWedding) => {
  const existing = getAdminRealWeddings();
  const index = existing.findIndex(w => w.id === updatedWedding.id);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updatedWedding };
    localStorage.setItem(STORAGE_KEYS.REAL_WEDDINGS, JSON.stringify(existing));
    return existing[index];
  }
  return null;
};

export const deleteAdminRealWedding = (id) => {
  const existing = getAdminRealWeddings().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.REAL_WEDDINGS, JSON.stringify(existing));
};

export const getAllRealWeddings = () => {
  const adminWeddings = getAdminRealWeddings();
  return [...staticRealWeddings, ...adminWeddings];
};

export const getVendorVenues = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.VENDOR_VENUES) || "[]"); }
  catch { return []; }
};

export const saveVendorVenue = (venue) => {
  const existing = getVendorVenues();
  const newVenue = { ...venue, id: `v-custom-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };
  existing.push(newVenue);
  localStorage.setItem(STORAGE_KEYS.VENDOR_VENUES, JSON.stringify(existing));
  return newVenue;
};

export const updateVendorVenue = (updatedVenue) => {
  const existing = getVendorVenues();
  const index = existing.findIndex(v => v.id === updatedVenue.id);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updatedVenue };
    localStorage.setItem(STORAGE_KEYS.VENDOR_VENUES, JSON.stringify(existing));
    return existing[index];
  }
  return null;
};

export const updateVenueStatus = (id, status) => {
  const existing = getVendorVenues().map(v => v.id === id ? { ...v, status } : v);
  localStorage.setItem(STORAGE_KEYS.VENDOR_VENUES, JSON.stringify(existing));
};

export const getApprovedVenuesByDestination = (destId) => {
  return getVendorVenues().filter(v => v.destinationId === destId && v.status === 'approved');
};

export const getAdminVendors = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_VENDORS) || "[]"); }
  catch { return []; }
};

export const saveAdminVendor = (vendor) => {
  const existing = getAdminVendors();
  const newVendor = { ...vendor, id: `admin-vend-${Date.now()}`, createdAt: new Date().toISOString() };
  existing.push(newVendor);
  localStorage.setItem(STORAGE_KEYS.ADMIN_VENDORS, JSON.stringify(existing));
  return newVendor;
};
