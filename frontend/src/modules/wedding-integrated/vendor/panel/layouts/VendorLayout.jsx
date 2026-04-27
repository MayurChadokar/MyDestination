import React, { useState } from "react";
import VendorSidebar from "../components/VendorSidebar";
import VendorNavbar from "../components/VendorNavbar";
import VendorBottomNavbar from "../components/VendorBottomNavbar";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, Clock } from "lucide-react";

const VendorLayout = ({ children, title = "Dashboard" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isPending = user?.status === "pending";

  return (
    <div className="min-h-screen bg-[#F7F1ED]">
      {/* Navigation Sidebar */}
      <VendorSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Framework */}
      <div className={`flex flex-col min-h-screen relative transition-all duration-500 lg:pl-[20rem] ${isPending ? 'pt-12' : ''}`}>
        {isPending && (
          <div className="fixed top-0 right-0 left-0 lg:left-[20rem] h-12 bg-amber-500 text-white z-[60] flex items-center justify-center px-4 gap-2 shadow-lg animate-wedding-slide-down">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em]">Account Pending Approval — Your profile is not live to users yet</span>
            <AlertCircle className="w-4 h-4 opacity-50" />
          </div>
        )}
        <VendorNavbar 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          title={title}
        />
        
        {/* Dynamic Content Area with Darker Workspace Background */}
        <main className="flex-1 p-2 pt-2 md:p-10 md:px-14 bg-gradient-to-tr from-[#F7F1ED] via-[#F3E9E2] to-white/30 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto pb-24 md:pb-16 animate-wedding-fade-up">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navbar */}
        {!isSidebarOpen && <VendorBottomNavbar />}
      </div>
    </div>
  );
};

export default VendorLayout;
