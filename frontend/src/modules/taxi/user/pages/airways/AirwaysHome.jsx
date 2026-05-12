import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
  ChevronRight,
  Info,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';

// Asset Imports
// import heliHeaderImg from '@/assets/airways/heli_header.png';
// import kedarnathImg from '@/assets/airways/kedarnath.png';
const heliHeaderImg = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1000';
const kedarnathImg = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000';

const CheckCircleIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

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

const AirwaysHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    travelDate: tomorrowDateValue(),
  });
  const [appliedFilters, setAppliedFilters] = useState({
    origin: '',
    destination: '',
    travelDate: '',
  });
  const [view, setView] = useState('home'); // 'home' or 'results'

  const loadRoutes = async (filters = {}) => {
    try {
      setLoading(true);
      const nextRoutes = await userService.getAirwayRoutes(filters);
      setRoutes(nextRoutes);
      if (filters.origin || filters.destination) {
        setView('results');
      }
    } catch (error) {
      console.error(error);
      toast.error('Could not load helicopter routes right now.');
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestionRoutes = async () => {
    try {
      const nextRoutes = await userService.getAirwayRoutes({ travelDate: '' });
      setAllRoutes(nextRoutes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRoutes(appliedFilters);
  }, [appliedFilters.origin, appliedFilters.destination, appliedFilters.travelDate]);

  useEffect(() => {
    loadSuggestionRoutes();
  }, []);

  const featuredSectors = useMemo(() => [
    {
      id: 'sec-1',
      name: 'Kedarnath Yatra',
      origin: 'DEHRADUN',
      destination: 'KEDARNATH',
      image: kedarnathImg,
      price: '8500',
      rating: '4.9',
    },
    {
      id: 'sec-2',
      name: 'Valley of Flowers',
      origin: 'GOVINDGHAT',
      destination: 'GHANGARIA',
      image: heliHeaderImg,
      price: '3200',
      rating: '4.8',
    },
    {
      id: 'sec-3',
      name: 'Amarnath Heli',
      origin: 'NEELGRATH',
      destination: 'PANJTARNI',
      image: kedarnathImg,
      price: '4500',
      rating: '4.7',
    },
  ], []);

  const originSuggestions = useMemo(() => {
    const query = searchForm.origin.trim().toLowerCase();
    const values = [...new Set(allRoutes.map((route) => String(route.originAirport || '').trim()).filter(Boolean))];
    if (!query) return values.slice(0, 6);
    return values.filter((value) => value.toLowerCase().includes(query)).slice(0, 6);
  }, [allRoutes, searchForm.origin]);

  const destinationSuggestions = useMemo(() => {
    const query = searchForm.destination.trim().toLowerCase();
    const values = [...new Set(allRoutes.map((route) => String(route.destinationAirport || '').trim()).filter(Boolean))];
    if (!query) return values.slice(0, 6);
    return values.filter((value) => value.toLowerCase().includes(query)).slice(0, 6);
  }, [allRoutes, searchForm.destination]);

  const getRouteAirways = (route = {}) => (
    Array.isArray(route?.airways) && route.airways.length > 0
      ? route.airways
      : route?.airway
        ? [route.airway]
        : []
  );

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
    setAppliedFilters({
      origin: '',
      destination: '',
      travelDate: '',
    });
    setView('home');
  };

  const selectSector = (sector) => {
    setSearchForm({
      origin: sector.origin,
      destination: sector.destination,
      travelDate: tomorrowDateValue(),
    });
    setAppliedFilters({
      origin: sector.origin,
      destination: sector.destination,
      travelDate: tomorrowDateValue(),
    });
  };

  const flattenedFlights = useMemo(() => {
    const list = [];
    routes.forEach((route) => {
      const airways = getRouteAirways(route);
      airways.forEach((airway) => {
        list.push({
          ...route,
          selectedAirway: airway,
          totalPrice: Number(airway.basePrice || 0) * (1 + Number(airway.serviceTaxPercent || 0) / 100),
        });
      });
    });
    return list;
  }, [routes]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans no-scrollbar">
      {/* Premium Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => view === 'results' ? setView('home') : navigate('/taxi/user')}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 active:scale-95 transition-transform"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-950 leading-none">Airways</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Premium Heli Booking</p>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <PlaneTakeoff size={20} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg">
        {/* Main Banner */}
        <div className="relative h-64 w-full overflow-hidden">
          <img src={heliHeaderImg} alt="Heli Header" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sky-400 text-[10px] font-black uppercase tracking-[0.3em]">Fly Above the Clouds</p>
              <h2 className="text-white text-3xl font-black mt-2 leading-tight">Elevate Your Journey</h2>
              <p className="text-white/70 text-sm mt-2 font-medium">Book helicopter sectors across India with live availability.</p>
            </motion.div>
          </div>
        </div>

        {/* Floating Search Card */}
        <div className="px-5 -translate-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-white/80 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">From</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />
                    <input
                      value={searchForm.origin}
                      onChange={(event) => handleChange('origin', event.target.value.toUpperCase())}
                      placeholder="Origin"
                      className="w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-black text-slate-900 outline-none placeholder:text-slate-300 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">To</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                    <input
                      value={searchForm.destination}
                      onChange={(event) => handleChange('destination', event.target.value.toUpperCase())}
                      placeholder="Destination"
                      className="w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-black text-slate-900 outline-none placeholder:text-slate-300 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Departure Date</label>
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={searchForm.travelDate}
                    onChange={(event) => handleChange('travelDate', event.target.value)}
                    className="w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/20 active:scale-[0.98] transition-transform"
              >
                <Search size={18} />
                Find Flights
              </button>
            </div>

            {/* Quick Suggestions */}
            {(originSuggestions.length > 0 || destinationSuggestions.length > 0) && (
              <div className="mt-5 pt-5 border-t border-slate-50 overflow-x-auto no-scrollbar flex gap-2">
                {[...new Set([...originSuggestions, ...destinationSuggestions])].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      if (searchForm.origin) handleChange('destination', city);
                      else handleChange('origin', city);
                    }}
                    className="whitespace-nowrap rounded-full bg-slate-50 px-4 py-2 text-[10px] font-black text-slate-600 border border-slate-100 hover:bg-white hover:border-sky-200 transition-all"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 space-y-8"
            >
              {/* Popular Sectors Section */}
              <section>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">Popular Sectors</h3>
                    <p className="text-xs font-bold text-slate-500 mt-1">Most booked helicopter routes</p>
                  </div>
                  <button className="text-sky-600 text-[11px] font-black uppercase tracking-widest">See All</button>
                </div>

                <div className="mt-5 flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {featuredSectors.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => selectSector(sector)}
                      className="min-w-[260px] relative rounded-[32px] overflow-hidden group active:scale-95 transition-transform"
                    >
                      <img src={sector.image} alt={sector.name} className="h-72 w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1 text-white text-[10px] font-black">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        {sector.rating}
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 text-white/60 text-[9px] font-black uppercase tracking-widest">
                          <span>{sector.origin}</span>
                          <ChevronRight size={10} />
                          <span>{sector.destination}</span>
                        </div>
                        <h4 className="text-white text-xl font-black mt-1">{sector.name}</h4>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-white font-black text-sm">
                            <span className="text-white/60 text-[10px] block font-medium uppercase tracking-widest">Starting from</span>
                            {formatCurrency(sector.price)}
                          </p>
                          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-950">
                            <ArrowLeft size={18} className="rotate-180" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Service Features */}
              <section className="grid grid-cols-2 gap-4">
                <div className="rounded-[28px] bg-sky-50 p-5 border border-sky-100">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-sky-600 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="mt-4 text-sm font-black text-slate-900">Safe & Secure</h4>
                  <p className="mt-1 text-[11px] font-bold text-slate-500 leading-relaxed">Certified operators and experienced pilots.</p>
                </div>
                <div className="rounded-[28px] bg-orange-50 p-5 border border-orange-100">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-orange-600 shadow-sm">
                    <Clock3 size={20} />
                  </div>
                  <h4 className="mt-4 text-sm font-black text-slate-900">Live Inventory</h4>
                  <p className="mt-1 text-[11px] font-bold text-slate-500 leading-relaxed">Real-time seat availability and instant booking.</p>
                </div>
              </section>

              {/* Why Fly Airways */}
              <section className="rounded-[32px] bg-slate-950 p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black">Why Fly with Rydon Airways?</h3>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                        <CheckCircleIcon size={14} />
                      </div>
                      <p className="text-sm font-semibold text-white/80">Save hours of mountain road travel with 15-minute heli transfers.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                        <CheckCircleIcon size={14} />
                      </div>
                      <p className="text-sm font-semibold text-white/80">Luxury cabins with panoramic views of the Himalayas.</p>
                    </div>
                  </div>
                </div>
                <Compass size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-5 space-y-6"
            >
              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    {loading ? 'Searching...' : `${flattenedFlights.length} Flights Found`}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {appliedFilters.origin} to {appliedFilters.destination} • {formatTravelDate(appliedFilters.travelDate)}
                  </p>
                </div>
                <button
                  onClick={() => setView('home')}
                  className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Flights List */}
              <div className="space-y-4">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-44 animate-pulse rounded-[32px] bg-white border border-slate-100 shadow-sm" />
                  ))
                ) : flattenedFlights.length > 0 ? (
                  flattenedFlights.map((flight, index) => (
                    <motion.div
                      key={`${flight.id}-${flight.selectedAirway.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-[32px] bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                            <PlaneTakeoff size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">
                              {flight.selectedAirway.airlineName}
                            </p>
                            <h4 className="text-lg font-black text-slate-950 mt-1">{flight.flightNumber}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Fare</p>
                          <p className="text-xl font-black text-slate-950 mt-1">{formatCurrency(flight.totalPrice)}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between py-4 border-y border-slate-50">
                        <div className="text-center flex-1">
                          <p className="text-[20px] font-black text-slate-950 leading-none">{formatTimeLabel(flight.departureTime)}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{flight.originAirport}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1 px-4">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{flight.durationMinutes}m</p>
                          <div className="flex items-center gap-1.5 w-24">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                            <div className="h-px flex-1 bg-slate-100" />
                            <PlaneTakeoff size={12} className="text-sky-500" />
                            <div className="h-px flex-1 bg-slate-100" />
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                          </div>
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Direct</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-[20px] font-black text-slate-950 leading-none">{formatTimeLabel(flight.arrivalTime)}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{flight.destinationAirport}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <Users size={14} className="text-slate-400" />
                            <span>{flight.availableSeats} Seats</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <Info size={14} className="text-slate-400" />
                            <span>Refundable</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/taxi/user/airways/routes/${flight.id}`, {
                            state: { travelDate: appliedFilters.travelDate, selectedAirwayId: flight.selectedAirway.id }
                          })}
                          className="px-6 py-3 rounded-2xl bg-sky-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-600/20 active:scale-95 transition-all"
                        >
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="h-20 w-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
                      <Compass size={40} />
                    </div>
                    <h3 className="text-lg font-black text-slate-950">No Flights Available</h3>
                    <p className="text-sm font-bold text-slate-500 max-w-[240px] mx-auto">
                      We couldn't find any flights for this route on the selected date.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 rounded-full bg-slate-950 text-white text-xs font-black uppercase tracking-widest"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


export default AirwaysHome;
