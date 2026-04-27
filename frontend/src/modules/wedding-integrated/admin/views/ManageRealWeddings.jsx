import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  getAllDestinations, 
  getAdminRealWeddings, 
  saveAdminRealWedding, 
  updateAdminRealWedding, 
  deleteAdminRealWedding 
} from '../../services/storage';
import { adminStyles } from '../theme/themeConfig';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  Users,
  Camera,
  Heart,
  Search,
  PlusCircle,
  X,
  Upload,
  Trash,
  IndianRupee,
  Calendar,
  Pencil,
  ChevronDown
} from 'lucide-react';

const ManageRealWeddings = () => {
  const [weddings, setWeddings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [editingWedding, setEditingWedding] = useState(null);
  const [newWedding, setNewWedding] = useState({
    coupleName: '',
    location: '',
    destinationId: '',
    guests: '',
    budgetMin: '',
    budgetMax: '',
    coverImage: '',
    photos: []
  });

  useEffect(() => {
    setWeddings(getAdminRealWeddings());
    setDestinations(getAllDestinations());
  }, []);

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === 'coverImage') {
        setNewWedding({ ...newWedding, coverImage: reader.result });
      } else {
        setNewWedding({ ...newWedding, photos: [...newWedding.photos, reader.result] });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newWedding.coupleName || !newWedding.destinationId || !newWedding.coverImage) {
      alert("Please fill in required fields (Couple Name, Destination, Cover Image)");
      return;
    }

    const selectedDest = destinations.find(d => d.id === newWedding.destinationId);
    const weddingData = {
      ...newWedding,
      location: selectedDest?.name || newWedding.location,
      guests: Number(newWedding.guests)
    };
    
    if (editingWedding) {
      updateAdminRealWedding({
        ...weddingData,
        id: editingWedding.id
      });
    } else {
      saveAdminRealWedding(weddingData);
    }
    
    setWeddings(getAdminRealWeddings());
    resetForm();
  };

  const handleEdit = (wedding) => {
    setEditingWedding(wedding);
    setNewWedding({
      coupleName: wedding.coupleName,
      location: wedding.location,
      destinationId: wedding.destinationId,
      guests: wedding.guests,
      budgetMin: wedding.budgetMin,
      budgetMax: wedding.budgetMax,
      coverImage: wedding.coverImage,
      photos: wedding.photos || []
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingWedding(null);
    setNewWedding({
      coupleName: '',
      location: '',
      destinationId: '',
      guests: '',
      budgetMin: '',
      budgetMax: '',
      coverImage: '',
      photos: []
    });
  };

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this wedding story?")) {
      deleteAdminRealWedding(id);
      setWeddings(getAdminRealWeddings());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Real Weddings Gallery</h2>
            <p className="text-gray-500 text-sm mt-1">Manage the wedding stories and galleries shown to users</p>
          </div>
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 px-6 py-3 bg-[hsl(353,45%,35%)] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 leading-none"
          >
             <Plus size={18} /> Add New Wedding
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {weddings.map((wedding) => (
           <div key={wedding.id} className={`${adminStyles.glassCard} p-6 rounded-[2rem] group relative overflow-hidden h-80`}>
              <img 
                src={wedding.coverImage} 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700" 
                alt={wedding.coupleName}
              />
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex justify-between items-start mb-auto">
                    <span className="px-4 py-1.5 bg-[hsl(353,45%,35%)] text-white rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                       {wedding.location}
                    </span>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleEdit(wedding)}
                         className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                       >
                          <Pencil size={16} />
                       </button>
                       <button 
                         onClick={() => handleDelete(wedding.id)}
                         className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
                 
                 <div className="mt-auto p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 shadow-sm">
                    <h3 className="text-2xl font-black text-[hsl(353,20%,15%)] leading-none mb-2">{wedding.coupleName}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                       <Users size={14} className="text-[#B06A6C]"/> {wedding.guests} Guests
                    </div>

                    <div className="mt-4 pt-4 border-t border-[hsl(353,45%,35%)]/10 flex justify-between items-center">
                       <div>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Budget Range</p>
                          <p className="text-sm font-black text-slate-800">{wedding.budgetMin} â€” {wedding.budgetMax}</p>
                       </div>
                       <span className="text-[10px] font-black text-[#B06A6C] uppercase tracking-widest flex items-center gap-1 bg-[#B06A6C]/10 px-3 py-1 rounded-full">
                          {wedding.photos?.length || 0} PHOTOS
                       </span>
                    </div>
                 </div>
              </div>
           </div>
         ))}
         
         {weddings.length === 0 && (
           <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-[#B06A6C]/20 rounded-[2.5rem] bg-white/30 backdrop-blur-sm">
              <PlusCircle size={48} className="text-[#B06A6C]/20 mb-4" />
              <p className="text-gray-400 font-medium">No real weddings added yet.</p>
           </div>
         )}
      </div>

      {/* Add Form Modal Overlay */}
      {showAddForm && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white/90 backdrop-blur-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-8 md:p-12 relative border border-white/40 no-scrollbar">
              <button 
                onClick={resetForm}
                className="absolute right-8 top-8 p-3 hover:bg-slate-100 rounded-2xl transition-colors"
              >
                 <X size={24} className="text-slate-400" />
              </button>

              <h3 className="text-3xl font-serif text-[hsl(353,45%,35%)] mb-8">
                {editingWedding ? 'Edit Wedding Story' : 'Add Wedding Story'}
              </h3>
              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Heart size={12} /> Couple Name
                    </label>
                    <input 
                      required
                      value={newWedding.coupleName}
                      onChange={e => setNewWedding({...newWedding, coupleName: e.target.value})}
                      placeholder="e.g. Anita & Rohit"
                      className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <MapPin size={12} /> Destination
                    </label>
                    <div className="relative">
                       <div 
                         onClick={() => setShowDestDropdown(!showDestDropdown)}
                         className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 cursor-pointer flex justify-between items-center"
                       >
                          <span className={newWedding.destinationId ? "text-black" : "text-gray-400"}>
                            {newWedding.destinationId ? destinations.find(d => d.id === newWedding.destinationId)?.name || 'Select Destination' : 'Select Destination'}
                          </span>
                          <ChevronDown size={16} className={`text-gray-400 transition-transform ${showDestDropdown ? 'rotate-180' : ''}`} />
                       </div>
                       
                       {showDestDropdown && (
                         <div className="absolute z-50 w-full mt-2 bg-white border border-[#B06A6C]/20 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                            <div 
                               className="px-5 py-3 hover:bg-[#B06A6C]/5 cursor-pointer text-sm text-gray-500 transition-colors"
                               onClick={() => { setNewWedding({...newWedding, destinationId: ""}); setShowDestDropdown(false); }}
                            >
                               Select Destination
                            </div>
                            {destinations.map(d => (
                               <div 
                                 key={d.id} 
                                 className={`px-5 py-3 cursor-pointer text-sm transition-colors ${newWedding.destinationId === d.id ? 'bg-[#B06A6C]/10 text-[#B06A6C] font-bold' : 'hover:bg-[#B06A6C]/5 text-gray-700'}`}
                                 onClick={() => { setNewWedding({...newWedding, destinationId: d.id}); setShowDestDropdown(false); }}
                               >
                                 {d.name}
                               </div>
                            ))}
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Users size={12} /> No. of Guests
                    </label>
                    <input 
                      type="number"
                      required
                      value={newWedding.guests}
                      onChange={e => setNewWedding({...newWedding, guests: e.target.value})}
                      placeholder="e.g. 150"
                      className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          Min Budget
                        </label>
                        <input 
                          required
                          value={newWedding.budgetMin}
                          onChange={e => setNewWedding({...newWedding, budgetMin: e.target.value})}
                          placeholder="e.g. ₹35L"
                          className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          Max Budget
                        </label>
                        <input 
                          required
                          value={newWedding.budgetMax}
                          onChange={e => setNewWedding({...newWedding, budgetMax: e.target.value})}
                          placeholder="e.g. ₹50L"
                          className="w-full px-5 py-3 bg-white border border-[#B06A6C]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20"
                        />
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <ImageIcon size={12} /> Cover Image
                    </label>
                    <div className="relative group">
                       <input 
                         type="file" 
                         id="wedding-cover-upload"
                         accept="image/*"
                         onChange={e => handleImageChange(e, 'coverImage')}
                         className="hidden" 
                       />
                       
                       {!newWedding.coverImage ? (
                         <label 
                           htmlFor="wedding-cover-upload"
                           className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#B06A6C]/20 rounded-3xl bg-white/50 hover:bg-[#B06A6C]/5 hover:border-[#B06A6C]/40 transition-all cursor-pointer"
                         >
                            <div className="flex flex-col items-center gap-2">
                               <Upload size={20} className="text-[#B06A6C]" />
                               <p className="text-sm font-bold text-slate-600">Click to upload cover photo</p>
                            </div>
                         </label>
                       ) : (
                         <div className="relative h-48 w-full rounded-3xl overflow-hidden border border-[#B06A6C]/20">
                            <img src={newWedding.coverImage} className="w-full h-full object-cover" alt="Cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                               <label htmlFor="wedding-cover-upload" className="p-3 bg-white text-[hsl(353,45%,35%)] rounded-2xl cursor-pointer">
                                  <Upload size={20} />
                               </label>
                               <button type="button" onClick={() => setNewWedding({ ...newWedding, coverImage: '' })} className="p-3 bg-white text-red-500 rounded-2xl">
                                  <Trash size={20} />
                               </button>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Camera size={12} /> Gallery Photos ({newWedding.photos?.length || 0})
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                       {newWedding.photos?.map((img, idx) => (
                         <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group/img">
                            <img src={img} className="w-full h-full object-cover" alt="" />
                            <button 
                              type="button" 
                              onClick={() => setNewWedding({ ...newWedding, photos: newWedding.photos.filter((_, i) => i !== idx) })}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                               <Trash2 size={16} className="text-white" />
                            </button>
                         </div>
                       ))}
                       <label className="aspect-square border-2 border-dashed border-[#B06A6C]/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#B06A6C]/5 transition-all">
                          <Plus size={20} className="text-[#B06A6C]" />
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            onChange={e => handleImageChange(e, 'photos')} 
                          />
                       </label>
                    </div>
                 </div>

                 <div className="md:col-span-2 pt-4">
                    <button type="submit" className="w-full py-4 bg-[hsl(353,45%,35%)] text-white rounded-[2rem] font-bold shadow-xl shadow-[hsl(353,45%,35%)]/20 hover:scale-[1.02] active:scale-95 transition-all">
                       {editingWedding ? 'Update Wedding Story' : 'Save Wedding Story'}
                    </button>
                 </div>
              </form>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManageRealWeddings;
