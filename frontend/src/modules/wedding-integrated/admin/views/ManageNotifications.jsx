
import React from 'react';
import { adminStyles } from '../theme/themeConfig';
import {
   Bell,
   Send,
   Mail,
   MessageSquare,
   Smartphone,
   Trash2,
   CheckCircle2,
   Clock,
   Plus,
   TrendingUp
} from 'lucide-react';

const ManageNotifications = () => {
   const notifications = [
      { id: 1, title: "Booking Confirmation Template", channel: "Email", status: "Active", timestamp: "2 hours ago" },
      { id: 2, title: "Ride Confirmation SMS", channel: "SMS", status: "Inactive", timestamp: "1 day ago" },
      { id: 3, title: "Payment Successful Push", channel: "Push", status: "Active", timestamp: "3 hours ago" }
   ];

   return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
         <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Notification Center</h2>
                  <p className="text-gray-500 text-sm mt-1">Manage system alerts, push notifications, SMS and Emails</p>
               </div>
               <button className="flex items-center gap-2 px-6 py-3 bg-[hsl(353,45%,35%)] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 leading-none">
                  <Plus size={18} /> Compose New Alert
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Manage Templates */}
            <div className={`${adminStyles.glassCard} lg:col-span-2 p-8 rounded-[2.5rem]`}>
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                     <Bell size={22} className="text-[#B06A6C]" /> active Templates
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B06A6C] bg-[#B06A6C]/10 px-3 py-1 rounded-full">
                     {notifications.length} Channels Enabled
                  </span>
               </div>

               <div className="space-y-4">
                  {notifications.map((n) => (
                     <div key={n.id} className="p-6 rounded-3xl bg-white border border-[#B06A6C]/10 hover:border-[#B06A6C]/30 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center gap-6">
                           <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${n.channel === 'Email' ? 'bg-blue-50 text-blue-600' :
                                 n.channel === 'SMS' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                              }`}>
                              {n.channel === 'Email' ? <Mail size={22} /> :
                                 n.channel === 'SMS' ? <Smartphone size={22} /> : <Send size={22} />}
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-slate-800 leading-tight">{n.title}</h4>
                              <div className="flex items-center gap-3 mt-1.5">
                                 <span className="text-[10px] font-black text-slate-400">{n.channel} Channel</span>
                                 <span className="text-slate-200">|</span>
                                 <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                    <CheckCircle2 size={12} /> {n.status}
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors">
                                 <Clock size={18} />
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

            {/* Distribution Summary */}
            <div className="space-y-8">
               <div className="p-10 bg-gradient-to-br from-[#4A3730] to-[#2D1F1A] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                     <h3 className="text-3xl font-black mb-2">Reach</h3>
                     <p className="text-white/70 text-sm font-medium mb-6">Total successful deliveries this month</p>
                     <div className="flex items-end gap-2">
                        <span className="text-5xl font-black">45.8K</span>
                        <span className="text-xs font-bold mb-2 pb-1 text-green-300 flex items-center gap-1">
                           <TrendingUp size={14} /> +12% GROWTH
                        </span>
                     </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                     <Send size={200} strokeWidth={4} />
                  </div>
               </div>

               <div className={`${adminStyles.glassCard} p-8 rounded-[2.5rem]`}>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                     <MessageSquare size={20} className="text-[#B06A6C]" /> Instant Broadcast
                  </h3>
                  <div className="space-y-4">
                     <textarea
                        placeholder="Type your system-wide announcement here..."
                        className="w-full h-32 p-4 bg-white border border-[#B06A6C]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20"
                     />
                     <button className="w-full py-4 bg-[#B06A6C] text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#B06A6C]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Blast to All Users
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ManageNotifications;
