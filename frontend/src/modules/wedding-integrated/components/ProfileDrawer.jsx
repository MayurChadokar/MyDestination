import React from "react";
import { createPortal } from "react-dom";
import { 
  X, User, Settings, LogOut, 
  Calendar, Heart, Users, MessageSquare,
  ChevronRight, Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const ProfileDrawer = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: Calendar, label: "My Bookings", to: "/wedding/bookings" },
    { icon: Heart, label: "Saved Destinations", to: "/wedding/saved" },
    { icon: Users, label: "Wedding Planner", to: "/wedding/planners" },
    { icon: MessageSquare, label: "My Enquiries", to: "/wedding/my-enquiries" },
    { icon: Settings, label: "Account Settings", to: "/wedding/settings" },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[10000] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute top-0 right-0 h-full w-[280px] sm:w-[420px] bg-white/90 backdrop-blur-2xl shadow-2xl border-l border-white/20 transform transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"} animate-in slide-in-from-right duration-500`}>
        
        {/* Header Section */}
        <div className="p-5 pt-8 border-b border-slate-100/50">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
                  alt="Sagar Chouhan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-2 border-white shadow-sm">
                <Bell className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sagar Chouhan
            </h2>
            <Link 
              to="/wedding/settings" 
              onClick={onClose}
              className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group uppercase tracking-widest"
            >
              View profile
              <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/10"
            >
              <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="flex-1 text-[13px] font-bold text-slate-600 group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        {/* Footer section (Logout) */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-100/50 bg-white/50 backdrop-blur-md">
          <button 
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold border border-transparent hover:border-red-100"
            onClick={onClose}
          >
            <div className="p-2 rounded-xl bg-red-50 text-red-500 shadow-sm">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-sm">Log out</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileDrawer;
