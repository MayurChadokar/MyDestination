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

  const buildBookingPayload = () => ({
    routeId: route?.id,
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

  const subtotalFare = Number(route?.baseFare || 0) * seatCount;
  const serviceTaxPercent = Number(route?.serviceTaxPercent || 0);
  const serviceTaxAmount = (subtotalFare * serviceTaxPercent) / 100;
  const totalFare = subtotalFare + serviceTaxAmount;

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
        name: route?.airway?.airlineName || 'Airways Booking',
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
          color: '#0f766e',
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
      <div className="min-h-screen bg-slate-50 px-5 py-6">
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_42%,#ffffff_100%)] pb-24 font-sans">
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
            Route Checkout
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(135deg,#082f49_0%,#0f766e_55%,#22c55e_100%)] p-6 text-white shadow-[0_28px_56px_rgba(15,118,110,0.24)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/80">{route.airway?.airlineName}</p>
              <h1 className="mt-2 text-[28px] font-black leading-none tracking-tight">{route.routeName}</h1>
              <p className="mt-2 text-sm font-semibold text-emerald-50/85">{route.flightNumber} | Pilot {route.airway?.pilotName}</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
              <PlaneTakeoff size={24} />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[15px] font-black">
            <span>{route.originAirport}</span>
            <ChevronRight size={14} />
            <span>{route.destinationAirport}</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">Seats Left</p>
              <p className="mt-2 text-sm font-black">{route.availableSeats}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">Duration</p>
              <p className="mt-2 text-sm font-black">{route.durationMinutes} mins</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">Price</p>
              <p className="mt-2 text-sm font-black">{formatCurrency(route.totalFare)}</p>
            </div>
          </div>
        </motion.section>

        <section className="mt-5 space-y-5">
          <div className="rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Travel details</p>
                <h2 className="mt-1 text-[20px] font-black tracking-tight text-slate-950">Select seats and date</h2>
              </div>
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                <Ticket size={18} />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Travel date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(event) => setTravelDate(event.target.value)}
                className="mt-2 w-full bg-transparent text-sm font-black text-slate-900 outline-none"
              />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Seat count</p>
                <p className="mt-1 text-[18px] font-black text-slate-950">{seatCount} passenger{seatCount === 1 ? '' : 's'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSeatAdjust('decrement')}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-black text-slate-700"
                >
                  -
                </button>
                <div className="min-w-[44px] text-center text-lg font-black text-slate-950">{seatCount}</div>
                <button
                  type="button"
                  onClick={() => handleSeatAdjust('increment')}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-black text-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              {route.availableSeats} seats are currently available on this helicopter route.
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Passenger contact</p>
                <h2 className="mt-1 text-[20px] font-black tracking-tight text-slate-950">Primary traveller details</h2>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
                <UserRound size={18} />
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Full name</label>
                <input
                  value={formData.customerName}
                  onChange={(event) => setField('customerName', event.target.value)}
                  className="mt-2 w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                  placeholder="Enter lead passenger name"
                />
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Phone number</label>
                <input
                  value={formData.customerPhone}
                  onChange={(event) => setField('customerPhone', event.target.value)}
                  className="mt-2 w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Email</label>
                <input
                  value={formData.customerEmail}
                  onChange={(event) => setField('customerEmail', event.target.value)}
                  className="mt-2 w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                  placeholder="For travel confirmation"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Passenger roster</p>
                <h2 className="mt-1 text-[20px] font-black tracking-tight text-slate-950">Add every flyer name</h2>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                <Users size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {passengerNames.map((passengerName, index) => (
                <div key={`passenger-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Passenger {index + 1}</label>
                  <input
                    value={passengerName}
                    onChange={(event) => setPassengerName(index, event.target.value)}
                    className="mt-2 w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                    placeholder={`Traveller ${index + 1} full name`}
                  />
                </div>
              ))}

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Special request</label>
                <textarea
                  value={formData.notes}
                  onChange={(event) => setField('notes', event.target.value)}
                  rows={3}
                  className="mt-2 w-full resize-none bg-transparent text-sm font-bold text-slate-900 outline-none"
                  placeholder="Temple priority, luggage note, senior citizen support, or meeting point details"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Payment mode</p>
                <h2 className="mt-1 text-[20px] font-black tracking-tight text-slate-950">Choose how to confirm</h2>
              </div>
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-700">
                <CreditCard size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex w-full items-center justify-between rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-left shadow-sm">
                <div>
                  <p className="text-sm font-black text-slate-950">{activePaymentGateway?.label || 'No payment gateway enabled'}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {activePaymentGateway
                      ? 'Secure online checkout for this helicopter booking'
                      : 'Enable a payment gateway in Taxi Admin to accept online bookings here'}
                  </p>
                </div>
                <div className="rounded-full bg-sky-600 p-1 text-white">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </div>

            <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${activePaymentGateway ? 'border border-emerald-100 bg-emerald-50 text-emerald-800' : 'border border-amber-100 bg-amber-50 text-amber-800'}`}>
              {activePaymentGateway
                ? `Bookings on this route will use ${activePaymentGateway.label} because that is the gateway currently enabled in Taxi Admin.`
                : 'No gateway is enabled in Taxi Admin right now, so payment cannot be completed from this screen.'}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-950 bg-slate-950 p-5 text-white shadow-[0_24px_48px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Booking summary</p>
                <h2 className="mt-1 text-[22px] font-black tracking-tight">Trip total</h2>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <ShieldCheck size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm font-bold text-white/80">
                <span className="inline-flex items-center gap-2"><CalendarDays size={14} /> Travel date</span>
                <span>{formatTravelDate(travelDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-white/80">
                <span className="inline-flex items-center gap-2"><MapPin size={14} /> Route</span>
                <span>{route.originAirport} to {route.destinationAirport}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-white/80">
                <span className="inline-flex items-center gap-2"><Users size={14} /> Seats</span>
                <span>{seatCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-white/80">
                <span className="inline-flex items-center gap-2"><Phone size={14} /> Pilot contact</span>
                <span>{route.airway?.pilotPhone || '--'}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-white/80">
                <span>Seat fare</span>
                <span>{formatCurrency(subtotalFare)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-white/80">
                <span>Service tax ({serviceTaxPercent}%)</span>
                <span>{formatCurrency(serviceTaxAmount)}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between text-lg font-black text-white">
                <span>Total payable</span>
                <span>{formatCurrency(totalFare)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/75">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs font-semibold">
                Bookings created here also appear inside the taxi admin Airways bookings screen so operations can track seat reservations live.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !activePaymentGateway}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-[0_16px_28px_rgba(255,255,255,0.14)] disabled:opacity-60"
            >
              <FileText size={16} />
              {submitting
                ? `Processing ${activePaymentGateway?.label || 'payment'}...`
                : activePaymentGateway
                  ? `Pay ${formatCurrency(totalFare)} with ${activePaymentGateway.label}`
                  : 'Enable a payment gateway in admin'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AirwaysRouteBooking;
