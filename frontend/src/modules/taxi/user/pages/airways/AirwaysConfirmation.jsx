import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  PlaneTakeoff,
  Ticket,
  Users,
  Download,
  Share2,
  ChevronRight,
  ShieldCheck,
  Clock3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatTravelDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return 'Travel date pending';
  }
  return parsed.toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTimeLabel = (value = '') => {
  const normalized = String(value || '').trim();
  if (!normalized) return '--';

  const parsed = new Date(`2000-01-01T${normalized}`);
  if (Number.isNaN(parsed.getTime())) return normalized;

  return parsed.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const AirwaysConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(!location.state?.booking);
  const [booking, setBooking] = useState(location.state?.booking || null);

  useEffect(() => {
    if (booking) return;

    const loadBooking = async () => {
      try {
        setLoading(true);
        const nextBooking = await userService.getAirwayBooking(bookingId);
        if (!nextBooking) {
          toast.error('Booking ticket not found.');
          navigate('/taxi/user/airways', { replace: true });
          return;
        }
        setBooking(nextBooking);
      } catch (error) {
        console.error(error);
        toast.error('Could not load the helicopter ticket.');
        navigate('/taxi/user/airways', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [booking, bookingId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-5 py-6">
        <div className="mx-auto max-w-lg space-y-4">
          <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-[520px] animate-pulse rounded-[40px] bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans no-scrollbar">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/taxi/user/airways')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-sm font-black text-slate-950 uppercase tracking-widest">E-Ticket</h1>
          <button className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-8">
        {/* Success Animation Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="h-20 w-20 rounded-[32px] bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="mt-6 text-2xl font-black text-slate-950">Booking Confirmed!</h2>
          <p className="mt-2 text-sm font-bold text-slate-400">Your seat is secured. Have a great flight!</p>
        </motion.div>

        {/* Boarding Pass Style Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Top Part */}
          <div className="bg-white rounded-t-[40px] p-8 border-x border-t border-slate-100 shadow-[0_-20px_40px_rgba(15,23,42,0.02)]">
            <div className="flex items-center justify-between pb-6 border-b border-dashed border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <PlaneTakeoff size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Airline</p>
                  <p className="text-sm font-black text-slate-950">{booking.airwayName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class</p>
                <p className="text-sm font-black text-emerald-600">Premium</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-4xl font-black text-slate-950">{booking.originAirport}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{booking.routeName.split(' to ')[0] || 'Origin'}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 w-24">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                  <div className="h-px flex-1 bg-slate-100" />
                  <PlaneTakeoff size={18} className="text-sky-500" />
                  <div className="h-px flex-1 bg-slate-100" />
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                </div>
                <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{booking.flightNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-slate-950">{booking.destinationAirport}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{booking.routeName.split(' to ')[1] || 'Dest'}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                <p className="text-sm font-black text-slate-950 mt-1">{formatTravelDate(booking.travelDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Departure</p>
                <p className="text-sm font-black text-slate-950 mt-1">{formatTimeLabel(booking.departureTime)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Passenger</p>
                <p className="text-sm font-black text-slate-950 mt-1 line-clamp-1">{booking.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seats</p>
                <p className="text-sm font-black text-slate-950 mt-1">{booking.seatCount} Seat(s)</p>
              </div>
            </div>
          </div>

          {/* Perforated Edge */}
          <div className="relative h-12 bg-white border-x border-slate-100 flex items-center overflow-hidden">
            <div className="absolute left-0 -translate-x-1/2 h-8 w-8 rounded-full bg-[#F8FAFC] border border-slate-100 shadow-inner" />
            <div className="flex-1 border-t-2 border-dashed border-slate-100 mx-6" />
            <div className="absolute right-0 translate-x-1/2 h-8 w-8 rounded-full bg-[#F8FAFC] border border-slate-100 shadow-inner" />
          </div>

          {/* Bottom Part */}
          <div className="bg-white rounded-b-[40px] p-8 border-x border-b border-slate-100 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Booking ID</p>
                  <p className="text-base font-black text-slate-950 mt-1">#{booking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Paid</p>
                  <p className="text-2xl font-black text-sky-600 mt-1">{formatCurrency(booking.totalFare)}</p>
                </div>
              </div>
              <div className="h-24 w-24 bg-slate-50 rounded-2xl flex items-center justify-center p-2">
                {/* Visual QR Code Placeholder */}
                <div className="w-full h-full border-2 border-slate-200 border-dashed rounded-lg flex items-center justify-center">
                    <Ticket size={32} className="text-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button className="w-full flex items-center justify-center gap-3 rounded-[28px] bg-slate-950 py-5 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-transform">
            <Download size={20} />
            Download Ticket
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => navigate('/taxi/user/airways')}
                className="flex items-center justify-center gap-2 rounded-[24px] bg-white border border-slate-100 py-4 text-slate-600 font-black text-[11px] uppercase tracking-widest active:scale-[0.98] transition-transform shadow-sm"
            >
                New Booking
            </button>
            <button
                onClick={() => navigate('/taxi/user')}
                className="flex items-center justify-center gap-2 rounded-[24px] bg-white border border-slate-100 py-4 text-slate-600 font-black text-[11px] uppercase tracking-widest active:scale-[0.98] transition-transform shadow-sm"
            >
                Back to Home
            </button>
          </div>
        </div>

        {/* Info Section */}
        <section className="mt-10 space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                <InfoIcon size={20} />
             </div>
             <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest">Important Information</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-[28px] bg-white border border-slate-50 shadow-sm">
                <Clock3 size={18} className="text-sky-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-black text-slate-900">Reporting Time</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 leading-relaxed">Please reach the helipad at least 45 minutes before departure for security check and weight measurement.</p>
                </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-[28px] bg-white border border-slate-50 shadow-sm">
                <ShieldCheck size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-black text-slate-900">ID Requirement</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 leading-relaxed">Carry a valid Government-issued photo ID (Aadhar, PAN, or Passport) for all passengers listed on this ticket.</p>
                </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const InfoIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

export default AirwaysConfirmation;
