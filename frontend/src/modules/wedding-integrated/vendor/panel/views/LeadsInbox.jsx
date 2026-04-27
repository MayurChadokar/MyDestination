import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Archive,
  MoreVertical,
  User,
  Search,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCheck,
  Inbox,
  Sparkles,
  ChevronLeft
} from "lucide-react";
import VendorLayout from "../layouts/VendorLayout";

const initialLeads = [
  {
    id: 1,
    name: "Isha & Rahul",
    event: "Wedding",
    date: "24 Nov 2026",
    status: "New",
    budget: "₹1.5L",
    phone: "+91 99887 76655",
    email: "isha@rahul.com",
    message:
      "Hi Zoya, we love your photography style! We are looking for a pre-wedding and wedding coverage in Jaipur. Can you let us know your availability?",
    time: "2h ago",
    probability: 92,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Mohit Sethi",
    event: "Sangeet",
    date: "12 Dec 2026",
    status: "Contacted",
    budget: "₹80K",
    phone: "+91 91234 56789",
    email: "mohit@sethi.in",
    message:
      "Hey, I need a photographer for my brother's sangeet ceremony in Indore. Please call me back with a quote for a 4-hour coverage.",
    time: "1d ago",
    probability: 75,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Ananya Kapoor",
    event: "Pre-Wedding",
    date: "15 Oct 2026",
    status: "Completed",
    budget: "₹45K",
    phone: "+91 98321 09876",
    email: "ananya@kapoor.com",
    message:
      "We want a cinematic photoshoot in Udaipur for our pre-wedding. Please suggest some locations as well.",
    time: "3d ago",
    probability: 88,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Aditi & Rohan",
    event: "Mehendi",
    date: "18 Jan 2027",
    status: "New",
    budget: "₹35K",
    phone: "+91 98765 11223",
    email: "aditi@rohan.com",
    message:
      "Looking for a mehendi ceremony photographer in Delhi. Approximately 150 guests. Need full coverage.",
    time: "5h ago",
    probability: 65,
    image:
      "https://images.unsplash.com/photo-1606283151877-bb8dbceb188f?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Rohit & Ananya",
    event: "Wedding",
    date: "02 Feb 2027",
    status: "New",
    budget: "₹2.2L",
    phone: "+91 99001 23456",
    email: "rohit@weds.com",
    message:
      "We are planning a destination wedding in Goa and need a complete photography and videography package. Budget is flexible.",
    time: "12h ago",
    probability: 95,
    image:
      "https://images.unsplash.com/photo-1537151472258-29ce45e85c18?q=80&w=150&auto=format&fit=crop",
  },
];

// Vendor-side status config
const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
    border: "border-amber-100",
  },
  Contacted: {
    label: "Contacted",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    border: "border-emerald-100",
  },
  Rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-500",
    dot: "bg-rose-400",
    border: "border-rose-100",
  },
  Completed: {
    label: "Completed",
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "bg-purple-500",
    border: "border-purple-100",
  },
};

