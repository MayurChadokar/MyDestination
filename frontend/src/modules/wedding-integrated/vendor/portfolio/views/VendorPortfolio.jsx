import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  X,
  ImagePlus,
  Loader2,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { getVendor, updateVendor } from "../../data/vendorApi";

const VendorPortfolio = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const result = await getVendor();
      setVendor(result.vendor);
      setLoading(false);
    };
    fetch();
  }, []);

  const savePortfolio = async (portfolio) => {
    setSaving(true);
    const result = await updateVendor(vendor.id, { portfolio });
    setVendor(result.vendor);
    setSaving(false);
  };

  const handleFiles = (files) => {
    const newPreviews = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => URL.createObjectURL(f));
    const portfolio = [...(vendor.portfolio || []), ...newPreviews];
    savePortfolio(portfolio);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const portfolio = vendor.portfolio.filter((_, i) => i !== index);
    savePortfolio(portfolio);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const images = vendor?.portfolio || [];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <section className="wedding-gradient py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 text-background/70 hover:text-background text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1
            className="text-2xl md:text-4xl font-bold text-background"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Manage Portfolio
          </h1>
          <p className="text-background/70 text-sm mt-1">
            Showcase your best work to attract couples
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-4">
        {/* Upload Zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="p-8 rounded-2xl bg-card border-2 border-dashed border-border cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 group wedding-shadow"
        >
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Click or drag images to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG up to 5MB each
            </p>
            {saving && (
              <div className="flex items-center justify-center gap-2 mt-3 text-primary text-xs">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Image Grid */}
        {images.length > 0 ? (
          <div className="p-5 md:p-6 rounded-2xl bg-card border border-border wedding-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Your Portfolio ({images.length})
                </h2>
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <ImagePlus className="w-3 h-3" /> Add More
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-border animate-wedding-fade-up"
                >
                  <img
                    src={src}
                    alt={`Portfolio ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-card border border-border text-center wedding-shadow">
            <Camera className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No images in your portfolio yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your best work to attract more clients.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorPortfolio;
