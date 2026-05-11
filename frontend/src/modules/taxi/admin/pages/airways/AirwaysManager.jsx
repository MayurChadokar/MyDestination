import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Edit2, Helicopter, Phone, Plus, Save, Search, Trash2, UserRound, Users } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createAirwayDraft,
  deleteAdminAirway,
  getAdminAirways,
  upsertAdminAirway,
} from '../../services/airwaysService';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-400/5';
const labelClass = 'mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400';

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const AirwaysManager = ({ mode: modeProp = null }) => {
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
  const [formData, setFormData] = useState(createAirwayDraft());

  const loadAirways = async () => {
    try {
      setLoading(true);
      setAirways(await getAdminAirways());
    } catch {
      toast.error('Failed to load helicopters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isList) {
      loadAirways();
      return;
    }

    const loadSingle = async () => {
      try {
        setLoading(true);
        const items = await getAdminAirways();
        const existing = items.find((item) => String(item.id) === String(id));
        setFormData(existing || createAirwayDraft());
      } catch {
        toast.error('Failed to load helicopter details.');
      } finally {
        setLoading(false);
      }
    };

    if (isEdit && id) {
      loadSingle();
    } else {
      setLoading(false);
      setFormData(createAirwayDraft());
    }
  }, [id, isEdit, isList]);

  const filteredAirways = useMemo(
    () =>
      airways.filter((item) =>
        [item.airlineName, item.airlineCode, item.registrationCode, item.baseAirport, item.pilotName, item.pilotPhone]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()),
      ),
    [airways, searchTerm],
  );

  const setField = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.airlineName.trim() || !formData.airlineCode.trim()) {
      toast.error('Helicopter name and code are required.');
      return;
    }

    try {
      setSubmitting(true);
      await upsertAdminAirway({
        ...formData,
        seatCapacity: Number(formData.seatCapacity || 0),
        basePrice: Number(formData.basePrice || 0),
        serviceTaxPercent: Number(formData.serviceTaxPercent || 0),
      });
      toast.success(isEdit ? 'Helicopter updated.' : 'Helicopter created.');
      navigate('/taxi/admin/airways');
    } catch {
      toast.error('Failed to save helicopter.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (airwayId) => {
    if (!window.confirm('Delete this helicopter and all linked routes/bookings?')) return;
    try {
      await deleteAdminAirway(airwayId);
      toast.success('Helicopter deleted.');
      loadAirways();
    } catch {
      toast.error('Failed to delete helicopter.');
    }
  };

  const serviceTaxAmount = useMemo(
    () => (Number(formData.basePrice || 0) * Number(formData.serviceTaxPercent || 0)) / 100,
    [formData.basePrice, formData.serviceTaxPercent],
  );

  const totalFare = Number(formData.basePrice || 0) + serviceTaxAmount;

  if (isList) {
    return (
      <div className="min-h-screen bg-[#F3F4F9] font-sans">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-5">
          <h1 className="text-[14px] font-black uppercase tracking-tight text-slate-800">Airways</h1>
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
            <span>Transport</span>
            <ChevronRight size={12} className="opacity-30" />
            <span className="text-gray-500">Helicopters</span>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-8 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Helicopter Catalog</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Manage helicopter inventory with seat capacity, pricing, service tax, and pilot contact details.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search helicopter"
                    className="h-11 rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/taxi/admin/airways/create')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Add Helicopter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr className="text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Helicopter</th>
                    <th className="px-6 py-4">Base</th>
                    <th className="px-6 py-4">Seat Capacity</th>
                    <th className="px-6 py-4">Base Price</th>
                    <th className="px-6 py-4">Pilot</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td className="px-6 py-10 text-sm font-semibold text-slate-500" colSpan={7}>Loading helicopters...</td>
                    </tr>
                  ) : filteredAirways.length === 0 ? (
                    <tr>
                      <td className="px-6 py-10 text-sm font-semibold text-slate-500" colSpan={7}>No helicopters found.</td>
                    </tr>
                  ) : (
                    filteredAirways.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                              <Helicopter size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{item.airlineName}</p>
                              <p className="text-xs font-semibold text-slate-500">{item.airlineCode} | {item.registrationCode || '--'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-slate-600">{item.baseAirport || '--'}</td>
                        <td className="px-6 py-5 text-sm font-semibold text-slate-600">{Number(item.seatCapacity || 0)} seats</td>
                        <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                          {formatCurrency(item.basePrice)} + {Number(item.serviceTaxPercent || 0)}% tax
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-black text-slate-900">{item.pilotName || '--'}</p>
                          <p className="text-xs font-semibold text-slate-500">{item.pilotPhone || '--'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/taxi/admin/airways/edit/${item.id}`)}
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F9] font-sans">
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-5">
        <h1 className="text-[14px] font-black uppercase tracking-tight text-slate-800">
          {isEdit ? 'Edit Helicopter' : 'Add Helicopter'}
        </h1>
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
          <span>Airways</span>
          <ChevronRight size={12} className="opacity-30" />
          <span className="text-gray-500">{isEdit ? 'Edit' : 'Create'}</span>
        </div>
      </div>

      <div className="p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-8">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">Helicopter Profile</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Capture the helicopter identity, passenger capacity, pricing, and assigned pilot details.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Helicopter Name</label>
                  <input className={inputClass} value={formData.airlineName} onChange={(event) => setField('airlineName', event.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Helicopter Code</label>
                  <input className={inputClass} value={formData.airlineCode} onChange={(event) => setField('airlineCode', event.target.value.toUpperCase())} />
                </div>
                <div>
                  <label className={labelClass}>Registration Code</label>
                  <input className={inputClass} value={formData.registrationCode} onChange={(event) => setField('registrationCode', event.target.value.toUpperCase())} />
                </div>
                <div>
                  <label className={labelClass}>Base Location</label>
                  <input className={inputClass} value={formData.baseAirport} onChange={(event) => setField('baseAirport', event.target.value.toUpperCase())} />
                </div>
                <div>
                  <label className={labelClass}>Seat Capacity</label>
                  <input type="number" min="1" className={inputClass} value={formData.seatCapacity} onChange={(event) => setField('seatCapacity', event.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Base Price</label>
                  <input type="number" min="0" className={inputClass} value={formData.basePrice} onChange={(event) => setField('basePrice', event.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Service Tax %</label>
                  <input type="number" min="0" className={inputClass} value={formData.serviceTaxPercent} onChange={(event) => setField('serviceTaxPercent', event.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select className={inputClass} value={formData.status} onChange={(event) => setField('status', event.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Pilot Name</label>
                  <input className={inputClass} value={formData.pilotName} onChange={(event) => setField('pilotName', event.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Pilot Number</label>
                  <input className={inputClass} value={formData.pilotPhone} onChange={(event) => setField('pilotPhone', event.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Internal Notes</label>
                  <textarea className={`${inputClass} min-h-28`} value={formData.notes} onChange={(event) => setField('notes', event.target.value)} />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Helicopter size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black">Helicopter Snapshot</h3>
                  <p className="text-sm font-medium text-slate-300">Quick overview for seats, fare, tax, and assigned pilot.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">Seat Capacity</p>
                      <p className="mt-1 text-2xl font-black text-white">{Number(formData.seatCapacity || 0)} seats</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">Passenger Pricing</p>
                  <p className="mt-3 text-2xl font-black text-white">{formatCurrency(formData.basePrice)}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-300">
                    Service tax {Number(formData.serviceTaxPercent || 0)}% = {formatCurrency(serviceTaxAmount)}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-300">
                    Total with tax = {formatCurrency(totalFare)}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <UserRound size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-300">Pilot Details</p>
                      <p className="mt-2 text-sm font-black text-white">{formData.pilotName || 'Pilot not assigned yet'}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                        <Phone size={13} />
                        <span>{formData.pilotPhone || '--'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/taxi/admin/airways')}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Save size={16} />
              {submitting ? 'Saving...' : isEdit ? 'Update Helicopter' : 'Create Helicopter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AirwaysManager;
