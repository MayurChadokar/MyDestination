import React from "react";
import { X } from "lucide-react";

const RealWeddingGalleryModal = ({ isOpen, onClose, wedding }) => {
  if (!isOpen || !wedding) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
      {/* Header - Fixed at top */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 py-4 z-20">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            {wedding.coupleName}
          </h2>
          <p className="text-[10px] md:text-sm text-primary uppercase tracking-[0.2em] font-bold">
            {wedding.location}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all group border border-slate-200"
        >
          <X className="w-5 h-5 text-slate-500 group-hover:text-slate-900 group-hover:rotate-90 transition-all duration-300" />
        </button>
      </div>

      {/* Scrollable Gallery Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/30">
        <div className="max-w-6xl mx-auto p-4 md:p-12">
          {/* Custom Masonry-like Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {wedding.photos.map((photo, i) => (
              <div 
                key={i} 
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group relative"
              >
                <img
                  src={photo}
                  alt={`Wedding moment ${i + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
          
          {/* Footer inside scroll area for padding */}
          <div className="py-20 text-center opacity-20 select-none">
            <p className="text-sm font-medium tracking-[0.5em] uppercase">The End of Story</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealWeddingGalleryModal;
