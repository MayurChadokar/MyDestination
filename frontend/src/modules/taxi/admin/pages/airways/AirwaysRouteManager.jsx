import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Edit2, PlaneTakeoff, Plus, Route, Save, Search, Trash2 } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createAirwayRouteDraft,
  deleteAdminAirwayRoute,
  getAdminAirwayRoutes,
  getAdminAirways,
  upsertAdminAirwayRoute,
} from '../../services/airwaysService';

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-400/5';
const labelClass = 'mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400';

const AirwaysRouteManager = ({ mode: modeProp = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isCreate = modeProp === 'create' || location.pathname.endsWith('/create');
  const isEdit = modeProp === 'edit' || location.pathname.includes('/edit/');
  const isList = !isCreate && !isEdit;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [airways, setAirways] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState(createAirwayRouteDraft());

  const loadData = async () => {
    try {
      setLoading(true);
      const [airwayItems, routeItems] = await Promise.all([getAdminAirways(), getAdminAirwayRoutes()]);
      setAirways(airwayItems);
      setRoutes(routeItems);
    } catch {
      toast.error('Failed to load airway routes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isList) {
      loadData();
      return;
    }

    const loadSingle = async () => {
      try {
        setLoading(true);
        const [airwayItems, routeItems] = await Promise.all([getAdminAirways(), getAdminAirwayRoutes()]);
        setAirways(airwayItems);
        const existing = routeItems.find((item) => String(item.id) === String(id));
        setFormData(existing || createAirwayRouteDraft());
      } catch {
        toast.error('Failed to load route.');
      } finally {
        setLoading(false);
      }
    };

    loadSingle();
  }, [id, isCreate, isList]);

  const airwayMap = useMemo(
    () => new Map(airways.map((item) => [item.id, item])),
    [airways],
  );

  const filteredRoutes = useMemo(
    () =>
      routes.filter((item) =>
        [item.routeName, item.flightNumber, item.originAirport, item.destinationAirport]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()),
      ),
    [routes, searchTerm],
  );

  const setField = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const toggleDay = (day) => {
    setFormData((current) => ({
      ...current,
      operatingDays: current.operatingDays.includes(day)
        ? current.operatingDays.filter((item) => item !== day)
        : [...current.operatingDays, day],
    }));
  };

  const selectedAirway = airwayMap.get(formData.airwayId);

  useEffect(() => {
    if (!selectedAirway) return;

    setFormData((current) => ({
      ...current,
      seatInventory: (selectedAirway.seatClasses || []).reduce((acc, seatClass) => {
        acc[seatClass.cabin] = Number(current.seatInventory?.[seatClass.cabin] ?? seatClass.seatCount ?? 0);
        return acc;
      }, {}),
    }));
  }, [selectedAirway?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.airwayId || !formData.routeName.trim() || !formData.flightNumber.trim()) {
      toast.error('Airway, route name, and flight number are required.');
      return;
    }

    try {
      setSubmitting(true);
      await upsertAdminAirwayRoute({
        ...formData,
        distanceKm: Number(formData.distanceKm || 0),
        durationMinutes: Number(formData.durationMinutes || 0),
      });
      toast.success(isEdit ? 'Route updated.' : 'Route created.');
      navigate('/taxi/admin/airways/routes');
    } catch {
      toast.error('Failed to save airway route.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (routeId) => {
    if (!window.confirm('Delete this airway route?')) return;
    try {
      await deleteAdminAirwayRoute(routeId);
      toast.success('Route deleted.');
      loadData();
    } catch {
      toast.error('Failed to delete route.');
    }
  };

  if (isList) {
    return (
      <div className="min-h-screen bg-[#F3F4F9] font-sans">
        <div className="border-b border-gray-100 bg-white px-8 py-5 flex items-center justify-between">
          <h1 className="text-[14px] font-black uppercase tracking-tight text-slate-800">Airway Routes</h1>
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
            <span>Airways</span>
            <ChevronRight size={12} className="opacity-30" />
            <span className="text-gray-500">Routes</span>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-8 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Route Matrix</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Build separate airway sectors, assign flights, and manage class-wise route inventory.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search route"
                    className="h-11 rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/taxi/admin/airways/routes/create')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Add Route
                </button>
              </div>
            </div>

            <div className="grid gap-5 p-8 lg:grid-cols-2">
              {loading ? (
                <div className="text-sm font-semibold text-slate-500">Loading routes...</div>
              ) : filteredRoutes.length === 0 ? (
                <div className="text-sm font-semibold text-slate-500">No airway routes found.</div>
              ) : (
                filteredRoutes.map((item) => {
                  const airway = airwayMap.get(item.airwayId);
                  return (
                    <div key={item.id} className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{airway?.airlineName || 'Airway'}</p>
                          <h3 className="mt-1 text-lg font-black text-slate-900">{item.routeName}</h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">{item.flightNumber} | {item.originAirport} to {item.destinationAirport}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-3 text-sky-700 shadow-sm">
                          <PlaneTakeoff size={18} />
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Duration</p>
                          <p className="mt-2 text-sm font-black text-slate-900">{item.durationMinutes} mins</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Distance</p>
                          <p className="mt-2 text-sm font-black text-slate-900">{item.distanceKm} km</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Schedule</p>
                          <p className="mt-2 text-sm font-black text-slate-900">{item.departureTime} to {item.arrivalTime}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.operatingDays || []).map((day) => (
                          <span key={day} className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                            {day}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/taxi/admin/airways/routes/edit/${item.id}`)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-xl border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F9] font-sans">
      <div className="border-b border-gray-100 bg-white px-8 py-5 flex items-center justify-between">
        <h1 className="text-[14px] font-black uppercase tracking-tight text-slate-800">
          {isEdit ? 'Edit Airway Route' : 'Create Airway Route'}
        </h1>
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
          <span>Airways</span>
          <ChevronRight size={12} className="opacity-30" />
          <span className="text-gray-500">Route Form</span>
        </div>
      </div>

      <div className="p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Route size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Route Configuration</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Create separate airways routes, assign flights, and set class-specific route inventory.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Airway</label>
              <select className={inputClass} value={formData.airwayId} onChange={(event) => setField('airwayId', event.target.value)}>
                <option value="">Select airway</option>
                {airways.map((item) => (
                  <option key={item.id} value={item.id}>{item.airlineName} ({item.airlineCode})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Flight Number</label>
              <input className={inputClass} value={formData.flightNumber} onChange={(event) => setField('flightNumber', event.target.value.toUpperCase())} />
            </div>
            <div>
              <label className={labelClass}>Route Name</label>
              <input className={inputClass} value={formData.routeName} onChange={(event) => setField('routeName', event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Route Status</label>
              <select className={inputClass} value={formData.routeStatus} onChange={(event) => setField('routeStatus', event.target.value)}>
                <option value="scheduled">Scheduled</option>
                <option value="seasonal">Seasonal</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Origin Airport</label>
              <input className={inputClass} value={formData.originAirport} onChange={(event) => setField('originAirport', event.target.value.toUpperCase())} />
            </div>
            <div>
              <label className={labelClass}>Destination Airport</label>
              <input className={inputClass} value={formData.destinationAirport} onChange={(event) => setField('destinationAirport', event.target.value.toUpperCase())} />
            </div>
            <div>
              <label className={labelClass}>Departure Time</label>
              <input type="time" className={inputClass} value={formData.departureTime} onChange={(event) => setField('departureTime', event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Arrival Time</label>
              <input type="time" className={inputClass} value={formData.arrivalTime} onChange={(event) => setField('arrivalTime', event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Distance (km)</label>
              <input type="number" className={inputClass} value={formData.distanceKm} onChange={(event) => setField('distanceKm', event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Duration (mins)</label>
              <input type="number" className={inputClass} value={formData.durationMinutes} onChange={(event) => setField('durationMinutes', event.target.value)} />
            </div>
          </div>

          <div className="mt-8">
            <label className={labelClass}>Operating Days</label>
            <div className="flex flex-wrap gap-2">
              {DAY_OPTIONS.map((day) => {
                const active = formData.operatingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-wider transition ${
                      active ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedAirway ? (
            <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50/70 p-6">
              <h3 className="text-sm font-black text-slate-900">Seat Inventory Allocation</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Allocate cabin inventory for this route using the airway’s seat classes.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {selectedAirway.seatClasses.map((seatClass) => (
                  <div key={seatClass.id}>
                    <label className={labelClass}>{seatClass.cabin}</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={formData.seatInventory?.[seatClass.cabin] ?? 0}
                      onChange={(event) =>
                        setField('seatInventory', {
                          ...(formData.seatInventory || {}),
                          [seatClass.cabin]: Number(event.target.value || 0),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/taxi/admin/airways/routes')}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Save size={16} />
              {submitting ? 'Saving...' : isEdit ? 'Update Route' : 'Create Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AirwaysRouteManager;
