import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronRight, SlidersHorizontal, LayoutGrid, LayoutList } from "lucide-react";
import { mockVendors, vendorCategories, citiesData } from "../data/vendorListingData";
import { getVendorVenues, getAllDestinations, getAdminVendors } from '../services/storage';
import { planners } from "../data/weddingData";
import VendorCard from "../components/VendorCard";
import FilterDropdown from "../components/FilterDropdown";
import VendorHubPage from "./VendorHubPage";
import ScrollReveal from "../components/ScrollReveal";

const budgetOptions = ["Under 50K", "50K-1L", "1L+"];
const ratingOptions = ["4.5+", "4+", "3+"];
const serviceOptions = [
  "Candid Photography", "Cinematic Films", "Drone Shots", "Bridal Makeup",
  "HD Makeup", "Airbrush Makeup", "Floral Decor", "DJ Services", "Live Band",
  "Pre-Wedding Shoot", "Full Planning", "Destination Weddings",
];

const VendorListingPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const cityParam = searchParams.get("city");

  // If no category selected â†’ show hub
  if (!categoryParam) {
    return <VendorHubPage />;
  }

  return <ListingView category={categoryParam} cityFromUrl={cityParam} />;
};

const ListingView = ({ category: categoryFromProps, cityFromUrl }) => {
  const category = useMemo(() => {
    const raw = categoryFromProps?.trim();
    if (raw === 'Planning') return 'Planning & Decor';
    if (raw === 'Music') return 'Music & Dance';
    if (raw === 'Invites') return 'Invites & Gifts';
    return raw;
  }, [categoryFromProps]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCity, setSelectedCity] = useState(cityFromUrl || null);
  const [viewMode, setViewMode] = useState("grid"); // "list" | "grid"

  const allVendors = useMemo(() => {
    const saved = localStorage.getItem('vendorProjects');
    let customVendors = [];
    if (saved) {
      try {
        const projects = JSON.parse(saved);
        const users = JSON.parse(localStorage.getItem('vendor_users_db') || '[]');
        
        customVendors = projects
          .filter(p => {
            if (!p.ownerId) return false; // Hide legacy projects
            const owner = users.find(u => u.id === p.ownerId);
            return owner?.status === 'Approved';
          })
          .map(p => ({
            id: p.id || `custom-${Date.now()}-${Math.random()}`,
            name: p.name || "New Portfolio",
            category: p.category || "Photographers",
            rating: p.rating || 5.0,
            reviews: p.reviews || 1,
            location: p.location || "Custom Location",
            city: p.city || p.location?.split(',').pop()?.trim() || "Mumbai",
            price: p.basePackage?.price || "₹0",
            priceUnit: p.basePackage?.unit || "per day",
            startingPrice: parseInt(p.basePackage?.price?.replace(/[^0-9]/g, '') || '0'),
            image: p.banner || p.portfolio?.[0] || "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200",
            tags: p.services?.map(s => s.name) || ["Verified", "New"],
            isFeatured: true,
            isCustom: true
          }));
      } catch (e) {}
    }

    let adminCreatedVendors = [];
    try {
      const dbAdmins = getAdminVendors() || [];
      adminCreatedVendors = dbAdmins.map(p => ({
        id: p.id,
        name: p.name || "Vendor",
        category: p.category || "General",
        rating: p.rating || 5.0,
        reviews: p.reviews || 0,
        location: p.location || "Custom Location",
        city: p.city || p.location?.split(',').pop()?.trim() || "Mumbai",
        price: p.price || "₹Contact for Pricing",
        priceUnit: p.priceUnit || "onwards",
        startingPrice: 0,
        image: p.image || "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200",
        tags: p.subsections?.length ? p.subsections : ["Verified", "Premium"],
        isFeatured: p.isFeatured || true,
        isCustom: p.isCustom || true
      }));
    } catch(err) {}

    let approvedVenuesAsVendors = [];
    try {
      if (category && category.toLowerCase() === 'venues') {
        const allVenues = getVendorVenues() || [];
        const dests = getAllDestinations() || [];
        
        approvedVenuesAsVendors = allVenues
          .filter(v => v.status === 'approved')
          .map(v => {
            const dest = dests.find(d => d.id === v.destinationId) || {};
            return {
              id: v.id,
              name: v.name,
              category: "Venues",
              rating: 4.8,
              reviews: Math.floor(Math.random() * 50) + 10,
              location: dest.location || dest.name || "Multiple Locations",
              city: dest.name || "Destination",
              price: `₹${(v.pricePerDay || '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
              priceUnit: "per day",
              startingPrice: Number(v.pricePerDay) || 0,
              image: v.image || dest.image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600",
              tags: v.amenities?.slice(0, 3) || ["Verified", "Premium"],
              services: v.amenities || [],
              isFeatured: true,
              isVenue: true,
              destinationId: v.destinationId
            };
          });
      }
    } catch(err) {}

    let mappedPlanners = [];
    if (category && (category.toLowerCase() === 'planners' || category.toLowerCase() === 'planning & decor')) {
      mappedPlanners = planners.map(p => ({
        id: p.id,
        name: p.name,
        category: "Planning & Decor",
        rating: p.rating,
        reviews: p.reviewCount,
        location: p.cities.join(', '),
        city: p.cities[0],
        price: p.startingPrice >= 100000 
          ? `₹${(p.startingPrice / 100000).toFixed(1)}L` 
          : `₹${(p.startingPrice / 1000).toFixed(0)}K`,
        priceUnit: "Starting",
        startingPrice: p.startingPrice,
        image: p.avatar || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600",
        tags: p.specialties || ["Professional", "Elite"],
        services: p.services || [],
        isFeatured: true
      }));
    }

    return [...adminCreatedVendors, ...approvedVenuesAsVendors, ...customVendors, ...mappedPlanners, ...mockVendors];
  }, [category]);

  const allCities = useMemo(() => {
    return [...new Set(allVendors.filter(v => v.category.toLowerCase() === category.toLowerCase()).map(v => v.city))];
  }, [category, allVendors]);

  const filteredVendors = useMemo(() => {
    return allVendors.filter((v) => {

      const matchCategory = v.category.toLowerCase() === category.toLowerCase();
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase());
      const minRating =
        selectedRating === "4.5+"
          ? 4.5
          : selectedRating === "4+"
          ? 4
          : selectedRating === "3+"
          ? 3
          : 0;
      const matchRating = v.rating >= minRating;
      const matchBudget = !selectedBudget || v.budget === selectedBudget;
      const matchCity = !selectedCity || v.city === selectedCity;
      const matchServices =
        selectedServices.length === 0 ||
        selectedServices.some((s) => v.services?.includes(s));
      return matchCategory && matchSearch && matchRating && matchBudget && matchCity && matchServices;
    });
  }, [category, searchQuery, selectedRating, selectedBudget, selectedCity, selectedServices]);

  const resetAll = () => {
    setSearchQuery("");
    setSelectedRating(null);
    setSelectedBudget(null);
    setSelectedServices([]);
    setSelectedCity(null);
  };

  const hasFilters = !!(searchQuery || selectedRating || selectedBudget || selectedCity || selectedServices.length);

  // Sidebar: budget circles and type cards
  const budgetCircles = [
    { label: "Under ₹50K", value: "Under 50K", emoji: "🌸" },
    { label: "₹50K – 1L", value: "50K-1L", emoji: "💫" },
    { label: "Above ₹1L", value: "1L+", emoji: "👑" },
  ];

  return (
    <div className="bg-[#FFF5F6] min-h-screen">
      {/* â”€â”€ Header Section â”€â”€ */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-6">
            <Link to="/wedding" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-500">Vendors</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            {/* Title & Count */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                Wedding {category}
              </h1>
              <p className="text-[13px] text-slate-600">
                Showing <span className="font-bold text-slate-800">{filteredVendors.length} results</span> as per your search criteria
              </p>
            </div>

            {/* Search Bar - Fixed to Left */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-[320px]">
                <input
                  type="text"
                  placeholder={`Search Wedding ${category}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-[14px] bg-white focus:outline-none focus:border-primary w-full shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ City Circles â”€â”€ */}
      <div className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-4 overflow-x-auto no-scrollbar">
          {citiesData.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${selectedCity === city.name ? "border-primary shadow-md" : "border-transparent group-hover:border-primary/50"}`}>
                <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
              </div>
              <span className={`text-[11px] font-bold text-center leading-tight whitespace-nowrap transition-colors ${selectedCity === city.name ? "text-primary" : "text-slate-500 group-hover:text-primary"}`}>
                {city.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* â”€â”€ Main Content â”€â”€ */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div>
          {/* Vendor List */}
          {filteredVendors.length > 0 ? (
            <div className={`grid grid-cols-1 ${viewMode === 'list' ? 'sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'}`}>
              {filteredVendors.map((vendor, i) => (
                <ScrollReveal key={vendor.id} delay={i * 40}>
                  <VendorCard vendor={vendor} viewMode={viewMode} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100 max-w-3xl mx-auto mt-10">
              <div className="text-5xl mb-4">ðŸ”</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No results found</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed mb-6">
                We couldn't find any vendors matching your current filters.
              </p>
              <button
                onClick={resetAll}
                className="px-8 py-3 bg-primary text-white font-bold rounded-full text-sm hover:shadow-lg transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorListingPage;