// Toast notification component
const Toast = ({ message, type, visible }) => {
  const colors = {
    Contacted: "bg-emerald-500",
    Rejected: "bg-rose-500",
    Completed: "bg-purple-500",
  };
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3.5 rounded-2xl shadow-2xl text-white text-[12px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-400 ${
        colors[type] || "bg-slate-700"
      } ${visible ? "opacity-100 -translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
    >
      {type === "Accepted" && <CheckCircle className="w-4 h-4" />}
      {type === "Rejected" && <XCircle className="w-4 h-4" />}
      {type === "Completed" && <CheckCheck className="w-4 h-4" />}
      {message}
    </div>
  );
};

const LeadsInbox = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(initialLeads[0]);
  const [searchQuery, setSearchQuery] = useState("");
  // Track per-lead vendor status
  const [leadStatuses, setLeadStatuses] = useState({});
  // Toast state
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const handleDeleteLead = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      const updatedLeads = leads.filter(l => l.id !== id);
      setLeads(updatedLeads);
      setSelectedLead(updatedLeads[0] || null);
      setToast({ visible: true, message: "Lead removed from inbox", type: "Rejected" });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
    }
  };

  const getLeadStatus = (id) => leadStatuses[id] || "Pending";

  const handleSetStatus = (id, status) => {
    setLeadStatuses((prev) => ({ ...prev, [id]: status }));
    const messages = {
      Contacted: "Marked as Contacted!",
      Rejected: "Request Rejected",
      Completed: "Marked as Completed!",
    };
    setToast({ visible: true, message: messages[status], type: status });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  // Filter tabs — All / New / Contacted / Completed
  const filters = ["All", "New", "Contacted", "Completed"];

   const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.event.toLowerCase().includes(searchQuery.toLowerCase());
    const vendorStatus = getLeadStatus(l.id);
    const matchesFilter =
      activeFilter === "All" ||
      l.status === activeFilter ||
      (activeFilter === "Contacted" && vendorStatus === "Contacted") ||
      (activeFilter === "Completed" && vendorStatus === "Completed");
    return matchesSearch && matchesFilter;
  });


  const currentStatus = selectedLead ? getLeadStatus(selectedLead.id) : "Pending";
  const currentStatusStyle = STATUS_CONFIG[currentStatus];

  return (
    <VendorLayout title="Leads Inbox">
      <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-wedding-fade-up">

        {/* LEFT: Inbox List */}
        <div className="w-full md:w-[360px] flex flex-col gap-4 h-full shrink-0">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#B06A6C] transition-colors" />
            <input
              placeholder="Search Leads..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#F3E9E2] rounded-[2rem] text-sm font-bold text-slate-800 outline-none focus:border-[#B06A6C]/30 focus:shadow-lg focus:shadow-[#B06A6C]/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#F3E9E2] rounded-[1.5rem] shadow-sm">
            {filters.map((f) => (
              <button
                key={f}
                 onClick={() => {
                  setActiveFilter(f);
                  const next = leads.filter(
                    (l) => f === "All" || l.status === f
                  );
                  setSelectedLead(next[0] || null);
                }}

                className={`flex-1 py-2.5 px-1 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  activeFilter === f
                    ? "bg-gradient-to-r from-[#B06A6C] to-[#C17A7C] text-white shadow-md shadow-[#B06A6C]/20"
                    : "text-[#8E7E77] hover:bg-[#FDFBF9]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Lead Cards */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-1">
            {filteredLeads.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F3E9E2]/60 flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-[#B06A6C]/40" />
                </div>
                <p className="text-xs font-bold text-[#8E7E77]">No leads found</p>
              </div>
            )}
            {filteredLeads.map((lead) => {
              const vendorStatus = getLeadStatus(lead.id);
              const sStyle = STATUS_CONFIG[vendorStatus];
              const isSelected = selectedLead?.id === lead.id;
              return (
                <button
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowMobileDetail(true);
                  }}
                  className={`w-full text-left p-3.5 md:p-4 rounded-[1.5rem] md:rounded-[1.75rem] border transition-all duration-300 group ${
                    isSelected
                      ? "bg-[#B06A6C] border-transparent shadow-xl shadow-[#B06A6C]/20"
                      : "bg-white border-[#F3E9E2] hover:border-[#B06A6C]/20 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-[0.85rem] md:rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                      <img src={lead.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4
                          className={`text-sm font-black truncate ${
                            isSelected ? "text-white" : "text-[#4A3730]"
                          }`}
                        >
                          {lead.name}
                        </h4>
                        <span
                          className={`text-[9px] font-black uppercase tracking-tighter ${
                            isSelected ? "text-white/60" : "text-slate-300"
                          }`}
                        >
                          {lead.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-widest leading-none ${
                            isSelected ? "text-white/75" : "text-[#8E7E77]"
                          }`}
                        >
                          {lead.event}
                        </p>
                        {/* Vendor Status Chip — updates live */}
                        <span
                          className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 transition-all duration-300 ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : vendorStatus !== "Pending"
                                ? `${sStyle.bg} ${sStyle.text} border ${sStyle.border}`
                                : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {!isSelected && vendorStatus !== "Pending" && (
                            <span className={`w-1.5 h-1.5 rounded-full ${sStyle.dot} shrink-0`} />
                          )}
                          {vendorStatus === "Pending" ? lead.status : vendorStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Detail Card */}
        <div className="hidden md:flex flex-1 h-full items-start  justify-center">
          <div className="w-full max-w-[520px] bg-white rounded-[1.75rem] border border-[#F3E9E2] shadow-xl shadow-[#4A3730]/5 flex flex-col overflow-hidden">
            {selectedLead ? (
              <>
                {/* Card Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#F3E9E2]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[1rem] border-2 border-[#B06A6C]/10 shadow-md overflow-hidden shrink-0">
                      <img
                        src={selectedLead.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#4A3730] leading-tight">
                        {selectedLead.name}
                      </h3>
                      <div className="flex items-center gap-3 text-[9px] font-bold text-[#8E7E77] uppercase tracking-widest mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-[#B06A6C]" />
                          {selectedLead.date}
                        </span>
                        <span className="font-black text-[#B06A6C]">
                          {selectedLead.budget}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Live Status Badge */}
                    <span
                      className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all duration-500 ${currentStatusStyle.bg} ${currentStatusStyle.text} ${currentStatusStyle.border}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full animate-pulse ${currentStatusStyle.dot}`}
                      />
                      {currentStatusStyle.label}
                    </span>
                    <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-[#F3E9E2] transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col gap-4 p-5 overflow-y-auto no-scrollbar">
                  {/* Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#B06A6C] shrink-0 border border-[#F3E9E2]">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="bg-[#F3E9E2]/30 p-4 rounded-[1.5rem] rounded-tl-lg border border-[#F3E9E2]/60 flex-1">
                      <p className="text-[13px] text-[#4A3730] font-medium leading-relaxed">
                        "{selectedLead.message}"
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="ml-11 grid grid-cols-2 gap-3">
                    <div className="bg-[#FFFDFB] p-3 rounded-xl border border-dotted border-[#F3E9E2] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#8E7E77] opacity-60">
                          Mobile Number
                        </p>
                        <p className="text-[11px] font-bold text-[#4A3730] truncate">
                          {selectedLead.phone}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#FFFDFB] p-3 rounded-xl border border-dotted border-[#F3E9E2] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-400 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#8E7E77] opacity-60">
                          Email Address
                        </p>
                        <p className="text-[11px] font-bold text-[#4A3730] truncate">
                          {selectedLead.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Response Probability */}
                  <div className="ml-11 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                      Response Probability: {selectedLead.probability}%
                    </span>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="px-5 pb-5 space-y-3 border-t border-[#F3E9E2] pt-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#8E7E77]/70">
                    Update Status
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Contacted */}
                    {(currentStatus === "Pending" || currentStatus === "Contacted") && (
                      <button
                        onClick={() => handleSetStatus(selectedLead.id, "Contacted")}
                        className={`flex-1 py-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 ${
                          currentStatus === "Contacted"
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100"
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Contacted
                      </button>
                    )}
                    {/* Reject */}
                    {(currentStatus === "Pending" || currentStatus === "Rejected") && (
                      <button
                        onClick={() => handleSetStatus(selectedLead.id, "Rejected")}
                        className={`flex-1 py-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 ${
                          currentStatus === "Rejected"
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                            : "bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100"
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    )}
                    {/* Completed */}
                    {(currentStatus === "Pending" || currentStatus === "Completed") && (
                      <button
                        onClick={() => handleSetStatus(selectedLead.id, "Completed")}
                        className={`flex-1 py-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 ${
                          currentStatus === "Completed"
                            ? "bg-purple-500 text-white shadow-lg shadow-purple-200"
                            : "bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100"
                        }`}
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Completed
                      </button>
                    )}
                  </div>

                  {/* WhatsApp + Archive */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-2.5 bg-[#F3E9E2] text-[#B06A6C] font-black text-[11px] rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#e8d5cc] active:scale-95 transition-all">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Contact on WhatsApp
                    </button>
                    <button 
                      onClick={() => handleDeleteLead(selectedLead.id)}
                      className="w-10 h-10 bg-white border border-rose-100 text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-50 transition-all shrink-0 active:scale-95 shadow-sm"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="min-h-[340px] flex flex-col items-center justify-center p-8 text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#F3E9E2]/50 flex items-center justify-center text-[#B06A6C]/20 border-2 border-dashed border-[#F3E9E2]">
                  <Inbox className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#4A3730]">Select a Lead</h3>
                  <p className="text-[#8E7E77] text-xs font-medium">
                    Click on an enquiry to view full details.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile fallback */}
        {!selectedLead && (
          <div className="md:hidden text-center py-20 px-8 text-slate-300">
            <p>Select a lead from the list to view details.</p>
          </div>
        )}

        {/* Mobile Detail Overlay */}
        {showMobileDetail && selectedLead && (
          <div className="md:hidden fixed inset-0 z-40 bg-gradient-to-tr from-[#F7F1ED] via-[#F3E9E2] to-[#FDFBF9] backdrop-blur-xl animate-wedding-fade-up overflow-y-auto no-scrollbar pb-24">
            <div className="p-4 pt-16 relative">
              {/* Floating Back Button */}
              <button 
                onClick={() => setShowMobileDetail(false)}
                className="absolute top-5 left-6 w-10 h-10 rounded-xl bg-white shadow-lg border border-[#F3E9E2] text-[#B06A6C] flex items-center justify-center z-20 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex flex-col gap-5">
                {/* Profile Header Segment */}
                <div className="bg-white rounded-[2rem] border border-[#F3E9E2] p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[1rem] border-2 border-[#B06A6C]/10 shadow-md overflow-hidden shrink-0">
                      <img src={selectedLead.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#4A3730] leading-tight">{selectedLead.name}</h3>
                      <div className="flex items-center gap-3 text-[9px] font-bold text-[#8E7E77] uppercase tracking-widest mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-[#B06A6C]" />
                          {selectedLead.date}
                        </span>
                        <span className="font-black text-[#B06A6C]">{selectedLead.budget}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full border ${currentStatusStyle.bg} ${currentStatusStyle.text} ${currentStatusStyle.border}`}>
                    {currentStatusStyle.label}
                  </span>
                </div>

                {/* Message Segment */}
                <div className="bg-white rounded-[2rem] border border-[#F3E9E2] p-6 shadow-sm">
                   <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-4 h-4 text-[#B06A6C]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#B06A6C]">Inquiry Message</span>
                   </div>
                   <p className="text-[13px] text-[#4A3730] font-medium leading-relaxed italic opacity-80">
                    "{selectedLead.message}"
                   </p>
                </div>

                {/* Contact Segment */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-white p-4 rounded-[1.5rem] border border-[#F3E9E2] shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#8E7E77] opacity-60">Mobile Number</p>
                      <p className="text-[12px] font-bold text-[#4A3730]">{selectedLead.phone}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-[1.5rem] border border-[#F3E9E2] shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-400 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#8E7E77] opacity-60">Email Address</p>
                      <p className="text-[12px] font-bold text-[#4A3730] break-all">{selectedLead.email}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update Segment */}
                <div className="bg-white rounded-[2.5rem] border border-[#F3E9E2] p-5 shadow-sm space-y-4">
                   <p className="text-[9px] font-black uppercase tracking-widest text-[#8E7E77] text-center">Update Enquiry Status</p>
                   <div className="flex flex-col gap-2">
                      {(currentStatus === "Pending" || currentStatus === "Contacted") && (
                        <button onClick={() => handleSetStatus(selectedLead.id, "Contacted")} className={`w-full py-4 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 ${currentStatus === "Contacted" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-emerald-50 text-emerald-600"}`}>
                          <MessageCircle className="w-4 h-4" /> Contacted
                        </button>
                      )}
                      
                      {currentStatus === "Pending" ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleSetStatus(selectedLead.id, "Rejected")} className="flex-1 py-4 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 bg-rose-50 text-rose-500">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                          <button onClick={() => handleSetStatus(selectedLead.id, "Completed")} className="flex-1 py-4 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 bg-purple-50 text-purple-600">
                            <CheckCheck className="w-4 h-4" /> Done
                          </button>
                        </div>
                      ) : (
                        <>
                          {currentStatus === "Rejected" && (
                            <button className="w-full py-4 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 bg-rose-500 text-white shadow-lg shadow-rose-100">
                              <XCircle className="w-4 h-4" /> Rejected
                            </button>
                          )}
                          {currentStatus === "Completed" && (
                            <button className="w-full py-4 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 bg-purple-500 text-white shadow-lg shadow-purple-100">
                              <CheckCheck className="w-4 h-4" /> Completed
                            </button>
                          )}
                        </>
                      )}
                   </div>
                   <button className="w-full py-4 bg-[#4A3730] text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-[#4A3730]/20 hover:scale-[1.02] active:scale-95 transition-all">
                      <MessageCircle className="w-4 h-4" /> Contact on WhatsApp
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </VendorLayout>
  );
};

export default LeadsInbox;
