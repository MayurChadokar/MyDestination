import React, { useState, useEffect } from 'react';
import { getVendorVenues, updateVenueStatus, getAllDestinations } from '../../services/storage';
import { adminStyles } from '../theme/themeConfig';
import { 
  Building2, 
  MapPin, 
  Check, 
  X, 
  Users, 
  IndianRupee, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVenues(getVendorVenues());
    setDestinations(getAllDestinations());
  };

  const handleAction = (id, status) => {
    updateVenueStatus(id, status);
    loadData();
  };

  const getDestName = (id) => {
    const d = destinations.find(dest => dest.id === id);
    return d ? d.name : 'Unknown';
  };

  const pendingCount = venues.filter(v => v.status === 'pending').length;

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
                    <tr key={venue.id} className="group hover:bg-white/40 transition-all duration-300">
                       <td className="py-8 pr-12 min-w-[250px]">
                          <div className="flex items-center gap-5">
                             <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-md">
                                <img src={venue.image} className="w-full h-full object-cover" alt={venue.name} />
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800 leading-tight mb-1">{venue.name}</h4>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By {venue.vendorName}</span>
                             </div>
                          </div>
                       </td>
                       <td className="py-8">
                          <div className="space-y-1">
                             <p className="text-sm font-black text-slate-700 flex items-center gap-1.5 leading-none">
                                <IndianRupee size={12} className="text-[#B06A6C]" /> ₹{(venue.pricePerDay / 1000).toFixed(0)}K
                             </p>
                             <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 leading-none">
                                <Users size={12} className="text-[#B06A6C]" /> {venue.capacity} Guests
                             </p>
                          </div>
                       </td>
                       <td className="py-8">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                             <MapPin size={14} className="text-[#B06A6C]" /> {getDestName(venue.destinationId)}
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
                          {venue.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => handleAction(venue.id, 'approved')}
                                 className="h-10 w-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                 title="Approve"
                               >
                                  <Check size={18} />
                               </button>
                               <button 
                                 onClick={() => handleAction(venue.id, 'rejected')}
                                 className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                 title="Reject"
                               >
                                  <X size={18} />
                               </button>
                            </div>
                          ) : (
                            <button className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-300 rounded-xl border border-slate-100 cursor-not-allowed">
                               <ShieldCheck size={18} />
                            </button>
                          )}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         {venues.length === 0 && (
           <div className="py-24 flex flex-col items-center justify-center opacity-40">
              <Building2 size={48} className="text-[#B06A6C] mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No pending venue verification requests</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default ManageVenues;
