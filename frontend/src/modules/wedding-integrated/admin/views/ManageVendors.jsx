import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { pendingVendors } from '../data/adminMockData';
import { adminStyles } from '../theme/themeConfig';
import {
  Users,
  Clock,
  Filter,
  Download,
  Eye,
  X,
  CheckCircle2,
  MapPin,
  Tag,
  IndianRupee,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

const ManageVendors = () => {
  const location = useLocation();

  // Initialize state from localStorage or use defaults
  const [pendingList, setPendingList] = useState(() => {
    const saved = localStorage.getItem('admin_pending_vendors');
    const dbVendors = JSON.parse(localStorage.getItem('vendor_users_db') || '[]')
      .filter(u => u.status === 'pending')
      .map(u => ({
        id: u.id,
        name: u.name,
        category: u.category,
        location: u.location || "Not Set",
        status: "Pending",
        date: new Date(u.createdAt).toLocaleDateString(),
        experience: u.experience,
        services: u.services,
        email: u.email,
        phone: u.phone,
        pricing: u.basicPackage ? `₹${u.basicPackage} - ₹${u.premiumPackage}` : null,
        kycStatus: u.kycStatus === 'Verified' ? "Aadhar & GST Verified" : "Pending Verification",
        realUser: true
      }));
    const staticPending = saved ? JSON.parse(saved) : pendingVendors;
    return [...dbVendors, ...staticPending.filter(s => !dbVendors.find(d => d.id === s.id))];
  });

  const [allVendorsList, setAllVendorsList] = useState(() => {
    const saved = localStorage.getItem('admin_all_vendors');
    const dbApproved = JSON.parse(localStorage.getItem('vendor_users_db') || '[]')
      .filter(u => u.status === 'Approved' || u.status === 'Rejected')
      .map(u => ({
        id: u.id,
        name: u.name,
        category: u.category,
        location: u.location || "Not Set",
        status: u.status,
        date: new Date(u.createdAt).toLocaleDateString(),
        realUser: true
      }));
    const staticAll = saved ? JSON.parse(saved) : [
      { id: 101, name: "Sunset Shoots", category: "Photography", location: "Jaipur", status: "Approved", date: "2024-03-15" },
      { id: 102, name: "Royal Bites", category: "Catering", location: "Mumbai", status: "Rejected", date: "2024-03-10" },
      { id: 103, name: "Bloom Decor", category: "Decoration", location: "Delhi", status: "Approved", date: "2024-03-20" }
    ];
    return [...dbApproved, ...staticAll.filter(s => !dbApproved.find(d => d.id === s.id))];
  });

  const [selectedVendor, setSelectedVendor] = useState(null);

  // Synchronize state with localStorage
  useEffect(() => {
    localStorage.setItem('admin_pending_vendors', JSON.stringify(pendingList));
  }, [pendingList]);

  useEffect(() => {
    localStorage.setItem('admin_all_vendors', JSON.stringify(allVendorsList));
  }, [allVendorsList]);

  const handleAction = (id, type) => {
    // 1. Update Local UI State
    const vendorToMove = pendingList.find(v => v.id === id);
    if (!vendorToMove) return;

    const statusValue = type === 'Approved' ? 'Approved' : 'Rejected';
    const updatedVendor = { ...vendorToMove, status: statusValue };

    setAllVendorsList(prev => [updatedVendor, ...prev]);
    setPendingList(prev => prev.filter(v => v.id !== id));

    // 2. Persist to real vendor DB if it's a real user
    if (vendorToMove.realUser) {
      const dbRows = JSON.parse(localStorage.getItem('vendor_users_db') || '[]');
      const userIdx = dbRows.findIndex(u => u.id === id);
      if (userIdx !== -1) {
        dbRows[userIdx].status = statusValue;
        localStorage.setItem('vendor_users_db', JSON.stringify(dbRows));

        // Also update active session if this is the current user (for testing purposes)
        const activeSession = JSON.parse(localStorage.getItem('vendor_active_session') || '{}');
        if (activeSession.id === id) {
          activeSession.status = statusValue;
          localStorage.setItem('vendor_active_session', JSON.stringify(activeSession));
          // Trigger event for UI updates
          window.dispatchEvent(new CustomEvent('vendorProfileUpdate', { detail: activeSession }));
        }
      }
    }

    if (selectedVendor?.id === id) setSelectedVendor(null);
    alert(`Vendor ${type} successfully!`);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedVendor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVendor]);

  const isPendingView = location.pathname.includes('/pending');
  const isAllView = location.pathname.includes('/all') || location.pathname === '/wedding/admin/vendors';

  const handleApproveAll = () => {
    const movedVendors = pendingList.map(v => ({ ...v, status: 'Approved' }));
    setAllVendorsList(prev => [...movedVendors, ...prev]);
    setPendingList([]);
    alert("All Vendors Approved and moved to Directory!");
  };

  const mockFullDetails = {
    experience: "8+ Years",
    services: ["Pre-wedding shoot", "Candid", "Cinematic", "Drone Photography", "Alubm Creation"],
    pricing: "₹80,000 - ₹2,50,000",
    kyc: "Aadhar & GST Verified",
    email: "contact@vendor.com",
    phone: "+91 98765 43210"
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">
                {isPendingView ? 'Pending Approvals' : 'Vendor Management'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isPendingView
                  ? `Review and verify ${pendingList.length} new vendor applications`
                  : `Manage and oversee all ${allVendorsList.length} registered vendors on the platform`}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-[#B06A6C]/20 bg-white rounded-xl text-sm font-medium hover:bg-white shadow-sm transition-all">
                <Filter size={16} /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-[#B06A6C]/20 bg-white rounded-xl text-sm font-medium hover:bg-white shadow-sm transition-all">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </div>

        {isPendingView ? (
          <div className="space-y-4">
            <div className={`${adminStyles.glassCard} p-8 rounded-3xl`}>
              {pendingList.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className={`${adminStyles.heading} text-2xl font-bold`}>New Vendor Applications</h3>
                    <button
                      onClick={handleApproveAll}
                      className={`${adminStyles.primaryButton} px-6 py-2 rounded-xl text-sm font-bold shadow-lg`}
                    >
                      Approve All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {pendingList.map((vendor) => (
                      <div key={vendor.id} className="p-6 rounded-2xl bg-white border border-[#F3E9E2] flex items-center justify-between group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[hsl(353,45%,45%)] to-[hsl(353,45%,35%)] flex items-center justify-center text-white font-bold text-2xl shadow-inner transition-transform">
                            {vendor.name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-[hsl(353,20%,15%)] leading-none mb-2">{vendor.name}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium px-2 py-0.5 bg-[hsl(353,45%,35%)]/10 text-[hsl(353,45%,35%)] rounded">
                                {vendor.category}
                              </span>
                              <span className="text-xs text-gray-400">|</span>
                              <p className="text-sm text-gray-700">{vendor.location}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right mr-4">
                            <p className="text-xs text-gray-400 mb-1 font-medium">Applied on</p>
                            <p className="text-sm font-bold text-[hsl(353,20%,15%)]">{vendor.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedVendor(vendor)}
                              className="p-2 text-slate-400 hover:text-[hsl(353,45%,35%)] hover:bg-[hsl(353,45%,35%)]/5 rounded-xl transition-all"
                              title="View Details"
                            >
                              <Eye size={22} />
                            </button>
                            <button
                              onClick={() => handleAction(vendor.id, 'Rejected')}
                              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAction(vendor.id, 'Approved')}
                              className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-md shadow-green-200 transition-all active:scale-95"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-[hsl(353,45%,35%)]">All Caught Up!</h3>
                    <p className="text-gray-500 mt-2">There are no pending vendor applications to review at this time.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className={`${adminStyles.glassCard} p-8 rounded-3xl`}>
              <h3 className={`${adminStyles.heading} text-2xl font-bold mb-6`}>Master Vendor Directory</h3>
              <div className="grid grid-cols-1 gap-4">
                {allVendorsList.map((vendor) => (
                  <div key={vendor.id} className="p-6 rounded-2xl bg-white border border-[#F3E9E2] flex items-center justify-between group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-[hsl(353,45%,35%)]/5 flex items-center justify-center text-[hsl(353,45%,35%)] font-bold text-2xl shadow-inner border border-[hsl(353,45%,35%)]/10">
                        {vendor.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-[hsl(353,20%,15%)] leading-none mb-2">{vendor.name}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500">
                            {vendor.category}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <p className="text-sm text-gray-500">{vendor.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right mr-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${vendor.status === 'Approved'
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                          {vendor.status}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="p-2 text-slate-400 hover:text-[hsl(353,45%,35%)] hover:bg-[hsl(353,45%,35%)]/5 rounded-xl transition-all"
                      >
                        <Eye size={22} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vendor Detail Modal - Moved outside the animated container to span full viewport */}
      {selectedVendor && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#4A3730]/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedVendor(null)}
          />

          {/* Modal Body */}
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 z-[101]">
            {/* Header */}
            <div className="bg-[#B06A6C] p-8 text-white relative">
              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center text-[#B06A6C] text-3xl font-black shadow-xl">
                  {selectedVendor.name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-black">{selectedVendor.name}</h3>
                  <div className="flex items-center gap-3 mt-1 underline underline-offset-4 decoration-white/30">
                    <span className="text-sm font-bold opacity-90">{selectedVendor.category}</span>
                    <span className="opacity-50">|</span>
                    <span className="text-sm font-bold opacity-90 italic">{selectedVendor.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B06A6C]" /> {selectedVendor.experience ? `${selectedVendor.experience} Years` : mockFullDetails.experience}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Pricing</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4" /> {selectedVendor.pricing || mockFullDetails.pricing}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</p>
                  <p className="text-sm font-bold text-slate-800">{selectedVendor.email || mockFullDetails.email}</p>
                  <p className="text-xs text-slate-500">{selectedVendor.phone || mockFullDetails.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</p>
                  <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" /> {selectedVendor.kycStatus || mockFullDetails.kyc}
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <PackageCheck className="w-4 h-4" /> Offered Services
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(selectedVendor.services || mockFullDetails.services).map((service, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
                      {service.name || service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => handleAction(selectedVendor.id, 'Rejected')}
                className="flex-1 py-4 bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-300 transition-all"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleAction(selectedVendor.id, 'Approved')}
                className="flex-1 py-4 bg-green-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Approve Vendor
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ManageVendors;
