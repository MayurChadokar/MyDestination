import React, { useState } from 'react';
import { recentEnquiries } from '../data/adminMockData';
import { adminStyles } from '../theme/themeConfig';
import { Filter, Search, ArrowUpRight, CheckCircle2, Circle } from 'lucide-react';

const ManageEnquiries = () => {
  const [statusFilter, setStatusFilter] = useState('New'); // "New" or "Contacted"

  const filteredEnquiries = recentEnquiries.filter(enq => enq.status === statusFilter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Wedding Enquiries</h2>
            <p className="text-gray-500 text-sm mt-1">Manage and respond to wedding leads from couples</p>
          </div>
          
          <div className="flex gap-3">
             <div className="relative group">
                <input 
                    type="text" 
                    placeholder="Search by client name..." 
                    className="h-11 pl-10 pr-4 rounded-xl border border-white/40 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[hsl(353,45%,35%)] transition-all w-64 text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[hsl(353,45%,35%)] transition-colors" size={18} />
             </div>
             <button className="flex items-center gap-2 px-4 py-2 border border-white/40 bg-white/30 backdrop-blur-md rounded-xl text-sm font-medium hover:bg-white/50 transition-all">
                <Filter size={16} /> Advanced Filters
             </button>
          </div>
        </div>

        {/* Toggle / Switch for status */}
        <div className="flex items-center gap-2 p-1.5 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl w-fit">
          <button 
            onClick={() => setStatusFilter('New')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              statusFilter === 'New' 
              ? 'bg-[hsl(353,45%,35%)] text-white shadow-lg shadow-[hsl(353,45%,35%)]/20' 
              : 'text-gray-500 hover:bg-white/40'
            }`}
          >
            {statusFilter === 'New' ? <Circle size={14} className="fill-white" /> : <Circle size={14} />}
            NEW ENQUIRIES
          </button>
          
          <button 
            onClick={() => setStatusFilter('Contacted')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              statusFilter === 'Contacted' 
              ? 'bg-[hsl(353,45%,35%)] text-white shadow-lg shadow-[hsl(353,45%,35%)]/20' 
              : 'text-gray-500 hover:bg-white/40'
            }`}
          >
            {statusFilter === 'Contacted' ? <CheckCircle2 size={16} /> : <CheckCircle2 size={16} className="opacity-50" />}
            CONTACTED
          </button>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className={`${adminStyles.glassCard} p-8 rounded-3xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-white/40">
                <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Client Details</th>
                <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Requirement</th>
                <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Destination</th>
                <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Budget</th>
                <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Status</th>
                <th className="pb-6 font-bold text-gray-400 text-xs uppercase tracking-[0.1em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="group hover:bg-white/40 transition-all duration-300">
                    <td className="py-6 pr-8">
                      <p className="font-bold text-lg text-[hsl(353,20%,15%)]">{enq.client}</p>
                      <p className="text-xs text-gray-400 font-medium tracking-wide">ID: {enq.id}</p>
                    </td>
                    <td className="py-6">
                      <p className="text-sm text-gray-600 truncate w-56">{enq.requirement}</p>
                    </td>
                    <td className="py-6 text-sm font-medium text-gray-700">{enq.destination}</td>
                    <td className="py-6">
                      <p className="text-sm font-bold text-[hsl(353,45%,35%)]">{enq.budget}</p>
                    </td>
                    <td className="py-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                        enq.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {enq.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <button className="p-3 bg-[hsl(353,45%,35%)] text-white rounded-2xl shadow-lg shadow-[hsl(353,45%,35%)]/20 hover:scale-110 transition-all duration-300">
                        <ArrowUpRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                       <Filter size={48} />
                       <p className="text-lg font-serif italic">No enquiries found in {statusFilter.toLowerCase()} list</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageEnquiries;
