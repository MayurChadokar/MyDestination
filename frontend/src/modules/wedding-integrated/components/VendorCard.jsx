import React, { useState } from "react";
import { Star, MapPin, Heart, Phone, Mail, Check } from "lucide-react";
import { Link } from "react-router-dom";

const VendorCard = ({ vendor, viewMode = "grid" }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  if (viewMode === "list") {
    return (
      <Link
        to={`/wedding/vendors/${vendor.id}`}
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 group flex flex-col md:flex-row h-full"
        style={{ textDecoration: "none" }}
      >
        {/* â”€â”€ Left: Image Gallery â”€â”€ */}
        <div className="relative md:w-[45%] lg:w-[48%] shrink-0">
          {/* Featured image */}
          <div className="relative h-48 md:h-full overflow-hidden">
            <img
              src={vendor.images?.[0] || vendor.image}
              alt={vendor.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Badge */}
            {vendor.isFeatured && (
              <div className="absolute top-0 left-0">
                <div className="bg-[#E72365] text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1.5 flex items-center gap-1 shadow-md">
                  <span>👑</span> Handpicked
                </div>
              </div>
            )}
            {vendor.isSponsored && (
              <div className="absolute top-0 right-0">
                <div className="bg-black/80 text-white text-[10px] font-semibold px-2.5 py-1">
                  Featured
                </div>
              </div>
            )}
            {/* Shortlist heart */}
            <button
              className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors group/heart"
              onClick={toggleLike}
            >
              <Heart className={`w-4 h-4 transition-all duration-300 ${liked ? "fill-[#E72365] text-[#E72365]" : "text-white"}`} />
            </button>
          </div>

          {/* Thumbnail row */}
          {vendor.images?.length > 1 && (
            <div className="hidden md:flex absolute bottom-0 left-0 right-0 gap-0.5 p-0.5 bg-gradient-to-t from-black/40">
              {vendor.images.slice(1, 4).map((img, i) => (
                <div key={i} className="flex-1 h-14 overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* â”€â”€ Right: Info â”€â”€ */}
        <div className="flex-1 p-3.5 md:p-5 flex flex-col justify-between bg-white">
          <div>
            {/* Name + verified + rating */}
            <div className="flex items-start justify-between gap-2 mb-0.5 md:mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-[15px] md:text-[17px] font-bold text-[#333] leading-tight group-hover:text-primary transition-colors">
                  {vendor.name}
                </h3>
                <div className="w-4 h-4 bg-[#1DA1F2] rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                </div>
              </div>
              <div className="flex items-center gap-1 bg-green-600 text-white text-[11px] font-bold px-1.5 py-1 rounded shrink-0 leading-none">
                <Star className="w-3 h-3 fill-white" />
                {vendor.rating}
              </div>
            </div>

            <p className="text-[11px] md:text-[12px] text-[#2a8ccc] font-medium mb-1.5 md:mb-2 hover:underline cursor-pointer inline-block" onClick={(e) => { e.preventDefault(); }}>
              {vendor.reviews} reviews
            </p>

            <div className="flex items-center gap-1.5 text-[12px] md:text-[13px] text-slate-500 font-medium mb-2 md:mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {vendor.location}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2.5 md:mb-3">
              {vendor.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 md:py-1 bg-white border border-slate-200 text-[10px] md:text-[11px] font-semibold text-slate-500 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-2.5 md:mb-3">
              <span className="text-[16px] md:text-[18px] font-bold text-[#333]">{vendor.price}</span>
              <span className="text-[10px] md:text-[11px] font-medium text-slate-500 ml-1">{vendor.priceUnit}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 md:mb-5">
              {vendor.avgBooking && (
                <div className="bg-slate-50 border border-slate-100 text-[9px] md:text-[10px] font-semibold text-slate-500 px-2 py-0.5 md:py-1 rounded">
                  {vendor.avgBooking}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 bg-[#ad2d45] text-white rounded text-[12px] md:text-[13px] font-bold mr-1" onClick={(e) => { e.preventDefault(); }}>
              <Mail className="w-3 h-3" /> Message
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 border border-slate-300 text-[#555] rounded text-[12px] md:text-[13px] font-bold" onClick={(e) => { e.preventDefault(); }}>
              <Phone className="w-3 h-3" /> Call
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // --- Grid View (Reduced Height for Mobile) ---
  return (
    <Link
      to={`/wedding/vendors/${vendor.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 border border-slate-100 group flex flex-col h-full relative"
      style={{ textDecoration: "none" }}
    >
      <div className="relative w-full aspect-[2.2/1] sm:aspect-[16/9] shrink-0 overflow-hidden bg-slate-100">
        <img
          src={vendor.images?.[0] || vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {vendor.isFeatured && (
          <div className="absolute top-0 left-0 z-10">
            <div className="bg-[#E72365] text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 flex items-center shadow-sm rounded-br-lg">
              👑 Handpicked
            </div>
          </div>
        )}
        <button
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/20 backdrop-blur-[2px] rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10 group/heart"
          onClick={toggleLike}
        >
          <Heart className={`w-3 h-3 transition-all duration-300 ${liked ? "fill-[#E72365] text-[#E72365]" : "text-white"}`} />
        </button>
        {vendor.images?.length > 1 && (
          <div className="absolute bottom-1.5 right-1.5 bg-white/90 px-1 py-0.5 rounded text-[8px] font-bold text-slate-700 flex items-center gap-0.5 opacity-90">
             ðŸ–¼ï¸ {vendor.images.length}
          </div>
        )}
      </div>

      <div className="p-2 sm:p-3 flex flex-col flex-1 bg-white">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <h3 className="text-[12px] sm:text-[14px] font-extrabold text-[#333] leading-tight truncate">
            {vendor.name}
          </h3>
          <div className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-[#333] shrink-0">
            <Star className="w-2.5 h-2.5 fill-[#E72365] text-[#E72365]" />
            {vendor.rating}
          </div>
        </div>

        <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-[#777] font-medium mb-0.5 truncate">
          <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
          {vendor.location}
        </div>

        <p className="text-[9px] sm:text-[10px] text-[#888] font-medium mb-0.5 truncate">
          {vendor.category === "Photographers" ? "Photo + Video" : vendor.category}
        </p>

        <div className="mb-1 sm:mb-2">
          <span className="text-[12px] sm:text-[14px] font-extrabold text-[#333]">{vendor.price}</span>
          <span className="text-[8px] sm:text-[9px] font-medium text-slate-500 ml-1">{vendor.priceUnit}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1 mt-auto">
          {vendor.isFeatured && (
            <div className="bg-[#f0f0f0] text-[#666] text-[8px] font-semibold px-1 py-0.5 rounded truncate max-w-[100px]">
              Awards Winner
            </div>
          )}
          {vendor.extraTagsCount > 0 && (
             <div className="text-[8px] font-semibold text-slate-400 ml-0.5">
               +{vendor.extraTagsCount} more
             </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;
