// Vendor categories available for onboarding
export const vendorCategories = [
  "Photographer",
  "Decorator",
  "Caterer",
  "Makeup Artist",
  "DJ / Entertainment",
  "Mehendi Artist",
  "Videographer",
  "Wedding Planner",
];

// Locations aligned with existing wedding destinations
export const vendorLocations = [
  "Goa",
  "Jaipur",
  "Udaipur",
  "Kerala",
  "Rishikesh",
  "Mumbai",
  "Delhi",
];

// Sample vendor object — used as fallback in getVendor()
export const mockVendor = {
  id: "vendor-001",
  basicInfo: {
    name: "Royal Lens Photography",
    category: "Photographer",
    location: "Jaipur",
    experience: "8",
    phone: "+91 98765 43210",
    email: "info@royallens.com",
  },
  portfolio: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=600",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
  ],
  services: [
    {
      name: "Pre-Wedding Shoot",
      description: "Full day shoot at destination location with 100+ edited photos.",
    },
    {
      name: "Wedding Day Coverage",
      description: "Complete coverage of all ceremonies with 2 photographers + 1 videographer.",
    },
    {
      name: "Album Design",
      description: "Premium hardbound photo album with 40 spreads.",
    },
  ],
  pricing: {
    basePrice: "150000",
    premiumPrice: "350000",
    description:
      "Base package includes 1 photographer for 8 hours. Premium includes full team, drone shots, and cinematic highlight reel.",
  },
  status: "approved",
};
