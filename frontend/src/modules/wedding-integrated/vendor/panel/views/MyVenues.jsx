import React, { useState, useEffect } from 'react';
import { weddingService } from '../../../../../services/weddingService';
import { adminStyles } from '../../../admin/theme/themeConfig';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Users,
  IndianRupee,
  Edit2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VendorLayout from '../layouts/VendorLayout';

const MyVenues = () => {
  const { user } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const venuesData = await weddingService.getVendorVenues();
        setVenues(Array.isArray(venuesData) ? venuesData : []);
      } catch (error) {
        console.error("Error fetching vendor venues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-100/50 ring-2 ring-emerald-500/10';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm shadow-rose-100/50 ring-2 ring-rose-500/10';
      default: return 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm shadow-amber-100/50 animate-pulse ring-2 ring-amber-500/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle2 size={14} />;
      case 'rejected': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <VendorLayout title="My Venues">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(353,45%,35%)]"></div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout title="My Venues">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {venues.map((venue) => (
            <div key={venue._id} className={`${adminStyles.glassCard || 'bg-white'} p-8 rounded-[2.5rem] group relative overflow-hidden flex flex-col border border-[#B06A6C]/10 shadow-sm hover:shadow-md transition-all duration-300`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusStyle(venue.status)}`}>
                  {getStatusIcon(venue.status)} {venue.status}
                </div>
                <div className="flex gap-2">
                  <Link 
                    to="/vendor/venues/add" 
                    state={{ editVenue: venue }}
                    className="p-3 bg-white/50 border border-[#B06A6C]/10 rounded-2xl text-slate-400 hover:text-[#B06A6C] transition-all"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button className="p-3 bg-white/50 border border-[#B06A6C]/10 rounded-2xl text-slate-400 hover:text-[#B06A6C] transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="h-20 w-20 rounded-3xl bg-slate-100 overflow-hidden shrink-0 border-4 border-white shadow-lg">
                  <img 
                    src={venue.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2074&auto=format&fit=crop'} 
                    className="w-full h-full object-cover" 
                    alt={venue.name} 
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-none mb-2">{venue.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <MapPin size={14} className="text-[#B06A6C]" /> {venue.destination?.name || 'Venue Location'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#B06A6C]/5 mt-auto">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    <Users size={12} className="text-[#B06A6C]" /> Capacity
                  </p>
                  <p className="text-sm font-bold text-slate-700">{venue.capacity || 0} Guests</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    <IndianRupee size={12} className="text-[#B06A6C]" /> Pricing
                  </p>
                  <p className="text-sm font-bold text-slate-700">₹{(venue.pricePerDay / 1000).toFixed(0)}K / Day</p>
                </div>
              </div>

              {venue.status === 'rejected' && (
                <div className="mt-6 p-4 bg-red-50/50 border border-red-100 rounded-2xl flex items-start gap-3">
                  <XCircle size={18} className="text-red-500 shrink-0" />
                  <p className="text-xs text-red-700 font-medium">Verification failed: Please ensure legal property documents are clear and valid.</p>
                </div>
              )}
            </div>
          ))}

          {venues.length === 0 && (
            <div className="col-span-full py-20 px-6 flex flex-col items-center justify-center border-2 border-dashed border-[#B06A6C]/20 rounded-[3rem] bg-white/30 backdrop-blur-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-[#B06A6C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative mb-8">
                <div className="h-24 w-24 rounded-[2rem] bg-white shadow-2xl shadow-[#B06A6C]/10 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-700">
                  <Building2 size={44} className="text-[#B06A6C]/40" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#B06A6C] text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Plus size={16} />
                </div>
              </div>
              <h3 className="text-2xl font-serif text-[hsl(353,45%,35%)] mb-3 relative z-10">Start Your Portfolio</h3>
              <p className="text-slate-500 text-sm mb-8 text-center max-w-xs font-medium leading-relaxed relative z-10">You haven't listed any venues yet. Let's create your first premium property profile to start receiving enquiries.</p>
              <Link 
                to="/vendor/venues/add"
                className="px-10 py-5 bg-[hsl(353,45%,35%)] text-white rounded-[2rem] text-sm font-black shadow-xl shadow-[hsl(353,45%,35%)]/30 hover:scale-105 active:scale-95 transition-all relative z-10"
              >
                Create First Venue Listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  );
};

export default MyVenues;
