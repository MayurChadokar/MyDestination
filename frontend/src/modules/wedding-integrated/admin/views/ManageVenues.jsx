import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { weddingService } from '../../../../services/weddingService';
import { adminStyles } from '../theme/themeConfig';
import { 
  Building2, 
  MapPin, 
  Check, 
  X, 
  Users, 
  IndianRupee, 
  ShieldCheck,
  AlertCircle,
  Eye,
  Info,
  Layers,
  Star
} from 'lucide-react';

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await weddingService.getAdminVenues();
      setVenues(data);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      setLoading(true);
      await weddingService.updateVenueStatus(id, status);
      alert(`Venue ${status} successfully!`);
      if (selectedVenue?._id === id) setSelectedVenue(null);
      loadData();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = venues.filter(v => v.status === 'pending').length;

  if (loading && venues.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(353,45%,35%)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Venue Approval</h2>
            <p className="text-gray-500 text-sm mt-1">Verify and manage the property listings submitted by vendors</p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 font-bold text-xs animate-pulse">
               <AlertCircle size={14} /> {pendingCount} Pending Approvals
            </div>
          )}
        </div>
      </div>

      <div className={`${adminStyles.glassCard} p-10 rounded-[2.5rem] border border-[#B06A6C]/10`}>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[#B06A6C]/10">
                     <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Venue Details</th>
                     <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Pricing & Capacity</th>
                     <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Destination</th>
                     <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
                     <th className="pb-6 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Verification</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[hsl(353,45%,35%)]/5">
                  {venues.map((venue) => (
                    <tr key={venue._id} className="group hover:bg-white/40 transition-all duration-300">
                       <td className="py-8 pr-12 min-w-[250px]">
                          <div className="flex items-center gap-5">
                             <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-md cursor-pointer" onClick={() => setSelectedVenue(venue)}>
                                <img src={venue.image || venue.images?.[0]} className="w-full h-full object-cover" alt={venue.name} />
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800 leading-tight mb-1">{venue.name}</h4>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By {venue.vendorName || venue.vendor?.name || 'Unknown'}</span>
                             </div>
                          </div>
                       </td>
                       <td className="py-8">
                          <div className="space-y-1">
                             <p className="text-sm font-black text-slate-700 flex items-center gap-1.5 leading-none">
                                <IndianRupee size={12} className="text-[#B06A6C]" /> ₹{(venue.pricePerDay / 1000).toFixed(0)}K / Day
                             </p>
                             <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 leading-none">
                                <Users size={12} className="text-[#B06A6C]" /> {venue.capacity} Guests
                             </p>
                          </div>
                       </td>
                       <td className="py-8">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                             <MapPin size={14} className="text-[#B06A6C]" /> {venue.destination?.name || 'Unknown'}
                          </div>
                       </td>
                       <td className="py-8">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             venue.status === 'approved' ? 'bg-green-50 text-green-600' : 
                             venue.status === 'rejected' ? 'bg-red-50 text-red-600' : 
                             'bg-orange-50 text-orange-600'
                          }`}>
                             {venue.status}
                          </span>
                       </td>
                       <td className="py-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => setSelectedVenue(venue)}
                               className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-[#B06A6C] hover:text-white transition-all shadow-sm"
                               title="View Details"
                             >
                                <Eye size={18} />
                             </button>
                             {venue.status === 'pending' ? (
                               <>
                                 <button 
                                   onClick={() => handleAction(venue._id, 'approved')}
                                   className="h-10 w-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                   title="Approve"
                                 >
                                    <Check size={18} />
                                 </button>
                                 <button 
                                   onClick={() => handleAction(venue._id, 'rejected')}
                                   className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                   title="Reject"
                                 >
                                    <X size={18} />
                                 </button>
                               </>
                             ) : (
                               <div className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-300 rounded-xl border border-slate-100">
                                  <ShieldCheck size={18} />
                               </div>
                             )}
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         {venues.length === 0 && (
           <div className="py-24 flex flex-col items-center justify-center opacity-40">
              <Building2 size={48} className="text-[#B06A6C] mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No venue verification requests found</p>
           </div>
         )}
      </div>

      {/* Venue Detail Modal */}
      {selectedVenue && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedVenue(null)}
          />

          <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 z-[101]">
            <div className="relative h-64">
              <img src={selectedVenue.image || selectedVenue.images?.[0]} className="w-full h-full object-cover" alt={selectedVenue.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="px-3 py-1 bg-[#B06A6C] text-white rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mb-2">
                  {selectedVenue.status}
                </span>
                <h3 className="text-3xl font-black text-white">{selectedVenue.name}</h3>
                <p className="text-white/70 flex items-center gap-2 text-sm mt-1 italic">
                  <MapPin size={14} /> {selectedVenue.address || selectedVenue.destination?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedVenue(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[50vh] overflow-y-auto no-scrollbar">
              <div className="space-y-6">
                <div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={14} /> Description
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedVenue.description || "No description provided for this venue."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                    <p className="text-lg font-black text-slate-800">{selectedVenue.capacity} Guests</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing</p>
                    <p className="text-lg font-black text-emerald-600">₹{selectedVenue.pricePerDay?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layers size={14} /> Amenities
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedVenue.amenities?.length > 0 ? selectedVenue.amenities.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-100">
                          {item}
                        </span>
                      )) : <p className="text-xs text-slate-400">No amenities listed.</p>}
                    </div>
                 </div>

                 <div className="p-6 bg-[#B06A6C]/5 rounded-[2rem] border border-[#B06A6C]/10">
                    <h5 className="text-[10px] font-black text-[#B06A6C] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Star size={14} /> Vendor Info
                    </h5>
                    <p className="text-sm font-bold text-slate-800">{selectedVenue.vendorName || selectedVenue.vendor?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedVenue.vendor?.email}</p>
                 </div>
              </div>
            </div>

            {selectedVenue.status === 'pending' && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button
                  onClick={() => handleAction(selectedVenue._id, 'rejected')}
                  className="flex-1 py-4 bg-white border border-red-100 text-red-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-50 transition-all"
                >
                  Reject Venue
                </button>
                <button
                  onClick={() => handleAction(selectedVenue._id, 'approved')}
                  className="flex-1 py-4 bg-green-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Approve Venue
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManageVenues;
