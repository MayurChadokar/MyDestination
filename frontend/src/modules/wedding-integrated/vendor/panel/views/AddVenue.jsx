import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  IndianRupee, 
  Type, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Upload,
  Trash,
  Plus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VendorLayout from '../layouts/VendorLayout';
import { weddingService } from '../../../../../services/weddingService';
import toast from 'react-hot-toast';

const ALL_AMENITIES = [
  'Bridal Suite',
  'On-site Catering',
  'Decor & Design',
  'Audio Visual Equipment',
  'Guest Accommodation',
  'Complimentary Parking',
  'Valet Service',
  'Power Backup',
];

const toggleAmenity = (list, item) =>
  list.includes(item) ? list.filter(a => a !== item) : [...list, item];

const AddVenue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const editVenue = location.state?.editVenue;

  const [destinations, setDestinations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialCustomAmenities = editVenue?.amenities?.filter(a => !ALL_AMENITIES.includes(a)) || [];
  const [customAmenities, setCustomAmenities] = useState(initialCustomAmenities);
  
  const [formData, setFormData] = useState(editVenue ? {
    name: editVenue.name || '',
    destinationId: editVenue.destinationId || '',
    type: editVenue.type || 'Resort',
    capacity: editVenue.capacity || '',
    pricePerDay: editVenue.pricePerDay || '',
    description: editVenue.description || '',
    image: editVenue.image || '',
    amenities: editVenue.amenities || [],
    rentalHours: editVenue.rentalHours || '12 PM – 12 AM',
    cancellationPolicy: editVenue.cancellationPolicy || 'Flexible (4 weeks)',
    outsideCatering: editVenue.outsideCatering || 'Permitted',
    alcoholPolicy: editVenue.alcoholPolicy || 'Allowed',
  } : {
    name: '',
    destinationId: '',
    type: 'Resort',
    capacity: '',
    pricePerDay: '',
    description: '',
    image: '',
    amenities: [],
    rentalHours: '12 PM – 12 AM',
    cancellationPolicy: 'Flexible (4 weeks)',
    outsideCatering: 'Permitted',
    alcoholPolicy: 'Allowed',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size first, and compress if needed or just compress everything to be safe
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 1200px
        const MAX_DIM = 1200;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to 0.7 quality JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
        toast.info("Image Optimized", { 
          description: "Compressed for faster submission" 
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await weddingService.getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        pricePerDay: Number(formData.pricePerDay),
      };

      if (editVenue) {
        await weddingService.updateVendorVenue(editVenue._id, payload);
        toast.success("Venue Updated", { description: "Your changes have been saved and sent for re-verification." });
      } else {
        await weddingService.createVendorVenue(payload);
        toast.success("Venue Submitted", { description: "Property has been sent for admin verification." });
      }
      navigate('/wedding/vendor/venues/my');
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Submission Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VendorLayout title={editVenue ? "Edit Venue" : "Add Venue"}>
    <div className="max-w-6xl mx-auto pt-0 pb-4 md:py-8 px-2 md:px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-2 md:mb-8 text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest leading-none">
         <span>My Venues</span>
         <ChevronRight size={14} />
         <span className="text-[#B06A6C]">{editVenue ? "Edit Venue" : "Add New Venue"}</span>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[3rem] border border-[#B06A6C]/10 shadow-2xl overflow-hidden">
         <div className="p-4 md:p-12 border-b border-[#B06A6C]/5 bg-gradient-to-r from-[#B06A6C]/5 to-transparent">
            <h2 className="text-lg md:text-3xl font-serif text-[hsl(353,45%,35%)] mb-0.5 md:mb-2">{editVenue ? "Edit Venue" : "Venue Submission"}</h2>
            <p className="hidden md:block text-gray-500 text-sm">{editVenue ? "Update information for your existing property listing." : "Provide detailed information about your property for Admin verification."}</p>
         </div>

         <form onSubmit={handleSubmit} className="p-4 md:p-12 grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8">
            <div className="col-span-2 space-y-1 md:space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Type size={12} /> Venue Name
               </label>
               <input 
                 required
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
                 placeholder="e.g. Moonlight Palace"
                 className="w-full px-5 py-3 md:py-4 bg-white border border-[#B06A6C]/20 rounded-xl md:rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 transition-all font-medium"
               />
            </div>

            <div className="col-span-1 space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> Destination
               </label>
               <div className="relative group">
                  <select 
                    required
                    value={formData.destinationId}
                    onChange={e => setFormData({...formData, destinationId: e.target.value})}
                    className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 focus:border-[#B06A6C] transition-all font-medium appearance-none cursor-pointer"
                  >
                     <option value="">Select Destination</option>
                     {destinations.map(d => (
                       <option key={d._id} value={d._id}>{d.name}</option>
                     ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B06A6C] w-4 h-4 pointer-events-none group-hover:scale-110 transition-transform" />
               </div>
            </div>

            <div className="col-span-1 space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={12} /> Venue Type
               </label>
               <div className="relative group">
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 focus:border-[#B06A6C] transition-all font-medium appearance-none cursor-pointer"
                  >
                     <option>Palace</option>
                     <option>Resort</option>
                     <option>Banquet</option>
                     <option>Farmhouse</option>
                     <option>Heritage Haveli</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B06A6C] w-4 h-4 pointer-events-none group-hover:scale-110 transition-transform" />
               </div>
            </div>

            <div className="col-span-1 space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Users size={12} /> Capacity (Guests)
               </label>
               <input 
                 type="number"
                 required
                 value={formData.capacity}
                 onChange={e => setFormData({...formData, capacity: e.target.value})}
                 placeholder="e.g. 500"
                 className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 transition-all font-medium"
               />
            </div>

            <div className="col-span-1 space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee size={12} /> Price Per Day
               </label>
               <input 
                 type="number"
                 required
                 value={formData.pricePerDay}
                 onChange={e => setFormData({...formData, pricePerDay: e.target.value})}
                 placeholder="e.g. 150000"
                 className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 transition-all font-medium"
               />
            </div>

            <div className="col-span-2 space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={12} /> Cover Image
               </label>
               <div className="relative group">
                  <input
                    type="file"
                    id="venue-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {!formData.image ? (
                    <label
                      htmlFor="venue-image-upload"
                      className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#B06A6C]/20 rounded-xl bg-white hover:bg-[#B06A6C]/5 hover:border-[#B06A6C]/40 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-xl bg-[#B06A6C]/10 flex items-center justify-center text-[#B06A6C]">
                          <Upload size={18} />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-600">Click to upload</p>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="relative h-28 w-full rounded-xl overflow-hidden border border-[#B06A6C]/20 shadow-lg">
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label htmlFor="venue-image-upload" className="p-2 bg-white text-[hsl(353,45%,35%)] rounded-xl cursor-pointer hover:scale-110 transition-transform">
                          <Upload size={16} />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="p-2 bg-white text-red-500 rounded-xl hover:scale-110 transition-transform"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  )}
               </div>
            </div>



            {/* ---- DESCRIPTION ---- */}
            <div className="col-span-2 space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={12} /> Description
               </label>
               <textarea 
                 required
                 value={formData.description}
                 onChange={e => setFormData({...formData, description: e.target.value})}
                 placeholder="Tell us what makes this venue special..."
                 className="w-full h-24 px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 transition-all font-medium"
               />
            </div>

            <div className="col-span-2 pt-2">
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full py-4 md:py-5 bg-[hsl(353,45%,35%)] text-white rounded-2xl md:rounded-[2rem] font-bold shadow-xl shadow-[hsl(353,45%,35%)]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
               >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      {editVenue ? 'Update Venue Details' : 'Submit Venue for Approval'}
                    </>
                  )}
               </button>
            </div>
         </form>
      </div>
    </div>
    </VendorLayout>
  );
};

export default AddVenue;
