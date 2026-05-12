import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  PlaneTakeoff,
  ShieldCheck,
  Ticket,
  UserRound,
  Users,
  Clock3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../../../shared/context/SettingsContext';
import { userService } from '../../services/userService';

const PHONEPE_PENDING_BOOKING_KEY = 'taxi-airway-phonepe-booking';

const tomorrowDateValue = () => {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  return next.toISOString().slice(0, 10);
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatTravelDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return 'Select travel date';
  }
  return parsed.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTimeLabel = (value = '') => {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return '--';
  }

  const date = new Date(`2000-01-01T${normalized}`);
  if (Number.isNaN(date.getTime())) {
    return normalized;
  }

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const readStoredUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem('userInfo') || '{}');
  } catch {
    return {};
  }
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const AirwaysRouteBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { routeId } = useParams();
  const { settings } = useSettings();
  const activePaymentGateway = settings.paymentGateway || null;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [route, setRoute] = useState(null);
  const [seatCount, setSeatCount] = useState(1);
  const [travelDate, setTravelDate] = useState(location.state?.travelDate || tomorrowDateValue());
  const [selectedAirwayId, setSelectedAirwayId] = useState(location.state?.selectedAirwayId || '');
  const [passengerNames, setPassengerNames] = useState(['']);
  const [formData, setFormData] = useState(() => {
    const storedUser = readStoredUser();
    return {
      customerName: storedUser?.name || '',
      customerPhone: storedUser?.phone || '',
      customerEmail: storedUser?.email || '',
      notes: '',
    };
  });
  const paymentMethod = 'online';

  const routeAirways = Array.isArray(route?.airways) && route.airways.length > 0
    ? route.airways
    : route?.airway
      ? [route.airway]
      : [];
  const selectedAirway = routeAirways.find((item) => item?.id === selectedAirwayId) || routeAirways[0] || route?.airway || null;
  const subtotalFare = Number(selectedAirway?.basePrice || route?.baseFare || 0) * seatCount;
  const serviceTaxPercent = Number(selectedAirway?.serviceTaxPercent || route?.serviceTaxPercent || 0);
  const serviceTaxAmount = (subtotalFare * serviceTaxPercent) / 100;
  const totalFare = subtotalFare + serviceTaxAmount;

  const buildBookingPayload = () => ({
    routeId: route?.id,
    selectedAirwayId: selectedAirway?.id || selectedAirwayId || route?.airway?.id || '',
    seatCount,
    customerName: formData.customerName,
    customerPhone: formData.customerPhone,
    customerEmail: formData.customerEmail,
    passengerNames,
    notes: formData.notes,
    travelDate,
    subtotalFare,
    serviceTaxPercent,
    serviceTaxAmount,
    totalFare,
    paymentMethod,
    paymentMethodLabel: activePaymentGateway?.label || 'Online',
    gatewaySlug: activePaymentGateway?.slug || '',
  });

  useEffect(() => {
    const loadRoute = async () => {
      try {
        setLoading(true);
        const nextRoute = await userService.getAirwayRoute(routeId);
        if (!nextRoute) {
          toast.error('Helicopter route not found.');
          navigate('/taxi/user/airways', { replace: true });
          return;
        }
        const routeAirwayIds = Array.isArray(nextRoute?.airways) ? nextRoute.airways.map((item) => item.id).filter(Boolean) : [];
        if (routeAirwayIds.length > 0) {
          setSelectedAirwayId((current) => (
            current && routeAirwayIds.includes(current)
              ? current
              : (location.state?.selectedAirwayId && routeAirwayIds.includes(location.state.selectedAirwayId))
                ? location.state.selectedAirwayId
                : routeAirwayIds[0]
          ));
        }
        setRoute(nextRoute);
      } catch (error) {
        console.error(error);
        toast.error('Could not load the helicopter route.');
        navigate('/taxi/user/airways', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [navigate, routeId]);

  useEffect(() => {
    setPassengerNames((current) => {
      const next = Array.from({ length: seatCount }, (_, index) => current[index] || '');
      if (!next[0] && formData.customerName) {
        next[0] = formData.customerName;
      }
      return next;
    });
  }, [formData.customerName, seatCount]);

  useEffect(() => {
    const merchantTransactionId = new URLSearchParams(window.location.search).get('phonepe_txn');
    if (!merchantTransactionId || activePaymentGateway?.slug !== 'phone_pay') {
      return;
    }

    let cancelled = false;

    const clearPhonePeQuery = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('phonepe_txn');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    };

    const verifyPhonePePayment = async () => {
      let pendingPayload = null;
      try {
        pendingPayload = JSON.parse(window.sessionStorage.getItem(PHONEPE_PENDING_BOOKING_KEY) || 'null');
      } catch {
        pendingPayload = null;
      }

      if (!pendingPayload || pendingPayload.routeId !== routeId) {
        clearPhonePeQuery();
        toast.error('Could not restore your pending PhonePe booking details.');
        return;
      }

      setSubmitting(true);
      try {
        const response = await userService.verifyAirwayBookingPayment({
          gateway: 'phone_pay',
          merchantTransactionId,
          ...pendingPayload,
        });

        if (cancelled) return;

        if (response?.status === 'pending') {
          toast.error('PhonePe payment is still pending. Please wait a moment and refresh.');
          return;
        }

        if (response?.status === 'failed') {
          toast.error('PhonePe payment was not completed.');
          return;
        }

        window.sessionStorage.removeItem(PHONEPE_PENDING_BOOKING_KEY);
        clearPhonePeQuery();
        toast.success('Seat booked and paid successfully.');
        navigate(`/taxi/user/airways/confirmation/${response.id}`, { state: { booking: response } });
      } catch (error) {
        if (!cancelled) {
          toast.error(error?.message || 'Could not verify PhonePe payment.');
        }
      } finally {
        if (!cancelled) {
          setSubmitting(false);
        }
      }
    };

    verifyPhonePePayment();

    return () => {
      cancelled = true;
    };
  }, [activePaymentGateway?.slug, navigate, routeId]);

  const setField = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const setPassengerName = (index, value) => {
    setPassengerNames((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const handleSeatAdjust = (direction) => {
    setSeatCount((current) => {
      const available = Math.max(1, Number(route?.availableSeats || 1));
      if (direction === 'decrement') {
        return Math.max(1, current - 1);
      }
      return Math.min(available, current + 1);
    });
  };

  const handleSubmit = async () => {
    if (!activePaymentGateway) {
      toast.error('No payment gateway is enabled in the admin panel right now.');
      return;
    }

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      toast.error('Passenger contact name and phone are required.');
      return;
    }

    if (passengerNames.some((item) => !String(item || '').trim())) {
      toast.error('Please enter every passenger name before booking.');
      return;
    }

    try {
      setSubmitting(true);
      const bookingPayload = buildBookingPayload();

      if (activePaymentGateway.slug === 'phone_pay') {
        const session = await userService.createAirwayBookingOrder(bookingPayload);
        if (!session?.checkoutUrl) {
          throw new Error('Unable to start PhonePe payment');
        }

        window.sessionStorage.setItem(PHONEPE_PENDING_BOOKING_KEY, JSON.stringify(bookingPayload));
        window.location.assign(session.checkoutUrl);
        return;
      }

      if (activePaymentGateway.slug !== 'razor_pay') {
        throw new Error(`${activePaymentGateway.label} is enabled by admin, but airway checkout is not implemented for it yet.`);
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      const order = await userService.createAirwayBookingOrder(bookingPayload);
      if (!order?.keyId || !order?.orderId) {
        throw new Error('Unable to start payment');
      }

      let userInfo = {};
      try {
        userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      } catch {
        userInfo = {};
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: selectedAirway?.airlineName || route?.airway?.airlineName || 'Airways Booking',
        description: `${route?.originAirport || ''} to ${route?.destinationAirport || ''}`.trim(),
        order_id: order.orderId,
        prefill: {
          name: formData.customerName || userInfo?.name || '',
          email: formData.customerEmail || userInfo?.email || '',
          contact: formData.customerPhone || userInfo?.phone || '',
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
        handler: async (response) => {
          try {
            const booking = await userService.verifyAirwayBookingPayment({
              gateway: 'razor_pay',
              ...response,
              ...bookingPayload,
            });

            toast.success('Seat booked and paid successfully.');
            navigate(`/taxi/user/airways/confirmation/${booking.id}`, { state: { booking } });
          } catch (error) {
            toast.error(
              error?.message ||
              'Payment verification failed. Please contact support if payment was deducted.',
            );
          } finally {
            setSubmitting(false);
          }
        },
        theme: {
          color: '#0ea5e9',
        },
      });

      rzp.on('payment.failed', (event) => {
        const message = event?.error?.description || event?.error?.reason || 'Payment failed';
        toast.error(message);
        setSubmitting(false);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Could not complete helicopter booking.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-5 py-6">
        <div className="mx-auto max-w-lg space-y-4">
          <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-64 animate-pulse rounded-[32px] bg-white shadow-sm" />
          <div className="h-80 animate-pulse rounded-[32px] bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (!route) return null;

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
          <h1 className="text-sm font-black text-slate-950 uppercase tracking-widest">Review & Pay</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-6">
        {/* Ticket Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[40px] bg-slate-950 p-8 text-white shadow-2xl"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">Flight Route</p>
                <h2 className="mt-2 text-2xl font-black">{route.routeName}</h2>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <PlaneTakeoff size={24} className="text-sky-400" />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-3xl font-black">{route.originAirport}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{formatTimeLabel(route.departureTime)}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
                  {route.durationMinutes} mins
                </div>
                <div className="flex items-center gap-1.5 w-20">
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                  <div className="h-px flex-1 bg-white/20" />
                  <PlaneTakeoff size={14} className="text-sky-400" />
                  <div className="h-px flex-1 bg-white/20" />
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                </div>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Direct</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-3xl font-black">{route.destinationAirport}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{formatTimeLabel(route.arrivalTime)}</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Travel Date</p>
                <p className="mt-1 text-sm font-black">{formatTravelDate(travelDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Aircraft</p>
                <p className="mt-1 text-sm font-black">{selectedAirway?.airlineName || 'Helicopter'}</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px]" />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />
        </motion.div>

        {/* Flight Selector (if multiple) */}
        {routeAirways.length > 1 && (
          <section className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Change Operator</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {routeAirways.map((airway) => (
                <button
                  key={airway.id}
                  onClick={() => setSelectedAirwayId(airway.id)}
                  className={`min-w-[180px] rounded-3xl p-4 border transition-all ${
                    selectedAirwayId === airway.id
                      ? 'bg-white border-sky-500 shadow-md ring-4 ring-sky-500/5'
                      : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest">{airway.airlineCode}</p>
                  <p className={`text-sm font-black mt-1 ${selectedAirwayId === airway.id ? 'text-slate-950' : ''}`}>{airway.airlineName}</p>
                  <p className="text-[10px] font-bold mt-2">{formatCurrency(airway.basePrice)}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Passengers & Date Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[32px] bg-white p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Seats</p>
                <div className="flex items-center gap-4 mt-1">
                  <button
                    onClick={() => handleSeatAdjust('decrement')}
                    className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 active:bg-slate-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-black">{seatCount}</span>
                  <button
                    onClick={() => handleSeatAdjust('increment')}
                    className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 active:bg-slate-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[32px] bg-white p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                <CalendarDays size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Travel Date</p>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-transparent mt-1 text-sm font-black text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <section className="rounded-[32px] bg-white p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
              <UserRound size={18} />
            </div>
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest">Contact Details</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                value={formData.customerName}
                onChange={(e) => setField('customerName', e.target.value)}
                placeholder="Lead passenger name"
                className="w-full rounded-2xl bg-slate-50 px-5 py-3.5 text-sm font-black text-slate-900 outline-none border border-transparent focus:border-violet-200 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <input
                  value={formData.customerPhone}
                  onChange={(e) => setField('customerPhone', e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-2xl bg-slate-50 px-5 py-3.5 text-sm font-black text-slate-900 outline-none border border-transparent focus:border-violet-200 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input
                  value={formData.customerEmail}
                  onChange={(e) => setField('customerEmail', e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-2xl bg-slate-50 px-5 py-3.5 text-sm font-black text-slate-900 outline-none border border-transparent focus:border-violet-200 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Passenger Roster */}
        <section className="rounded-[32px] bg-white p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users size={18} />
            </div>
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest">Passenger Roster</h3>
          </div>

          <div className="space-y-3">
            {passengerNames.map((name, idx) => (
              <div key={idx} className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">P{idx + 1}</span>
                <input
                  value={name}
                  onChange={(e) => setPassengerName(idx, e.target.value)}
                  placeholder={`Full Name of Passenger ${idx + 1}`}
                  className="w-full rounded-2xl bg-slate-50 pl-12 pr-5 py-3.5 text-sm font-black text-slate-900 outline-none border border-transparent focus:border-emerald-200 transition-all"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Fare Summary */}
        <section className="rounded-[32px] bg-white p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest">Fare Breakup</h3>
            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest">
              Live Fare
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Seat Fare ({seatCount} x {formatCurrency(selectedAirway?.basePrice)})</span>
              <span className="text-slate-900">{formatCurrency(subtotalFare)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Service Tax ({serviceTaxPercent}%)</span>
              <span className="text-slate-900">{formatCurrency(serviceTaxAmount)}</span>
            </div>
            <div className="h-px bg-slate-50 pt-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-slate-950">Grand Total</span>
              <span className="text-2xl font-black text-sky-600">{formatCurrency(totalFare)}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 flex items-start gap-3">
            <ShieldCheck size={18} className="text-sky-600 mt-0.5" />
            <div>
              <p className="text-[11px] font-black text-slate-900">Secure Payment Guaranteed</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">Your payment is processed through encrypted channels via {activePaymentGateway?.label || 'Online'}.</p>
            </div>
          </div>
        </section>

        {/* Payment Button */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting || !activePaymentGateway}
            className="w-full group relative overflow-hidden rounded-[28px] bg-slate-950 py-5 text-white shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {submitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <CreditCard size={20} />
              )}
              <span className="text-sm font-black uppercase tracking-[0.2em]">
                {submitting ? 'Processing Payment...' : `Pay ${formatCurrency(totalFare)} Now`}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          {!activePaymentGateway && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <p className="text-[10px] font-bold text-amber-800">
                Online payment is currently unavailable. Please enable a payment gateway in the admin panel to proceed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirwaysRouteBooking;
