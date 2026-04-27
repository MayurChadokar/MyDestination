import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  ArrowUpRight, 
  Clock, 
  Calendar,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import VendorLayout from "../layouts/VendorLayout";

const stats = [
  { label: "Total Enquiries", value: "1,280", icon: MessageCircle, growth: "+12%", color: "bg-blue-50 text-blue-500 shadow-blue-500/10", path: "/wedding/vendor/leads" },
  { label: "New Leads", value: "48", icon: Users, growth: "+5%", color: "bg-emerald-50 text-emerald-500 shadow-emerald-500/10", path: "/wedding/vendor/leads" },
  { label: "Profile Views", value: "12.4K", icon: Eye, growth: "+18%", color: "bg-amber-50 text-amber-500 shadow-amber-500/10", path: "/wedding/vendor/profile" },
  { label: "Shortlisted", value: "450", icon: Heart, growth: "+7%", color: "bg-[#B06A6C]/10 text-[#B06A6C] shadow-[#B06A6C]/10", path: "/wedding/vendor/reviews" },
];

const recentLeads = [
  { id: 1, name: "Isha & Rahul", event: "Wedding", date: "24 Nov 2026", status: "New", budget: "₹1.5L", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=150&auto=format&fit=crop" },
  { id: 2, name: "Mohit Sethi", event: "Sangeet", date: "12 Dec 2026", status: "Contacted", budget: "₹80K", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=150&auto=format&fit=crop" },
  { id: 3, name: "Priya Sharma", event: "Pre-Wedding", date: "05 Nov 2026", status: "Contacted", budget: "₹45K", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" },
  { id: 4, name: "Aditi Singh", event: "Mehendi", date: "18 Jan 2027", status: "New", budget: "₹35K", image: "https://images.unsplash.com/photo-1606283151877-bb8dbceb188f?q=80&w=150&auto=format&fit=crop" },
  { id: 5, name: "Rohit & Ananya", event: "Wedding", date: "02 Feb 2027", status: "New", budget: "₹2.2L", image: "https://images.unsplash.com/photo-1537151472258-29ce45e85c18?q=80&w=150&auto=format&fit=crop" },
  { id: 6, name: "Sarah Kapoor", event: "Engagement", date: "15 Dec 2026", status: "Contacted", budget: "₹65K", image: "https://images.unsplash.com/photo-1621801306184-cebfdef73611?q=80&w=150&auto=format&fit=crop" },
  { id: 7, name: "Varun Verma", event: "Reception", date: "20 Jan 2027", status: "Contacted", budget: "₹1L", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=150&auto=format&fit=crop" },
  { id: 8, name: "Natasha Roy", event: "Pre-Wedding", date: "30 Nov 2026", status: "New", budget: "₹50K", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" },
];

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <VendorLayout title="Dashboard">
      <div className="space-y-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                onClick={() => navigate(stat.path || '/wedding/vendor/leads')}
                className="bg-white rounded-[2rem] border border-[#F3E9E2] p-3.5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-[#B06A6C]/5 transition-all duration-500 group animate-wedding-fade-up cursor-pointer hover:-translate-y-1"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className={`p-2 md:p-3 rounded-lg md:rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                  <div className="flex items-center gap-0.5 text-emerald-500 text-[9px] md:text-xs font-black">
                     <TrendingUp className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                     {stat.growth}
                  </div>
                </div>
                <div className="space-y-0">
                  <h3 className="text-lg md:text-3xl font-black text-[#4A3730] tracking-tight">{stat.value}</h3>
                  <p className="text-[8px] md:text-xs font-bold text-[#8E7E77] uppercase tracking-wider leading-none">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Leads */}
        <div className="space-y-5 animate-wedding-fade-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-[#4A3730] uppercase tracking-wider">
                Recent Enquiries
              </h3>
              <Link to="/wedding/vendor/leads" className="text-[11px] font-black text-[#B06A6C] uppercase tracking-widest hover:underline">
                View History
              </Link>
            </div>
            
            <div className="space-y-4">
               {recentLeads.slice(0, 6).map((lead) => (
                 <div 
                   key={lead.id}
                   onClick={() => navigate('/wedding/vendor/leads')}
                   className="group bg-white rounded-[2rem] border border-[#F3E9E2] p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden cursor-pointer"
                 >
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-2xl overflow-hidden shadow-sm shrink-0">
                     <img src={lead.image} alt={lead.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div className="flex-1 min-w-0 pr-8">
                     <div className="flex items-center gap-2 mb-1">
                       <h4 className="text-base font-black text-[#4A3730] truncate">{lead.name}</h4>
                       <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                         lead.status === 'New' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                       }`}>
                         {lead.status}
                       </span>
                     </div>
                     <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                       <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E7E77]">
                         <Calendar className="w-3 h-3 text-[#B06A6C]" />
                         {lead.date}
                       </div>
                       <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E7E77]">
                         <Clock className="w-3 h-3 text-[#B06A6C]" />
                         {lead.event}
                       </div>
                       <div className="font-black text-[#B06A6C] text-[11px]">{lead.budget}</div>
                     </div>
                   </div>
                   <button className="absolute right-4 w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-[#B06A6C] hover:text-white transition-all group/btn shadow-inner">
                     <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                   </button>
                 </div>
               ))}
            </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default DashboardHome;
