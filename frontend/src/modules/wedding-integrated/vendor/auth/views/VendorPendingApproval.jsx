import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, ShieldCheck, Home, MessageSquare } from 'lucide-react';

const VendorPendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 text-center space-y-8 animate-in zoom-in-95 duration-500">
        {/* Status Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
            <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-amber-100">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Application Submitted!
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Thank you for applying to join <span className="text-primary font-bold">My Destination</span>. Our team is currently reviewing your business details and documents.
          </p>
        </div>

        {/* Status Steps */}
        <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-700">Application Submitted</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-700">Admin Verification (In Progress)</p>
          </div>
          <div className="flex items-center gap-3 opacity-30">
            <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-white">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-500">Login Credentials & Dashboard Access</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 text-left">
          <MessageSquare className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-[10px] font-medium text-blue-600 leading-tight">
            Verification typically takes <span className="font-bold">24-48 hours</span>. You will be able to login once your account is approved by admin.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/wedding")}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          <Home className="w-4 h-4" /> Go to Home
        </button>
      </div>
    </div>
  );
};

export default VendorPendingApproval;
