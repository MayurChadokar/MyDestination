import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Calendar, MapPin, Users, 
  BadgeCheck, Clock, AlertCircle, 
  Phone, Mail, MessageSquare, 
  CreditCard, CheckCircle2, ChevronRight
} from "lucide-react";
import { myBookings, formatPrice } from "../data/weddingData";
import ScrollReveal from "../components/ScrollReveal";

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = myBookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <button onClick={() => navigate('/wedding/bookings')} className="text-primary font-bold underline">
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: BadgeCheck, border: 'border-emerald-100' };
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock, border: 'border-amber-100' };
      case 'cancelled':
        return { bg: 'bg-rose-50', text: 'text-rose-600', icon: AlertCircle, border: 'border-rose-100' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-600', icon: Clock, border: 'border-slate-100' };
    }
  };

  const styles = getStatusStyles(booking.status);
  const StatusIcon = styles.icon;

  const timeline = [
    { label: "Booking Initiated", date: "Jan 12, 2024", completed: true },
    { label: "Venue Confirmed", date: "Jan 25, 2024", completed: true },
    { label: "Planner Assigned", date: "Feb 02, 2024", completed: true },
    { label: "Final Payment", date: "Pending", completed: false },
  ];

  return (
    <div className="min-h-screen bg-[#fafafb] pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 md:static z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/wedding/bookings')}
            className="p-2.5 rounded-full hover:bg-slate-50 transition-colors border border-slate-100"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="text-center">
            <h1 className="text-lg md:text-xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Booking Details
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">ID: {booking.id}</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {/* Status Banner */}
        <ScrollReveal>
          <div className={`p-5 rounded-[2rem] border ${styles.bg} ${styles.border} flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-white shadow-sm ${styles.text}`}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`font-black text-sm uppercase tracking-wider ${styles.text}`}>
                  {booking.status}
                </h2>
                <p className="text-xs text-slate-500 font-medium">Your wedding celebration is {booking.status.toLowerCase()}</p>
              </div>
            </div>
            <button className="hidden sm:block px-6 py-2 rounded-full bg-white text-xs font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
              Download Invoice
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Venue Card */}
            <ScrollReveal>
              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-slate-50">
                    <img src={booking.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-primary mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{booking.destination}</span>
                      </div>
                      <h3 className="text-2xl font-black text-foregroundLeading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {booking.venueName}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl pr-4 border border-slate-50">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl pr-4 border border-slate-50">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">150 Guests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Timeline */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-slate-400">Timeline</h3>
                <div className="space-y-0">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${item.completed ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400'}`}>
                          {item.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                        </div>
                        {i !== timeline.length - 1 && <div className={`w-0.5 flex-1 ${item.completed ? 'bg-primary/20' : 'bg-slate-100'}`} />}
                      </div>
                      <div className={i !== timeline.length - 1 ? "pb-6" : ""}>
                        <h4 className={`text-sm font-black uppercase tracking-wider ${item.completed ? 'text-foreground' : 'text-slate-400'}`}>
                          {item.label}
                        </h4>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Planner Card */}
            <ScrollReveal delay={300}>
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <h3 className="text-xs font-black mb-6 uppercase tracking-widest text-slate-400">Your Planner</h3>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=riya" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-foreground">{booking.plannerName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lead Strategist</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button className="flex-1 py-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                    </button>
                    <button className="flex-1 py-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-2 text-[#075E54]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Action Button for mobile */}
        <div className="md:hidden pt-4 pb-8 text-center">
            <button className="w-full py-4 rounded-full wedding-gradient text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all">
                Download PDF Summary
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
