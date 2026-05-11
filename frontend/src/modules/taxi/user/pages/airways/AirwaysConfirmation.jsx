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
    hour: '2-digit',
    minute: '2-digit',
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
      <div className="min-h-screen bg-slate-50 px-5 py-6">
        <div className="mx-auto max-w-lg space-y-4">
          <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-[520px] animate-pulse rounded-[34px] bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)] pb-24 font-sans">
      <div className="mx-auto max-w-lg px-5 pb-10 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/taxi/user/airways')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-slate-700 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="rounded-full border border-emerald-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
            Booking Confirmed
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-[36px] border border-white/80 bg-white/95 p-6 shadow-[0_28px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-50 text-emerald-600 shadow-sm">
            <CheckCircle2 size={34} />
          </div>
          <h1 className="mt-5 text-center text-[28px] font-black tracking-tight text-slate-950">Helicopter seat booked</h1>
          <p className="mt-2 text-center text-sm font-semibold text-slate-500">
            Your helicopter booking has been saved and the admin ops team can now see it in Airways bookings.
          </p>

          <div className="mt-6 overflow-hidden rounded-[30px] border border-slate-950 bg-[linear-gradient(135deg,#020617_0%,#0f172a_50%,#1d4ed8_100%)] p-5 text-white shadow-[0_24px_44px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Ticket code</p>
                <h2 className="mt-2 text-[22px] font-black tracking-tight">{booking.bookingCode}</h2>
                <p className="mt-2 text-sm font-semibold text-white/75">{booking.airwayName}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <PlaneTakeoff size={22} />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-lg font-black">
              <span>{booking.routeName}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">Passengers</p>
                <p className="mt-2 text-sm font-black">{booking.seatCount}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">Fare</p>
                <p className="mt-2 text-sm font-black">{formatCurrency(booking.totalFare)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[28px] border border-slate-100 bg-slate-50/80 p-5">
            <div className="flex items-center justify-between text-sm font-bold text-slate-700">
              <span className="inline-flex items-center gap-2"><CalendarDays size={14} /> Travel</span>
              <span>{formatTravelDate(booking.travelDate)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-700">
              <span className="inline-flex items-center gap-2"><MapPin size={14} /> Flight</span>
              <span>{booking.flightNumber}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-700">
              <span className="inline-flex items-center gap-2"><Users size={14} /> Lead passenger</span>
              <span>{booking.customerName}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-700">
              <span className="inline-flex items-center gap-2"><Phone size={14} /> Contact</span>
              <span>{booking.customerPhone || '--'}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-700">
              <span className="inline-flex items-center gap-2"><CreditCard size={14} /> Payment</span>
              <span className="capitalize">{booking.paymentStatus} via {booking.paymentMethodLabel || booking.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-700">
              <span className="inline-flex items-center gap-2"><Ticket size={14} /> Booking status</span>
              <span className="capitalize">{booking.bookingStatus}</span>
            </div>
          </div>

          {Array.isArray(booking.passengerNames) && booking.passengerNames.length > 0 ? (
            <div className="mt-5 rounded-[28px] border border-slate-100 bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Passenger manifest</p>
              <div className="mt-4 space-y-2">
                {booking.passengerNames.map((name, index) => (
                  <div key={`${name}-${index}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
                    <span>Passenger {index + 1}</span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/taxi/user/airways')}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700"
            >
              Browse More Routes
            </button>
            <button
              type="button"
              onClick={() => navigate('/taxi/user')}
              className="flex-1 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-[0_16px_28px_rgba(15,23,42,0.2)]"
            >
              Back to Home
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AirwaysConfirmation;
