import React from 'react';
import { mockCustomers } from '../data/adminMockData';
import { adminStyles } from '../theme/themeConfig';
import { Search, Mail, Filter, Download, MoreVertical } from 'lucide-react';

const ManageCustomers = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Customer Management</h2>
            <p className="text-gray-500 text-sm mt-1">View and manage all registered couples and guests</p>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search customers..." 
                  className="pl-10 pr-4 py-2 bg-white border border-[#B06A6C]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 w-64"
                />
             </div>
             <button className="flex items-center gap-2 px-4 py-2 border border-[#B06A6C]/20 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                <Filter size={16} />
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(353,45%,35%)] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                <Download size={16} /> Export
             </button>
          </div>
        </div>
      </div>

      <div className={`${adminStyles.glassCard} p-8 rounded-3xl`}>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-[hsl(353,45%,35%)]/10">
                     <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Customer</th>
                     <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Contact Info</th>
                     <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Bookings</th>
                     <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Join Date</th>
                     <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Status</th>
                     <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[hsl(353,45%,35%)]/5">
                  {mockCustomers.map((cust) => (
                    <tr key={cust.id} className="group hover:bg-white/40 transition-all duration-300">
                       <td className="py-6">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-2xl bg-[hsl(353,45%,35%)]/10 flex items-center justify-center text-[hsl(353,45%,35%)] font-bold text-xl">
                                {cust.name[0]}
                             </div>
                             <div>
                                <p className="font-bold text-[hsl(353,20%,15%)]">{cust.name}</p>
                                <p className="text-xs text-gray-400">{cust.id}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-6">
                          <div className="flex flex-col gap-1">
                             <span className="text-sm text-gray-600 flex items-center gap-2"><Mail size={14} className="text-[#B06A6C]"/> {cust.email}</span>
                          </div>
                       </td>
                       <td className="py-6">
                          <div className="flex items-center gap-2">
                             <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                {cust.bookings} Bookings
                             </span>
                          </div>
                       </td>
                       <td className="py-6 text-sm text-gray-500 font-medium">
                          {cust.joinDate}
                       </td>
                       <td className="py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             cust.status === 'Active' 
                               ? 'bg-green-50 text-green-600 border border-green-200' 
                               : 'bg-slate-50 text-slate-400 border border-slate-200'
                          }`}>
                             {cust.status}
                          </span>
                       </td>
                       <td className="py-6 text-right">
                          <button className="p-2 text-gray-400 hover:text-[hsl(353,45%,35%)] hover:bg-[hsl(353,45%,35%)]/5 rounded-xl transition-all">
                             <MoreVertical size={20} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
