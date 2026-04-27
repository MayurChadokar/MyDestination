import { mockLeads } from "./leadsMockData";

const LEADS_KEY = "vendor_leads";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Seed leads into localStorage if not already present.
 */
const seedLeads = () => {
  const stored = localStorage.getItem(LEADS_KEY);
  if (!stored) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(mockLeads));
    return mockLeads;
  }
  return JSON.parse(stored);
};

/**
 * Get all leads.
 */
export const getLeads = async () => {
  await delay(800);
  const leads = seedLeads();
  return { success: true, leads };
};

/**
 * Get a single lead by ID.
 */
export const getLeadById = async (id) => {
  await delay(500);
  const leads = seedLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return { success: false, lead: null };
  return { success: true, lead };
};

/**
 * Update lead status (new → contacted → closed).
 */
export const updateLeadStatus = async (id, status) => {
  await delay(1000);
  const leads = seedLeads();
  const updated = leads.map((l) =>
    l.id === id ? { ...l, status } : l
  );
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
  const lead = updated.find((l) => l.id === id);
  return { success: true, lead };
};
