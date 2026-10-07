import React, { useState } from 'react';
import {
  CalendarCheck2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Edit3,
  Plus,
  Trash2,
  User,
  Phone,
  Mail,
  Calendar,
  BedDouble,
  CreditCard,
  AlertTriangle,
  X,
  Check
} from 'lucide-react';
import { AdminReservation } from '../data/adminMockData';
import { SAMPLE_ROOMS } from '../../data/mockData';
import { supabase } from '../../lib/supabase';

interface ReservationsViewProps {
  reservations: AdminReservation[];
  onConfirm: (id: string) => void;
  onCancel: (id: string, reason: string) => void;
  onUpdatePayment: (id: string, paymentStatus: 'Paid' | 'Pending' | 'Partial' | 'Unpaid') => void;
  onUpdateReservation: (updated: AdminReservation) => void;
  onAddReservation: (newRes: AdminReservation) => void;
  onDeleteReservation: (id: string) => void;
  initialFilter?: string;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  reservations,
  onConfirm,
  onCancel,
  onUpdatePayment,
  onUpdateReservation,
  onAddReservation,
  onDeleteReservation,
  initialFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending Review' | 'Confirmed' | 'Cancelled' | 'Completed'>(
    (initialFilter as any) || 'All'
  );
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'transient' | 'dormitory'>('All');

  //PARA KUMUHA NG LIVE DATA FROM SUPABASE
  const [liveReservations, setLiveReservations] = useState<any[]>([]);

  const fetchReservations = async () => {
    const { data, error } = await supabase.from('reservations').select('*');

    if (data) {
      const formattedData = data.map((res: any) => ({
        ...res,
        // Dito natin itinutugma ang pangalan mula sa Supabase papunta sa UI mo
        reservationCode: String(res.reservation_code || ''),
        guestName: String(res.guest_name || ''),
        roomName: String(res.room_id || ''),
        email: String(res.guest_email || ''),
        phone: String(res.guest_phone || ''),
        checkIn: String(res.check_in_date || ''),
        checkOut: String(res.check_out_date || ''),
        status: String(res.status || 'Pending Review'),
        paymentStatus: 'Pending', // Default muna dahil walang payment status column
        ratePeriod: 'night',
        category: String(res.stay_type || ''),
        specialRequests: String(res.special_requests || ''),
        cancellationReason: String(res.cancellation_reason || ''),

        // Mga numero
        rate: Number(res.rate_applied) || 0,
        guests: Number(res.number_of_guests) || 1,
        totalAmount: Number(res.total_price) || 0
      }));
      setLiveReservations(formattedData);
    }
  };

  // --- LIVE UPDATE FUNCTIONS PARA SA BUTTONS ---
  const handleLiveConfirm = async (id: string) => {
    await supabase.from('reservations').update({ status: 'Confirmed' }).eq('id', id);
    fetchReservations(); // Para mag-refresh agad ang table
  };

  const handleLiveCancel = async (id: string, reason: string) => {
    await supabase.from('reservations').update({ status: 'Cancelled', cancellation_reason: reason }).eq('id', id);
    fetchReservations();
  };

  const handleLiveDelete = async (id: string) => {
    await supabase.from('reservations').delete().eq('id', id);
    fetchReservations();
  };
  // ---------------------------------------------

  React.useEffect(() => {
    fetchReservations(); // Hugutin ang data pagka-load ng page
  }, []);

  React.useEffect(() => {
    if (initialFilter) {
      setStatusFilter(initialFilter as any);
    }
  }, [initialFilter]);

  // Modals state
  const [selectedReservation, setSelectedReservation] = useState<AdminReservation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Cancellation prompt modal
  const [cancellingRes, setCancellingRes] = useState<AdminReservation | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Editing form state
  const [editFormData, setEditFormData] = useState<Partial<AdminReservation>>({});

  // New Reservation form state (aligned with index.html SAMPLE_ROOMS)
  const [newFormData, setNewFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomName: SAMPLE_ROOMS[0].name,
    roomType: SAMPLE_ROOMS[0].name,
    category: SAMPLE_ROOMS[0].category as 'transient' | 'dormitory',
    checkIn: '',
    checkOut: '',
    guests: SAMPLE_ROOMS[0].capacity,
    rate: SAMPLE_ROOMS[0].rate,
    ratePeriod: SAMPLE_ROOMS[0].ratePeriod,
    status: 'Confirmed' as 'Pending Review' | 'Confirmed',
    paymentStatus: 'Paid' as 'Paid' | 'Pending' | 'Unpaid',
    specialRequests: ''
  });

  const handleRoomSelect = (name: string) => {
    const selected = SAMPLE_ROOMS.find((r) => r.name === name) || SAMPLE_ROOMS[0];
    setNewFormData((prev) => ({
      ...prev,
      roomName: selected.name,
      roomType: selected.name,
      category: selected.category,
      rate: selected.rate,
      ratePeriod: selected.ratePeriod,
      guests: Math.min(prev.guests, selected.capacity)
    }));
  };

  // Filtered reservations, GINAWANG LIVERESERVATIONS ANG RESERVATIONS
  const filteredReservations = liveReservations.filter((r) => {
    const matchesSearch =
      r.reservationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenView = (res: AdminReservation) => {
    setSelectedReservation(res);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (res: AdminReservation) => {
    setSelectedReservation(res);
    setEditFormData({ ...res });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReservation && editFormData) {
      onUpdateReservation({
        ...selectedReservation,
        ...editFormData
      } as AdminReservation);
      setIsEditModalOpen(false);
      setSelectedReservation(null);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const checkInDate = new Date(newFormData.checkIn);
    const checkOutDate = new Date(newFormData.checkOut);
    let diffDays = 1;
    if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    const computedTotal =
      newFormData.category === 'transient'
        ? (Number(newFormData.rate) || 1500) * diffDays
        : Number(newFormData.rate) || 8000;

    const newRes: AdminReservation = {
      id: `res-${Date.now()}`,
      reservationCode: `DT-${Math.floor(100 + Math.random() * 900)}`,
      guestName: newFormData.guestName || 'Walk-in Guest',
      email: newFormData.email || 'guest@example.com',
      phone: newFormData.phone || '0917-000-0000',
      roomName: newFormData.roomName,
      roomType: newFormData.roomType,
      category: newFormData.category,
      checkIn: newFormData.checkIn || new Date().toISOString().split('T')[0],
      checkOut: newFormData.checkOut || new Date().toISOString().split('T')[0],
      guests: Number(newFormData.guests) || 2,
      rate: Number(newFormData.rate) || 1500,
      ratePeriod: newFormData.ratePeriod,
      totalAmount: computedTotal,
      status: newFormData.status,
      paymentStatus: newFormData.paymentStatus,
      specialRequests: newFormData.specialRequests,
      bookedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    onAddReservation(newRes);
    setIsAddModalOpen(false);
  };

  const handlePromptCancel = (res: AdminReservation) => {
    setCancellingRes(res);
    setCancelReason('Cancelled per guest request / room scheduling adjustment');
  };

  const handleConfirmCancelSubmit = () => {
    if (cancellingRes) {
      handleLiveCancel(cancellingRes.id, cancelReason || 'Cancelled by staff administrator');
      setCancellingRes(null);
      setCancelReason('');
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Header & New Reservation Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
            <span>Reservation Management</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-pine-900 border border-gold-300">

              {liveReservations.length} Bookings
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Review incoming transient guest requests, confirm bookings, and manage check-in dates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#fffdfa] border border-gold-200/90 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">

          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-pine-700" />
            </div>
            <input
              type="text"
              placeholder="Search by reservation code, guest name, room, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 transition-all font-medium"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['All', 'Pending Review', 'Confirmed', 'Cancelled'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${statusFilter === tab
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-pine-900 hover:bg-gold-50'
                  }`}
              >
                {tab}
                {tab === 'Pending Review' && (
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${statusFilter === tab ? 'bg-pine-950 text-gold-300' : 'bg-amber-100 text-amber-900'
                    }`}>
                    {liveReservations.filter(r => r.status === 'Pending Review').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-pine-700 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="transient">Transient Stays</option>
            <option value="dormitory">Dormitory Slots</option>
          </select>

        </div>
      </div>

      {/* Main Reservation Management Table (Section 10) */}
      <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-pine-950 border-b border-gold-200/80 bg-gold-50/60">
              <tr>
                <th className="py-3.5 px-4 font-bold">Reservation ID</th>
                <th className="py-3.5 px-4 font-bold">Guest</th>
                <th className="py-3.5 px-4 font-bold">Room</th>
                <th className="py-3.5 px-4 font-bold">Check-in</th>
                <th className="py-3.5 px-4 font-bold">Check-out</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Payment</th>
                <th className="py-3.5 px-4 font-bold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100/70">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No reservations matching current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gold-50/40 transition-colors">

                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-pine-900 whitespace-nowrap">
                      {res.reservationCode}
                    </td>

                    {/* Guest */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{res.guestName}</div>
                      <div className="text-[11px] text-slate-500">{res.phone}</div>
                    </td>

                    {/* Room */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{res.roomName}</div>
                      <div className="text-[10px] text-slate-500">{res.guests} Guests • ₱{res.rate.toLocaleString()}/{res.ratePeriod}</div>
                    </td>

                    {/* Check-in */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {res.checkIn}
                    </td>

                    {/* Check-out */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {res.checkOut}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {res.status === 'Pending Review' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-700" />
                          <span>Pending Review</span>
                        </span>
                      ) : res.status === 'Confirmed' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Confirmed</span>
                        </span>
                      ) : res.status === 'Cancelled' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5 text-rose-500" />
                          <span>Cancelled</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                          {res.status}
                        </span>
                      )}
                    </td>

                    {/* Payment Status Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={res.paymentStatus}
                        onChange={(e) => onUpdatePayment(res.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border cursor-pointer focus:outline-none bg-stone-50 ${res.paymentStatus === 'Paid'
                            ? 'text-emerald-800 border-emerald-300 bg-emerald-50/70'
                            : res.paymentStatus === 'Pending' || res.paymentStatus === 'Partial'
                              ? 'text-amber-800 border-amber-300 bg-amber-50/70'
                              : 'text-rose-800 border-rose-300 bg-rose-50/70'
                          }`}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Partial">Partial</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </td>

                    {/* Admin Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">

                        {/* Quick Approve if Pending */}
                        {res.status === 'Pending Review' && (
                          <button
                            type="button"
                            onClick={() => handleLiveConfirm(res.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                            title="Confirm reservation request"
                          >
                            <Check className="w-3 h-3" />
                            <span>Confirm</span>
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => handleOpenView(res)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-gold-100 text-slate-700 hover:text-pine-950 transition-colors cursor-pointer border border-stone-200"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-pine-700" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(res)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-gold-100 text-slate-700 hover:text-pine-950 transition-colors cursor-pointer border border-stone-200"
                          title="Edit Reservation"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-pine-700" />
                        </button>

                        {/* Cancel if active */}
                        {res.status !== 'Cancelled' ? (
                          <button
                            type="button"
                            onClick={() => handlePromptCancel(res)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
                            title="Cancel Reservation"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleLiveDelete(res.id)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border border-stone-200"
                            title="Remove Record"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. VIEW RESERVATION MODAL */}
      {isViewModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-pine-900 bg-gold-100 px-2.5 py-1 rounded border border-gold-300">
                  {selectedReservation.reservationCode}
                </span>
                <span className="text-xs uppercase font-bold text-pine-950">
                  Reservation Details
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Guest Information
                </span>
                <div className="flex items-center gap-2 text-slate-900">
                  <User className="w-3.5 h-3.5 text-pine-700" />
                  <span className="font-bold text-sm">{selectedReservation.guestName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-pine-700" />
                  <span>{selectedReservation.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-pine-700" />
                  <span>{selectedReservation.phone}</span>
                </div>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Stay Specifications
                </span>
                <div className="flex justify-between text-slate-800">
                  <span className="text-slate-500">Accommodations:</span>
                  <span className="font-bold">{selectedReservation.roomName}</span>
                </div>
                <div className="flex justify-between text-slate-800">
                  <span className="text-slate-500">Check-in:</span>
                  <span className="font-semibold">{selectedReservation.checkIn}</span>
                </div>
                <div className="flex justify-between text-slate-800">
                  <span className="text-slate-500">Check-out:</span>
                  <span className="font-semibold">{selectedReservation.checkOut}</span>
                </div>
                <div className="flex justify-between text-slate-800">
                  <span className="text-slate-500">Party Size:</span>
                  <span>{selectedReservation.guests} Guests</span>
                </div>
                <div className="flex justify-between text-slate-900 pt-1 border-t border-stone-200">
                  <span className="text-slate-500">Rate / Total:</span>
                  <span className="font-bold font-serif text-pine-900">
                    ₱{selectedReservation.rate.toLocaleString()} /{selectedReservation.ratePeriod} (Total: ₱{selectedReservation.totalAmount.toLocaleString()})
                  </span>
                </div>
              </div>

              {selectedReservation.specialRequests && (
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                    Special Requests
                  </span>
                  <p className="text-slate-800 italic">"{selectedReservation.specialRequests}"</p>
                </div>
              )}

              {selectedReservation.cancellationReason && (
                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                    Cancellation Reason
                  </span>
                  <p className="text-rose-900 italic">"{selectedReservation.cancellationReason}"</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
              {selectedReservation.status === 'Pending Review' && (
                <button
                  type="button"
                  onClick={() => {
                    handleLiveConfirm(selectedReservation.id);
                    setIsViewModalOpen(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Approve Reservation
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CANCELLATION PROMPT MODAL */}
      {cancellingRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start gap-3 text-rose-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">Cancel Reservation</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Are you sure you want to cancel booking <strong>{cancellingRes.reservationCode}</strong> for <strong>{cancellingRes.guestName}</strong>?
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-800 font-semibold block">
                Cancellation Reason / Internal Note
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setCancellingRes(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelSubmit}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. EDIT RESERVATION MODAL */}
      {isEditModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveEdit} className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-slate-900">
                Edit Reservation: {selectedReservation.reservationCode}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Guest Name</label>
                <input
                  type="text"
                  value={editFormData.guestName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, guestName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Phone</label>
                <input
                  type="text"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Check-in Date</label>
                <input
                  type="date"
                  value={editFormData.checkIn || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, checkIn: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Check-out Date</label>
                <input
                  type="date"
                  value={editFormData.checkOut || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, checkOut: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Status</label>
                <select
                  value={editFormData.status || 'Confirmed'}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Payment Status</label>
                <select
                  value={editFormData.paymentStatus || 'Paid'}
                  onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. NEW RESERVATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleCreateNew} className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-slate-900 font-serif">
                Create Walk-in / Direct Reservation
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Guest Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newFormData.guestName}
                  onChange={(e) => setNewFormData({ ...newFormData, guestName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="0917-000-0000"
                  value={newFormData.phone}
                  onChange={(e) => setNewFormData({ ...newFormData, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-700 block font-semibold">Room Option</label>
                <select
                  value={newFormData.roomName}
                  onChange={(e) => handleRoomSelect(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-medium"
                >
                  {SAMPLE_ROOMS.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} — {r.formattedRate} (Capacity: {r.capacityLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Check-in Date *</label>
                <input
                  type="date"
                  required
                  value={newFormData.checkIn}
                  onChange={(e) => setNewFormData({ ...newFormData, checkIn: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Check-out Date *</label>
                <input
                  type="date"
                  required
                  value={newFormData.checkOut}
                  onChange={(e) => setNewFormData({ ...newFormData, checkOut: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Status</label>
                <select
                  value={newFormData.status}
                  onChange={(e) => setNewFormData({ ...newFormData, status: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending Review">Pending Review</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Payment Status</label>
                <select
                  value={newFormData.paymentStatus}
                  onChange={(e) => setNewFormData({ ...newFormData, paymentStatus: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
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
                Create Reservation
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
