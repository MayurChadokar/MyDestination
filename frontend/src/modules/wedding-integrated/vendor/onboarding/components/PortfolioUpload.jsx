import { useRef } from "react";
import { Upload, X, ImagePlus } from "lucide-react";

const PortfolioUpload = ({ images = [], onUpdate }) => {
  const fileRef = useRef(null);

  const handleFiles = (files) => {
    const newPreviews = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => URL.createObjectURL(f));
    onUpdate([...images, ...newPreviews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          Click or drag images here
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG up to 5MB each
        </p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative group/img aspect-square rounded-xl overflow-hidden border border-border">
              <img
                src={src}
                alt={`Portfolio ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Add</span>
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        {images.length} image{images.length !== 1 ? "s" : ""} selected
      </p>
    </div>
  );
};

export default PortfolioUpload;
