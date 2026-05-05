import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { weddingService } from '../../../../services/weddingService';
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
  IndianRupee,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

const ManageVendors = () => {
  const location = useLocation();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await weddingService.getAdminVendors();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      setLoading(true);
      const statusValue = status === 'Approved' ? 'approved' : 'rejected';
      await weddingService.updateVendorStatus(id, statusValue);
      alert(`Vendor ${status} successfully!`);
      if (selectedVendor?._id === id) setSelectedVendor(null);
      fetchData();
    } catch (error) {
      alert('Failed to update vendor status');
    } finally {
      setLoading(false);
    }
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
  
  const filteredVendors = vendors.filter(v => {
    if (isPendingView) return v.partnerApprovalStatus === 'pending';
    return v.partnerApprovalStatus === 'approved' || v.partnerApprovalStatus === 'rejected';
  });

  if (loading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(353,45%,35%)]"></div>
      </div>
    );
  }

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
                  ? `Review and verify ${filteredVendors.length} new vendor applications`
                  : `Manage and oversee all ${filteredVendors.length} registered vendors on the platform`}
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

        <div className="space-y-4">
          <div className={`${adminStyles.glassCard} p-8 rounded-3xl`}>
            {filteredVendors.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`${adminStyles.heading} text-2xl font-bold`}>
                    {isPendingView ? 'New Applications' : 'Vendor Directory'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredVendors.map((vendor) => (
                    <div key={vendor._id} className="p-6 rounded-2xl bg-white border border-[#F3E9E2] flex items-center justify-between group hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[hsl(353,45%,45%)] to-[hsl(353,45%,35%)] flex items-center justify-center text-white font-bold text-2xl shadow-inner transition-transform">
                          {vendor.name?.[0] || 'V'}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-[hsl(353,20%,15%)] leading-none mb-2">{vendor.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium px-2 py-0.5 bg-[hsl(353,45%,35%)]/10 text-[hsl(353,45%,35%)] rounded">
                              {vendor.category || 'Vendor'}
                            </span>
                            <span className="text-xs text-gray-400">|</span>
                            <p className="text-sm text-gray-700">{vendor.location || 'Location Not Set'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {!isPendingView && (
                          <div className="text-right mr-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              vendor.partnerApprovalStatus === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {vendor.partnerApprovalStatus}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="p-2 text-slate-400 hover:text-[hsl(353,45%,35%)] hover:bg-[hsl(353,45%,35%)]/5 rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye size={22} />
                          </button>
                          {isPendingView && (
                            <>
                              <button
                                onClick={() => handleAction(vendor._id, 'Rejected')}
                                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleAction(vendor._id, 'Approved')}
                                className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-md shadow-green-200 transition-all active:scale-95"
                              >
                                Approve
                              </button>
                            </>
                          )}
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
                  <p className="text-gray-500 mt-2">No vendors found in this category.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#4A3730]/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedVendor(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 z-[101]">
            <div className="bg-[#B06A6C] p-8 text-white relative">
              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center text-[#B06A6C] text-3xl font-black shadow-xl">
                  {selectedVendor.name?.[0] || 'V'}
                </div>
                <div>
                  <h3 className="text-2xl font-black">{selectedVendor.name}</h3>
                  <div className="flex items-center gap-3 mt-1 underline underline-offset-4 decoration-white/30">
                    <span className="text-sm font-bold opacity-90">{selectedVendor.category || 'Vendor'}</span>
                    <span className="opacity-50">|</span>
                    <span className="text-sm font-bold opacity-90 italic">{selectedVendor.location || 'Location Not Set'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B06A6C]" /> {selectedVendor.experience ? `${selectedVendor.experience} Years` : 'Not Specified'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4" /> {selectedVendor.basicPackage ? `From ₹${selectedVendor.basicPackage}` : 'On Request'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</p>
                  <p className="text-sm font-bold text-slate-800">{selectedVendor.email}</p>
                  <p className="text-xs text-slate-500">{selectedVendor.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</p>
                  <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" /> {selectedVendor.kycStatus || 'Pending Verification'}
                  </div>
                </div>
              </div>

              {selectedVendor.services?.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <PackageCheck className="w-4 h-4" /> Offered Services
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.services.map((service, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
                        {service.name} {service.price ? `(₹${service.price})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedVendor.partnerApprovalStatus === 'pending' && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button
                  onClick={() => handleAction(selectedVendor._id, 'Rejected')}
                  className="flex-1 py-4 bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-300 transition-all"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleAction(selectedVendor._id, 'Approved')}
                  className="flex-1 py-4 bg-green-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Approve Vendor
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ManageVendors;
