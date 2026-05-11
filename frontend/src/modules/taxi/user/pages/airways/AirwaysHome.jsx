import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Compass,
  MapPin,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Ticket,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';

const tomorrowDateValue = () => {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  return next.toISOString().slice(0, 10);
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatTravelDate = (value) => {
  if (!value) return 'Pick a travel date';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Pick a travel date';
  return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const AirwaysHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    travelDate: tomorrowDateValue(),
  });
  const [appliedFilters, setAppliedFilters] = useState({
    origin: '',
    destination: '',
    travelDate: tomorrowDateValue(),
  });

  const loadRoutes = async (filters = {}) => {
    try {
      setLoading(true);
      const nextRoutes = await userService.getAirwayRoutes(filters);
      setRoutes(nextRoutes);
    } catch (error) {
      console.error(error);
      toast.error('Could not load helicopter routes right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes(appliedFilters);
  }, [appliedFilters.origin, appliedFilters.destination, appliedFilters.travelDate]);

  const featuredRoutes = useMemo(() => routes.slice(0, 3), [routes]);

  const handleChange = (key, value) => {
    setSearchForm((current) => ({ ...current, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({
      origin: searchForm.origin.trim(),
      destination: searchForm.destination.trim(),
      travelDate: searchForm.travelDate,
    });
  };

  const clearFilters = () => {
    const reset = {
      origin: '',
      destination: '',
      travelDate: tomorrowDateValue(),
    };
    setSearchForm(reset);
    setAppliedFilters(reset);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_28%,#f8fafc_62%,#ffffff_100%)] pb-24 font-sans">
      <div className="mx-auto max-w-lg px-5 pb-8 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/taxi/user')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-slate-700 shadow-sm backdrop-blur"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-700 shadow-sm backdrop-blur">
            Helicopter Booking
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_52%,#0ea5e9_100%)] p-6 text-white shadow-[0_28px_60px_rgba(14,165,233,0.24)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-sky-100/80">Airways</p>
              <h1 className="mt-2 text-[30px] font-black leading-none tracking-tight">
                Book your helicopter seat in minutes
              </h1>
              <p className="mt-3 max-w-[260px] text-[13px] font-semibold text-sky-50/85">
                Search mountain shuttles, temple transfers, and scenic heli sectors with live seat availability.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-white/15 blur-2xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10">
                <PlaneTakeoff size={28} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/50">Seat Booking</p>
              <p className="mt-2 text-sm font-black text-white">Live inventory</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/50">Route Search</p>
              <p className="mt-2 text-sm font-black text-white">Fast find</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/50">Secure Pay</p>
              <p className="mt-2 text-sm font-black text-white">Checkout ready</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-5 rounded-[30px] border border-white/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Search routes</p>
              <h2 className="mt-1 text-[20px] font-black tracking-tight text-slate-950">Find your heli sector</h2>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Compass size={18} />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">From</label>
                <input
                  value={searchForm.origin}
                  onChange={(event) => handleChange('origin', event.target.value.toUpperCase())}
                  placeholder="DEHRADUN"
                  className="mt-2 w-full bg-transparent text-sm font-black text-slate-900 outline-none placeholder:text-slate-300"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">To</label>
                <input
                  value={searchForm.destination}
                  onChange={(event) => handleChange('destination', event.target.value.toUpperCase())}
                  placeholder="KEDARNATH"
                  className="mt-2 w-full bg-transparent text-sm font-black text-slate-900 outline-none placeholder:text-slate-300"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Travel Date</label>
                <input
                  type="date"
                  value={searchForm.travelDate}
                  onChange={(event) => handleChange('travelDate', event.target.value)}
                  className="mt-2 w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(15,23,42,0.22)]"
              >
                <Search size={16} />
                Search Routes
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-black text-slate-700"
              >
                Reset
              </button>
            </div>
          </div>
        </motion.section>

        {featuredRoutes.length > 0 ? (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Highlighted sectors</p>
                <h2 className="mt-1 text-[20px] font-black tracking-tight text-slate-950">Available routes</h2>
              </div>
              <div className="rounded-full bg-white/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shadow-sm">
                {routes.length} live
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {featuredRoutes.map((route, index) => (
                <motion.button
                  key={route.id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  onClick={() => navigate(`/taxi/user/airways/routes/${route.id}`, { state: { travelDate: searchForm.travelDate } })}
                  className="block w-full rounded-[30px] border border-white/80 bg-white/90 p-5 text-left shadow-[0_18px_34px_rgba(15,23,42,0.07)] backdrop-blur transition-transform active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-600">{route.airway?.airlineName}</p>
                      <h3 className="mt-2 text-[20px] font-black tracking-tight text-slate-950">{route.routeName}</h3>
                      <p className="mt-1 text-[12px] font-bold text-slate-500">{route.flightNumber} | Pilot {route.airway?.pilotName}</p>
                    </div>
                    <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                      <PlaneTakeoff size={18} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm font-black text-slate-900">
                    <span>{route.originAirport}</span>
                    <span className="text-slate-300">to</span>
                    <span>{route.destinationAirport}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-left">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Seats</p>
                      <p className="mt-2 text-sm font-black text-slate-900">{route.availableSeats}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Duration</p>
                      <p className="mt-2 text-sm font-black text-slate-900">{route.durationMinutes} mins</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Fare</p>
                      <p className="mt-2 text-sm font-black text-slate-900">{formatCurrency(route.totalFare)}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Search results</p>
              <h2 className="mt-1 text-[20px] font-black tracking-tight text-slate-950">
                {loading ? 'Searching routes...' : `${routes.length} route${routes.length === 1 ? '' : 's'} found`}
              </h2>
            </div>
            <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
              {formatTravelDate(appliedFilters.travelDate)}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-[28px] border border-white/80 bg-white/80 shadow-sm" />
              ))
            ) : routes.length > 0 ? (
              routes.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => navigate(`/taxi/user/airways/routes/${route.id}`, { state: { travelDate: appliedFilters.travelDate } })}
                  className="block w-full rounded-[28px] border border-white/80 bg-white/95 p-5 text-left shadow-[0_16px_32px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{route.airway?.airlineCode} | {route.flightNumber}</p>
                      <h3 className="mt-2 text-[18px] font-black text-slate-950">{route.originAirport} to {route.destinationAirport}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{route.routeName}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-center text-emerald-700">
                      <p className="text-[9px] font-black uppercase tracking-[0.18em]">Open</p>
                      <p className="mt-1 text-sm font-black">{route.availableSeats}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-black text-slate-700">
                      <Clock3 size={12} />
                      {route.departureTime} to {route.arrivalTime}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-black text-slate-700">
                      <MapPin size={12} />
                      {route.distanceKm} km
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-black text-slate-700">
                      <Users size={12} />
                      {route.availableSeats} seats left
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Price per seat</p>
                      <p className="mt-1 text-lg font-black text-slate-950">{formatCurrency(route.totalFare)}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white">
                      <Ticket size={14} />
                      Book Seat
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[30px] border border-dashed border-slate-200 bg-white/90 p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">No helicopter routes matched</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Try another date or route pair to see the next available helicopter sector.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AirwaysHome;
