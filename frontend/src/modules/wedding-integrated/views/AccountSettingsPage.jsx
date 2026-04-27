import React from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Bell, BellOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

const AccountSettingsPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafb] pb-20 pt-8 md:pt-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <Link 
            to="/wedding" 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4 md:mb-6 group"
          >
            <div className="p-2 rounded-full border border-slate-200 group-hover:border-primary transition-colors bg-white shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>

          <ScrollReveal>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Account Settings
                </h1>
                <p className="text-muted-foreground font-medium">
                  Manage your personal details and app preferences.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={100}>
          <div className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] border border-slate-100 shadow-xl p-6 md:p-10 space-y-8 relative overflow-hidden">
            
            {/* Header / Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-md relative group">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
                  alt="Sagar Chouhan" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Sagar Chouhan
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-center sm:justify-start">
                  <Mail className="w-4 h-4 text-primary" />
                  sagar@example.com
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Profile Fields */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-primary/60" />
                      </div>
                      <input 
                        type="text" 
                        defaultValue="Sagar Chouhan"
                        className="w-full bg-slate-50/50 border border-slate-100 text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-primary/60" />
                      </div>
                      <input 
                        type="tel" 
                        defaultValue="+91 98765 43210"
                        className="w-full bg-slate-50/50 border border-slate-100 text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-primary/60" />
                    </div>
                    <input 
                      type="email" 
                      defaultValue="sagar@example.com"
                      className="w-full bg-slate-50/50 border border-slate-100 text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4 pt-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Preferences</h3>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">WhatsApp Updates</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Receive booking and enquiry updates</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200 text-slate-500 rounded-xl">
                      <BellOff className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">Email Promotions</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Marketing emails and offers</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default AccountSettingsPage;
