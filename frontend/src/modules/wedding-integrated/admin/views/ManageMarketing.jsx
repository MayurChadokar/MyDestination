import React from 'react';
import { adminStyles } from '../theme/themeConfig';
import { 
  Megaphone, 
  Plus, 
  Image as ImageIcon, 
  Eye, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';

const ManageMarketing = () => {
  const banners = [
    { id: 1, title: "Summer Wedding Sale", type: "Home Slider", status: "Active", views: "12,450", lastEdited: "2 days ago" },
    { id: 2, title: "Luxury Destinations 2024", type: "Featured Section", status: "Active", views: "8,120", lastEdited: "1 week ago" },
    { id: 3, title: "Photographer Promo", type: "Side Menu", status: "Draft", views: "-", lastEdited: "5 mins ago" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Marketing & Banners</h2>
            <p className="text-gray-500 text-sm mt-1">Control platform branding and promotional content</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[hsl(353,45%,35%)] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 leading-none">
             <Plus size={18} /> Create New Banner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Active Banners List */}
         <div className={`${adminStyles.glassCard} p-8 rounded-[2.5rem]`}>
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold flex items-center gap-3">
                  <Megaphone size={22} className="text-[#B06A6C]" /> Manage Assets
               </h3>
               <span className="text-[10px] font-black uppercase tracking-widest text-[#B06A6C] bg-[#B06A6C]/10 px-3 py-1 rounded-full">
                  {banners.length} Campaigns
               </span>
            </div>

            <div className="space-y-4">
               {banners.map((banner) => (
                 <div key={banner.id} className="p-6 rounded-3xl bg-white border border-[#B06A6C]/10 hover:border-[#B06A6C]/30 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-24 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[#B06A6C]/5 transition-colors">
                          <ImageIcon size={24} />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-slate-800 leading-tight">{banner.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{banner.type}</span>
                             <span className="text-slate-200">|</span>
                             <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                <CheckCircle2 size={12} /> {banner.status}
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors">
                             <Eye size={18} />
                          </button>
                          <button className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Analytics & Performance */}
         <div className="space-y-8">
            <div className="p-10 bg-gradient-to-br from-[#B06A6C] to-[#8C5254] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-2">Engagements</h3>
                  <p className="text-white/70 text-sm font-medium mb-6">Track customer awareness from banners</p>
                  <div className="flex items-end gap-2">
                     <span className="text-5xl font-black">20.5K</span>
                     <span className="text-xs font-bold mb-2 pb-1 text-green-300 flex items-center gap-1">
                        <TrendingUp size={14} /> +24% THIS WEEK
                     </span>
                  </div>
               </div>
               <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Megaphone size={200} strokeWidth={4} />
               </div>
            </div>

            <div className={`${adminStyles.glassCard} p-8 rounded-[2.5rem]`}>
               <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                  <Clock size={20} className="text-[#B06A6C]" /> Scheduling
               </h3>
               <div className="space-y-4">
                  <p className="text-sm text-slate-500 italic">Banners are currently rotating on standard 5s intervals across wedding discovery pages.</p>
                  <button className="w-full py-4 border-2 border-dashed border-[#B06A6C]/20 text-[#B06A6C] rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-[#B06A6C]/5 transition-all">
                     Configure Display Loops
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ManageMarketing;
