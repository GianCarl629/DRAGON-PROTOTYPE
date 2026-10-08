import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Star, 
  Plus, 
  Edit3, 
  X,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminCustomer } from '../data/adminMockData';

interface CustomersViewProps {}

export const CustomersView: React.FC<CustomersViewProps> = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'VIP Member' | 'Past Guest'>('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<AdminCustomer | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    accountStatus: 'Active' as AdminCustomer['accountStatus'],
    reservationCount: 1,
    latestReservation: 'Standard Room (Walk-in)',
    notes: ''
  });

  // Kunin ang customers mula sa Supabase
  const fetchCustomers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('customer_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const formatted: AdminCustomer[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email || '',
        phone: c.phone || '',
        accountStatus: c.account_status,
        reservationCount: c.reservation_count || 1,
        latestReservation: c.latest_reservation || 'Standard Room',
        memberSince: c.member_since || 'Oct 2026',
        notes: c.notes || ''
      }));
      setCustomers(formatted);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || c.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim() || 'New Guest',
      email: form.email.trim() || 'guest@example.com',
      phone: form.phone.trim() || '0917-000-0000',
      account_status: form.accountStatus,
      reservation_count: Number(form.reservationCount) || 1,
      latest_reservation: form.latestReservation,
      member_since: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      notes: form.notes
    };

    const { error } = await supabase.from('customer_records').insert([payload]);
    if (!error) {
      setIsAddModalOpen(false);
      setForm({ name: '', email: '', phone: '', accountStatus: 'Active', reservationCount: 1, latestReservation: 'Standard Room (Walk-in)', notes: '' });
      fetchCustomers();
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      const { error } = await supabase
        .from('customer_records')
        .update({
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          account_status: editingCustomer.accountStatus,
          reservation_count: editingCustomer.reservationCount,
          notes: editingCustomer.notes
        })
        .eq('id', editingCustomer.id);

      if (!error) {
        setEditingCustomer(null);
        fetchCustomers();
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
            <span>Customer & Guest Directory</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-pine-900 border border-gold-300">
              {customers.length} Registered Guests
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Guest profiles, contact info, booking frequency, loyalty VIP flags, and special preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Guest Record</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#fffdfa] border border-gold-200/90 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-pine-700" />
            </div>
            <input
              type="text"
              placeholder="Search by customer name, email address, or contact phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['All', 'Active', 'VIP Member', 'Past Guest'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-pine-900 hover:bg-gold-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-pine-950 border-b border-gold-200/80 bg-gold-50/60 font-bold">
              <tr>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Reservation Count</th>
                <th className="py-3.5 px-4">Latest Reservation</th>
                <th className="py-3.5 px-4">Member Since</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100/70">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-semibold">
                    <div className="flex justify-center items-center gap-2">
                       <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                       Loading customer records...
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gold-50/40 transition-colors">
                    
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {c.name}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {c.email}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {c.phone}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {c.accountStatus === 'VIP Member' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-gold-900 border border-gold-300 inline-flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-gold-500 text-gold-500" />
                          <span>VIP Member</span>
                        </span>
                      ) : c.accountStatus === 'Active' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                          Past Guest
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-900">
                      {c.reservationCount} {c.reservationCount === 1 ? 'Stay' : 'Stays'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                      {c.latestReservation}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {c.memberSince}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setEditingCustomer(c)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-gold-100 text-slate-700 hover:text-pine-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 border border-stone-200"
                      >
                        <Edit3 className="w-3 h-3 text-pine-700" />
                        <span>Edit</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveEdit} className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-slate-900 font-serif">
                Edit Guest: {editingCustomer.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Full Name</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Email Address</label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Phone Contact</label>
                <input
                  type="text"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Account Tier / Status</label>
                <select
                  value={editingCustomer.accountStatus}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, accountStatus: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Active">Active Guest</option>
                  <option value="VIP Member">VIP Member</option>
                  <option value="Past Guest">Past Guest</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Staff Internal Notes</label>
                <textarea
                  rows={3}
                  value={editingCustomer.notes || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                  placeholder="Preferences, floor choices..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleCreateCustomer} className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-slate-900 font-serif">
                Register New Customer
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="09123456789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Account Status</label>
                <select
                  value={form.accountStatus}
                  onChange={(e) => setForm({ ...form, accountStatus: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="VIP Member">VIP Member</option>
                  <option value="Past Guest">Past Guest</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Notes</label>
                <input
                  type="text"
                  placeholder="Preferences, corporate billing..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Guest
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};