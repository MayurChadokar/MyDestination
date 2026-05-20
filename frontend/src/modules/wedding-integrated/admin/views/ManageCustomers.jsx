import React, { useState, useEffect, useRef } from 'react';
import { adminStyles } from '../theme/themeConfig';
import {
  Search, Mail, Filter, Download, MoreVertical,
  User as UserIcon, Ban, CheckCircle, Trash2, X, ChevronDown
} from 'lucide-react';
import { weddingService } from '../../../../services/weddingService';
import toast from 'react-hot-toast';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'blocked'
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Three-dot dropdown state
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const buttonRefs = useRef({});
  const filterBtnRef = useRef(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Close menus on scroll/resize
  useEffect(() => {
    const close = () => {
      setActiveDropdown(null);
      setShowFilterPanel(false);
    };
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await weddingService.getAdminCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      const targetStatus = !currentStatus;
      await weddingService.updateCustomerBlockStatus(id, targetStatus);
      toast.success(`Customer ${targetStatus ? 'blocked' : 'unblocked'} successfully`);
      fetchCustomers();
    } catch (error) {
      toast.error(error.message || 'Failed to update customer status');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer? This action cannot be undone.')) return;
    try {
      await weddingService.deleteCustomer(id);
      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete customer');
    }
  };

  const handleOpenDropdown = (e, custId) => {
    e.stopPropagation();
    if (activeDropdown === custId) {
      setActiveDropdown(null);
      return;
    }
    const btn = buttonRefs.current[custId];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setActiveDropdown(custId);
    setShowFilterPanel(false);
  };

  // ── Export CSV ────────────────────────────────────────────────
  const handleExportCSV = () => {
    const toExport = filteredCustomers;
    if (toExport.length === 0) {
      toast.error('No customers to export');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Join Date'];
    const rows = toExport.map(c => [
      `"${c.name || 'Anonymous'}"`,
      c.email || 'No email',
      c.phone || '',
      c.isBlocked ? 'Blocked' : 'Active',
      new Date(c.createdAt).toLocaleDateString(),
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${toExport.length} customers`);
  };

  // ── Filter button position ────────────────────────────────────
  const [filterPanelPos, setFilterPanelPos] = useState({ top: 0, right: 0 });
  const handleToggleFilter = (e) => {
    e.stopPropagation();
    const btn = filterBtnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setFilterPanelPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setShowFilterPanel(prev => !prev);
    setActiveDropdown(null);
  };

  // ── Filtered list ─────────────────────────────────────────────
  const filteredCustomers = customers.filter(cust => {
    const matchSearch =
      cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone?.includes(searchTerm);

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !cust.isBlocked) ||
      (statusFilter === 'blocked' && cust.isBlocked);

    return matchSearch && matchStatus;
  });

  const activeCustomer = customers.find(c => c._id === activeDropdown);

  const filterLabel = { all: 'All', active: 'Active', blocked: 'Blocked' }[statusFilter];
  const activeCount = customers.filter(c => !c.isBlocked).length;
  const blockedCount = customers.filter(c => c.isBlocked).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(353,45%,35%)]"></div>
      </div>
    );
  }

  return (
    <div
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
      onClick={() => { setActiveDropdown(null); setShowFilterPanel(false); }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-serif text-[hsl(353,45%,35%)]">Customer Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all registered couples and guests
            {statusFilter !== 'all' && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[hsl(353,45%,35%)]/10 text-[hsl(353,45%,35%)] rounded-full text-xs font-bold">
                {filterLabel}
                <button
                  onClick={(e) => { e.stopPropagation(); setStatusFilter('all'); }}
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={11} />
                </button>
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-[#B06A6C]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B06A6C]/20 w-60"
            />
          </div>

          {/* Filter Button */}
          <button
            ref={filterBtnRef}
            onClick={handleToggleFilter}
            className={`relative flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
              statusFilter !== 'all'
                ? 'border-[hsl(353,45%,35%)] bg-[hsl(353,45%,35%)]/5 text-[hsl(353,45%,35%)]'
                : 'border-[#B06A6C]/20 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            {filterLabel}
            <ChevronDown size={14} className={`transition-transform ${showFilterPanel ? 'rotate-180' : ''}`} />
            {statusFilter !== 'all' && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-[hsl(353,45%,35%)] text-white rounded-full text-[9px] flex items-center justify-center font-black">1</span>
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleExportCSV(); }}
            className="flex items-center gap-2 px-4 py-2 bg-[hsl(353,45%,35%)] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:bg-[hsl(353,45%,30%)] transition-all active:scale-95"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="flex gap-3">
        {[
          {
            label: 'Total Customers',
            count: customers.length,
            bg: 'bg-[hsl(353,45%,35%)]/10',
            text: 'text-[hsl(353,45%,35%)]',
            activeBg: 'bg-[hsl(353,45%,35%)]',
            filter: 'all',
          },
          {
            label: 'Active',
            count: activeCount,
            bg: 'bg-[hsl(353,35%,90%)]',
            text: 'text-[hsl(353,45%,35%)]',
            activeBg: 'bg-[hsl(353,45%,35%)]',
            filter: 'active',
          },
          {
            label: 'Blocked',
            count: blockedCount,
            bg: 'bg-[hsl(353,20%,85%)]',
            text: 'text-[hsl(353,45%,28%)]',
            activeBg: 'bg-[hsl(353,45%,28%)]',
            filter: 'blocked',
          },
        ].map(stat => {
          const isActive = statusFilter === stat.filter;
          return (
            <button
              key={stat.filter}
              onClick={(e) => { e.stopPropagation(); setStatusFilter(stat.filter); }}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 border-2 ${
                isActive
                  ? `${stat.activeBg} text-white border-transparent shadow-lg scale-[1.02]`
                  : `${stat.bg} ${stat.text} border-transparent hover:border-[hsl(353,45%,35%)]/30 hover:shadow-sm`
              }`}
            >
              <span className="text-2xl font-black">{stat.count}</span>
              <span className="text-xs uppercase tracking-wider font-bold opacity-90">{stat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Table Card ── */}
      <div className={`${adminStyles.glassCard} rounded-3xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[hsl(353,45%,35%)]/10 bg-[hsl(353,45%,35%)]/2">
                <th className="px-6 py-5 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Customer</th>
                <th className="px-6 py-5 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Contact Info</th>
                <th className="px-6 py-5 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Phone</th>
                <th className="px-6 py-5 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Join Date</th>
                <th className="px-6 py-5 font-bold text-gray-400 text-xs uppercase tracking-[0.1em]">Status</th>
                <th className="px-6 py-5 font-bold text-gray-400 text-xs uppercase tracking-[0.1em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(353,45%,35%)]/5">
              {filteredCustomers.length > 0 ? filteredCustomers.map((cust) => (
                <tr key={cust._id} className="group hover:bg-[hsl(353,45%,35%)]/3 transition-all duration-300">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-[hsl(353,45%,35%)]/10 flex items-center justify-center text-[hsl(353,45%,35%)] font-bold text-lg overflow-hidden shrink-0">
                        {cust.profileImage
                          ? <img src={cust.profileImage} alt="" className="h-full w-full object-cover" />
                          : cust.avatar
                            ? <img src={cust.avatar} alt="" className="h-full w-full object-cover" />
                            : (cust.name ? cust.name[0].toUpperCase() : <UserIcon size={18} />)
                        }
                      </div>
                      <div>
                        <p className="font-bold text-[hsl(353,20%,15%)] text-sm">{cust.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-400 font-mono">{cust._id.substring(0, 10)}…</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail size={13} className="text-[#B06A6C] shrink-0" />
                      {cust.email || <span className="text-gray-400 italic">No email</span>}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-600 font-medium">{cust.phone || '—'}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                    {new Date(cust.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      !cust.isBlocked
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {cust.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      ref={el => buttonRefs.current[cust._id] = el}
                      onClick={(e) => handleOpenDropdown(e, cust._id)}
                      className="p-2 text-gray-400 hover:text-[hsl(353,45%,35%)] hover:bg-[hsl(353,45%,35%)]/8 rounded-xl transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <UserIcon size={32} className="opacity-30" />
                      <p className="text-sm font-medium">No customers found</p>
                      {(searchTerm || statusFilter !== 'all') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setSearchTerm(''); setStatusFilter('all'); }}
                          className="text-xs text-[hsl(353,45%,35%)] font-bold hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-[hsl(353,45%,35%)]/8 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">
              Showing <span className="font-bold text-gray-600">{filteredCustomers.length}</span> of{' '}
              <span className="font-bold text-gray-600">{customers.length}</span> customers
            </p>
          </div>
        )}
      </div>

      {/* ── Filter Panel (fixed position) ── */}
      {showFilterPanel && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: filterPanelPos.top,
            right: filterPanelPos.right,
            zIndex: 9999,
          }}
          className="w-56 bg-white border border-[#B06A6C]/10 rounded-2xl shadow-2xl py-2 text-left"
        >
          <p className="px-4 pt-1 pb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Filter by Status</p>
          {[
            { key: 'all', label: 'All Customers', count: customers.length },
            { key: 'active', label: 'Active Only', count: activeCount },
            { key: 'blocked', label: 'Blocked Only', count: blockedCount },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => { setStatusFilter(opt.key); setShowFilterPanel(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors ${
                statusFilter === opt.key
                  ? 'bg-[hsl(353,45%,35%)]/8 text-[hsl(353,45%,35%)]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                statusFilter === opt.key ? 'bg-[hsl(353,45%,35%)] text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Three-dot Dropdown (fixed position) ── */}
      {activeDropdown && activeCustomer && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            right: dropdownPos.right,
            zIndex: 9999,
          }}
          className="w-52 bg-white border border-[#B06A6C]/10 rounded-2xl shadow-2xl py-2 text-left"
        >
          <button
            onClick={() => {
              setActiveDropdown(null);
              handleToggleBlock(activeCustomer._id, activeCustomer.isBlocked);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeCustomer.isBlocked
                ? 'text-green-600 hover:bg-green-50'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            {activeCustomer.isBlocked
              ? <><CheckCircle size={14} /> Unblock Customer</>
              : <><Ban size={14} /> Block Customer</>
            }
          </button>
          <div className="h-[1px] bg-gray-100 my-1 mx-3" />
          <button
            onClick={() => {
              setActiveDropdown(null);
              handleDeleteCustomer(activeCustomer._id);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} /> Delete Customer
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageCustomers;
