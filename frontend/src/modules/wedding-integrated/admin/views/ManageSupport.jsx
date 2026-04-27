import React from 'react';
import { adminStyles } from '../theme/themeConfig';
import { 
  LifeBuoy, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  MoreVertical,
  Mail,
  Filter,
  Search,
  MessageCircle
} from 'lucide-react';

const ManageSupport = () => {
  const tickets = [
    { id: "TK-451", user: "Vikram Mehta", subject: "Refund for missed photography", status: "Critical", priority: 1, lastActive: "10 mins ago" },
    { id: "TK-452", user: "Aditya Sharma", subject: "Vendor not responding since 2 days", status: "In Progress", priority: 2, lastActive: "1 hour ago" },
    { id: "TK-453", user: "Royal Photography", subject: "Issues with payout settlement", status: "Open", priority: 3, lastActive: "4 hours ago" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Support Desk</h2>
            <p className="text-gray-500 text-sm mt-1">Handle complaints and support requests from users and vendors</p>
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Seach tickets..." 
                  className="pl-10 pr-4 py-2 border border-[#B06A6C]/20 bg-white rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20"
                />
             </div>
             <button className="flex items-center gap-2 px-6 py-2 bg-[hsl(353,45%,35%)] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 leading-none">
                <MessageSquare size={16} /> Resolve All
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Stats */}
         <div className="lg:col-span-1 space-y-4">
            {[
               { label: 'Unresolved', count: 12, icon: AlertCircle, color: 'text-red-600 bg-red-50 border-red-100' },
               { label: 'Pending', count: 8, icon: Clock, color: 'text-orange-600 bg-orange-50 border-orange-100' },
               { label: 'Resolved', count: 86, icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-100' },
            ].map((stat, i) => (
               <div key={i} className={`p-6 rounded-3xl border ${stat.color} flex items-center justify-between shadow-sm`}>
                  <div className="flex items-center gap-3">
                     <stat.icon size={22} />
                     <span className="font-bold">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-black">{stat.count}</span>
               </div>
            ))}
         </div>

         {/* Ticket List */}
         <div className="lg:col-span-3 space-y-4">
            {tickets.map((ticket) => (
               <div key={ticket.id} className={`${adminStyles.glassCard} p-6 rounded-3xl group flex items-center gap-8 border-[#B06A6C]/5 hover:border-[#B06A6C]/20 hover:shadow-xl transition-all duration-300`}>
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
                     ticket.priority === 1 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                     <AlertCircle size={24} />
                  </div>
                  
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#B06A6C]">{ticket.id}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-xs font-bold text-slate-400">{ticket.lastActive}</span>
                     </div>
                     <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-[#B06A6C] transition-colors">
                        {ticket.subject}
                     </h4>
                     <p className="text-sm text-slate-500 font-medium">Issue reported by <span className="text-slate-700 font-bold">{ticket.user}</span></p>
                  </div>

                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           ticket.status === 'Critical' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600'
                        }`}>
                           {ticket.status}
                        </span>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-3 bg-white border border-[#B06A6C]/10 text-[#B06A6C] rounded-2xl hover:bg-[#B06A6C] hover:text-white transition-all shadow-sm">
                           <MessageCircle size={20} />
                        </button>
                        <button className="p-3 bg-white border border-[#B06A6C]/10 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                           <MoreVertical size={20} />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default ManageSupport;
