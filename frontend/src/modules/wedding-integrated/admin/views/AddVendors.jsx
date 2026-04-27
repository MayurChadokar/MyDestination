import React, { useState } from 'react';
import { adminStyles } from '../theme/themeConfig';
import { Plus, X, Save, Image as ImageIcon, Tag, Briefcase, PlusCircle, Trash } from 'lucide-react';
import { saveAdminVendor } from '../../services/storage';

const AddVendors = () => {
  const [vendorData, setVendorData] = useState({
    name: '',
    category: '',
    location: '',
    image: '',
  });

  const [subsections, setSubsections] = useState(['']);

  const handleAddSubsection = () => {
    setSubsections([...subsections, '']);
  };

  const handleRemoveSubsection = (index) => {
    const newList = [...subsections];
    newList.splice(index, 1);
    setSubsections(newList);
  };

  const handleSubsectionChange = (index, value) => {
    const newList = [...subsections];
    newList[index] = value;
    setSubsections(newList);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setVendorData({ ...vendorData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!vendorData.name || !vendorData.category) {
      alert("Please enter vendor name and category!");
      return;
    }
    
    const newVendor = {
      ...vendorData,
      subsections: subsections.filter(s => s.trim() !== ''),
      rating: 5.0,
      reviews: 0,
      price: "₹Contact for Pricing",
      priceUnit: "onwards",
      tags: ["New", "Verified"],
      isFeatured: true, // Show to users prominently
      isCustom: true
    };
    
    saveAdminVendor(newVendor);
    alert(`Vendor ${vendorData.name} saved successfully!`);
    
    // Reset Form
    setVendorData({ name: '', category: '', location: '', image: '' });
    setSubsections(['']);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Add New Vendor</h2>
          <p className="text-gray-500 text-sm mt-1">Create a new vendor profile with specific service categories</p>
        </div>
        <button 
          onClick={handleSave}
          className={`${adminStyles.primaryButton} flex items-center gap-2 px-8 py-3 rounded-2xl font-bold shadow-xl shadow-[hsl(353,45%,35%)]/20 active:scale-95 transition-all`}
        >
          <Save size={20} />
          Save Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`${adminStyles.glassCard} p-8 rounded-3xl space-y-6`}>
             <h3 className={`${adminStyles.heading} text-xl font-bold flex items-center gap-2`}>
                <Briefcase size={20} /> Basic Information
             </h3>
             
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Vendor Name</label>
                  <input 
                    type="text" 
                    value={vendorData.name}
                    onChange={(e) => setVendorData({...vendorData, name: e.target.value})}
                    placeholder="e.g. Royal Makeup Artistry"
                    className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Category</label>
                    <input 
                      type="text" 
                      value={vendorData.category}
                      onChange={(e) => setVendorData({...vendorData, category: e.target.value})}
                      placeholder="e.g. Photographers"
                      className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      value={vendorData.location}
                      onChange={(e) => setVendorData({...vendorData, location: e.target.value})}
                      placeholder="e.g. Goa, India"
                      className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
          </div>

          <div className={`${adminStyles.glassCard} p-8 rounded-3xl space-y-6`}>
             <div className="flex items-center justify-between">
                <h3 className={`${adminStyles.heading} text-xl font-bold flex items-center gap-2`}>
                    <Tag size={20} /> Service Subsections
                </h3>
                <button 
                  onClick={handleAddSubsection}
                  className="flex items-center gap-1.5 text-sm font-bold text-[hsl(353,45%,35%)] hover:bg-[hsl(353,45%,35%)]/5 px-3 py-1.5 rounded-lg transition-all"
                >
                  <PlusCircle size={16} /> Add Subsection
                </button>
             </div>
             
             <p className="text-sm text-gray-500 italic">Add specific services like 'Bridal Makeup', 'Regular Makeup' etc.</p>

             <div className="space-y-3">
                {subsections.map((sub, index) => (
                  <div key={index} className="flex items-center gap-3 animate-in slide-in-from-right-2 duration-300">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={sub}
                        onChange={(e) => handleSubsectionChange(index, e.target.value)}
                        placeholder={`Subsection ${index + 1} (e.g. Bridal Makeup)`}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/40 bg-white/30 focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] focus:bg-white transition-all"
                      />
                    </div>
                    {subsections.length > 1 && (
                      <button 
                        onClick={() => handleRemoveSubsection(index)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar help / Media */}
        <div className="space-y-6">
          <div className={`${adminStyles.glassCard} p-8 rounded-3xl space-y-6`}>
             <h3 className={`${adminStyles.heading} text-lg font-bold flex items-center gap-2`}>
                <ImageIcon size={18} /> Media & Assets
             </h3>
             <label className="aspect-square relative rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 gap-2 hover:border-[hsl(353,45%,35%)] hover:text-[hsl(353,45%,35%)] transition-all cursor-pointer bg-white/20 overflow-hidden">
                {!vendorData.image ? (
                  <>
                    <Plus size={32} />
                    <span className="text-xs font-bold text-center px-4">Upload Cover Photo</span>
                  </>
                ) : (
                  <>
                     <img src={vendorData.image} alt="Upload Preview" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={(e) => { e.preventDefault(); setVendorData({...vendorData, image: ''}); }} className="p-3 bg-white text-red-500 rounded-full">
                           <Trash size={18} />
                        </button>
                     </div>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
             </label>
             <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Recommended: 800x600px</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-[hsl(353,45%,35%)] to-[hsl(353,45%,45%)] rounded-3xl text-white shadow-xl">
             <h4 className="font-bold flex items-center gap-2 mb-2">
                <PlusCircle size={18} /> Quick Tip
             </h4>
             <p className="text-xs opacity-90 leading-relaxed">
                Adding detailed subsections helps users filter vendors more accurately. For a photographer, subsections could be 'Candid', 'Traditional', and 'Cinematography'.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVendors;
