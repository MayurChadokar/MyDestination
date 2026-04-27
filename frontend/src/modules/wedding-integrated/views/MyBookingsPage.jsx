import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, MapPin, Users, 
  ChevronRight, BadgeCheck, Clock, 
  AlertCircle, ArrowLeft 
} from "lucide-react";
import { myBookings, formatPrice } from "../data/weddingData";
import ScrollReveal from "../components/ScrollReveal";

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
          icon: BadgeCheck,
          border: 'border-emerald-100'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          icon: Clock,
          border: 'border-amber-100'
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-600',
          icon: AlertCircle,
          border: 'border-rose-100'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-600',
          icon: Clock,
          border: 'border-slate-100'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafb] pb-20 pt-8 md:pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
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
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                My Bookings
              </h1>
              <p className="text-muted-foreground font-medium">
                Track and manage your scheduled wedding celebrations.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {myBookings.map((booking, i) => {
            const styles = getStatusStyles(booking.status);
            const StatusIcon = styles.icon;

            return (
              <ScrollReveal key={booking.id} delay={i * 100}>
                <div className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-500 overflow-hidden flex flex-col md:flex-row h-auto md:h-[220px]">
                  
                  {/* Image Column */}
                  <div className="w-full md:w-[280px] h-[160px] md:h-full relative overflow-hidden group-hover:transform transition-transform duration-700">
                    <img 
                      src={booking.image} 
                      alt={booking.destination} 
                      className="w-full h-full object-cover transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm border ${styles.bg}/80 ${styles.border} ${styles.text}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-between relative">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-primary">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                              {booking.destination}
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {booking.venueName}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Budget</div>
                          <div className="text-lg md:text-xl font-black text-primary">
                            {formatPrice(booking.totalBudget)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:gap-6 pt-1 md:pt-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Date</div>
                            <div className="text-xs font-black text-slate-700">{booking.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Planner</div>
                            <div className="text-xs font-black text-slate-700">{booking.plannerName}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 md:mt-0 flex items-center justify-end">
                      <button 
                        onClick={() => navigate(`/wedding/bookings/${booking.id}`)}
                        className="flex items-center gap-1 text-[11px] font-black text-primary hover:gap-2 transition-all uppercase tracking-widest"
                      >
                        View Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Empty State Helper (If no bookings) */}
        {myBookings.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-lg text-muted-foreground font-medium">
              You haven't booked any weddings yet.
            </p>
            <Link to="/wedding" className="inline-block mt-6 text-primary font-bold hover:underline">
              Start planning now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
