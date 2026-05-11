import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, PlaneTakeoff, Search, Ticket, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminAirwayBookings, updateAdminAirwayBookingStatus } from '../../services/airwaysService';

const statusTone = {
  confirmed: 'bg-emerald-50 text-emerald-700',
  checked_in: 'bg-sky-50 text-sky-700',
  boarding: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-rose-50 text-rose-700',
};

const AirwaysBookingManager = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setBookings(await getAdminAirwayBookings());
    } catch {
      toast.error('Failed to load airway bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((item) => {
        const matchesSearch = [
          item.customerName,
          item.bookingCode,
          item.airwayName,
          item.routeName,
          item.flightNumber,
        ]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());

        const matchesStatus = statusFilter === 'all' || item.bookingStatus === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [bookings, searchTerm, statusFilter],
  );

  const handleStatusChange = async (bookingId, nextStatus) => {
    try {
      await updateAdminAirwayBookingStatus(bookingId, nextStatus);
      toast.success('Booking status updated.');
      loadBookings();
    } catch {
      toast.error('Failed to update booking status.');
    }
  };

  const metrics = useMemo(() => {
    const revenue = filteredBookings.reduce((sum, item) => sum + Number(item.totalFare || 0), 0);
    return {
      total: filteredBookings.length,
      checkedIn: filteredBookings.filter((item) => item.bookingStatus === 'checked_in').length,
      revenue,
    };
  }, [filteredBookings]);

  return (
    <div className="min-h-screen bg-[#F3F4F9] font-sans">
      <div className="border-b border-gray-100 bg-white px-8 py-5 flex items-center justify-between">
        <h1 className="text-[14px] font-black uppercase tracking-tight text-slate-800">Airway Bookings</h1>
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
          <span>Airways</span>
          <ChevronRight size={12} className="opacity-30" />
          <span className="text-gray-500">Bookings</span>
        </div>
      </div>

      <div className="p-8 lg:p-10 space-y-6">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Bookings</p>
                <p className="mt-3 text-3xl font-black text-slate-900">{metrics.total}</p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                <Ticket size={18} />
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Checked In</p>
                <p className="mt-3 text-3xl font-black text-slate-900">{metrics.checkedIn}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <PlaneTakeoff size={18} />
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Revenue</p>
                <p className="mt-3 text-3xl font-black text-slate-900">Rs. {metrics.revenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                <Wallet size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-8 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Booking Oversight</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Monitor airway reservations, payment status, and boarding progression.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search booking"
                  className="h-11 rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="boarding">Boarding</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Booking</th>
                  <th className="px-6 py-4">Passenger</th>
                  <th className="px-6 py-4">Flight</th>
                  <th className="px-6 py-4">Travel</th>
                  <th className="px-6 py-4">Fare</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td className="px-6 py-10 text-sm font-semibold text-slate-500" colSpan={6}>Loading bookings...</td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td className="px-6 py-10 text-sm font-semibold text-slate-500" colSpan={6}>No airway bookings found.</td>
                  </tr>
                ) : (
                  filteredBookings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-5">
                        <p className="text-sm font-black text-slate-900">{item.bookingCode}</p>
                        <p className="text-xs font-semibold text-slate-500">{item.airwayName}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-black text-slate-900">{item.customerName}</p>
                        <p className="text-xs font-semibold text-slate-500">{item.seatClass} | {item.seatCount} pax</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-black text-slate-900">{item.flightNumber}</p>
                        <p className="text-xs font-semibold text-slate-500">{item.routeName}</p>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                        {new Date(item.travelDate).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-slate-900">
                        Rs. {Number(item.totalFare || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={item.bookingStatus}
                          onChange={(event) => handleStatusChange(item.id, event.target.value)}
                          className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-wider outline-none ${statusTone[item.bookingStatus] || 'bg-slate-100 text-slate-600'}`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked In</option>
                          <option value="boarding">Boarding</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
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
};

export default AirwaysBookingManager;
