import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Menu, 
  ChevronDown, 
  UserCircle,
  LogOut,
  Settings,
  User
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const VendorNavbar = ({ onOpenSidebar, title = "Dashboard" }) => {
  const [vendorName, setVendorName] = useState("Zoya Khan");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/wedding/vendor/login");
  };
  
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && e.detail.name) setVendorName(e.detail.name);
    };

    window.addEventListener('vendorProfileUpdate', handleUpdate);
    return () => window.removeEventListener('vendorProfileUpdate', handleUpdate);
  }, []);

  return (
    <header className="sticky top-0 right-0 left-0 bg-[#F7F1ED] border-b border-[#DED0C5] z-50 transition-all duration-300 shadow-sm">
      <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-12 gap-3">
        
        {/* Title Area - Hidden on mobile search */}
        {!showMobileSearch && (
          <div className="flex items-center gap-6 animate-wedding-fade-in shrink-0">
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-black text-[#4A3730] uppercase tracking-wider leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B06A6C] animate-pulse" />
                <p className="text-[9px] md:text-[10px] font-black text-[#7B6A62] uppercase tracking-[0.25em]">
                  Vendor Workspace
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search Input */}
        {showMobileSearch && (
          <div className="flex-1 lg:hidden animate-wedding-slide-down">
             <div className="relative flex items-center bg-white border border-[#B06A6C]/20 rounded-xl px-4 h-11 shadow-sm">
                <Search className="w-4 h-4 text-[#B06A6C] shrink-0" />
                <input 
                  autoFocus 
                  placeholder="Search in workspace..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] font-bold outline-none border-none text-[#4A3730] ml-3"
                  onKeyUp={(e) => e.key === 'Enter' && setShowMobileSearch(false)}
                />
                <button 
                  onClick={() => { setShowMobileSearch(false); setSearchQuery(""); }} 
                  className="text-[10px] font-black text-[#B06A6C] uppercase ml-2 px-2"
                >
                   Close
                </button>
             </div>
          </div>
        )}

        {/* Global Search (Desktop) */}
        <div className="hidden lg:flex relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors group-focus-within:text-[#B06A6C]" />
          <input 
            type="text" 
            placeholder="Quick Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-[#F3E9E2]/50 border border-transparent focus:border-[#B06A6C]/20 focus:bg-white rounded-xl text-[13px] font-medium transition-all w-64 focus:w-80 outline-none"
          />
        </div>

        {/* Action Icons */}
        <div className={`flex items-center gap-2 md:gap-4 ${showMobileSearch ? 'hidden md:flex' : 'flex'}`}>
          <button className="relative w-10 h-10 rounded-xl bg-white border border-[#F3E9E2] text-[#8E7E77] flex items-center justify-center hover:bg-[#F3E9E2] transition-colors group">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-400 rounded-full border-2 border-white" />
          </button>
          
          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setShowMobileSearch(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-[#B06A6C]/10 text-[#B06A6C] flex items-center justify-center hover:bg-[#B06A6C] hover:text-white transition-all group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <div className="h-8 w-[1px] bg-[#F3E9E2] mx-1 hidden lg:block" />

          {/* Profile Dropdown */}
          <div className="relative">
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md relative">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="hidden sm:flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#4A3730]">{vendorName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8E7E77] transition-transform duration-300 ${showDropdown ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Verified</span>
              </div>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[#F3E9E2] z-50 py-2 animate-wedding-slide-down">
                  <div className="px-4 py-2 border-b border-[#F3E9E2] mb-1">
                    <p className="text-[10px] font-black text-[#B06A6C] uppercase tracking-[0.2em] mb-0.5">Logged in as</p>
                    <p className="text-[12px] font-bold text-[#4A3730] truncate">{vendorName}</p>
                  </div>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate("/wedding/vendor/profile"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-black text-[#7B6A62] hover:bg-[#F3E9E2]/30 hover:text-[#B06A6C] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => { setShowDropdown(false); navigate("/wedding/vendor/settings"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-black text-[#7B6A62] hover:bg-[#F3E9E2]/30 hover:text-[#B06A6C] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="h-[1px] bg-[#F3E9E2] my-1 mx-2" />
                  <button 
                    onClick={() => { setShowDropdown(false); setShowLogoutModal(true); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-black text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(30,15,10,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-[2rem] border border-[#DED0C5] shadow-2xl overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#B06A6C] to-[#C17A7C]" />
            <div className="p-8 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#B06A6C]/10 flex items-center justify-center">
                <LogOut className="w-7 h-7 text-[#B06A6C]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#4A3730]">Sign Out?</h3>
                <p className="text-sm text-[#7B6A62] font-semibold mt-1">Are you sure you want to sign out?</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3.5 rounded-2xl font-black text-[13px] text-[#7B6A62] bg-[#F3E9E2]/30 border border-[#F3E9E2] hover:bg-[#F3E9E2]/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3.5 rounded-2xl font-black text-[13px] text-white bg-[#B06A6C] hover:bg-[#9d313d] transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default VendorNavbar;
