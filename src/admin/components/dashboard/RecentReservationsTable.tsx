import React, { useState } from 'react';
import { 
  CalendarCheck2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Check, 
  X, 
  ArrowRight,
  Search,
  Filter,
  CreditCard,
  User,
  Phone,
  Mail,
  Calendar,
  BedDouble
} from 'lucide-react';
import { AdminReservation } from '../../data/adminMockData';

interface RecentReservationsTableProps {
  reservations: AdminReservation[];
  onConfirm: (id: string) => void;
  onCancel: (id: string, reason: string) => void;
  onNavigateAll: (filter?: string) => void;
}

export const RecentReservationsTable: React.FC<RecentReservationsTableProps> = ({
  reservations,
  onConfirm,
  onCancel,
  onNavigateAll
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending Review' | 'Confirmed' | 'Cancelled' | 'Completed'>('All');
  const [selectedRes, setSelectedRes] = useState<AdminReservation | null>(null);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [targetDeclineId, setTargetDeclineId] = useState<string | null>(null);

  const filteredReservations = reservations.filter((res) => {
    const matchesQuery = 
      res.reservationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.roomName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleOpenDeclineModal = (id: string) => {
    setTargetDeclineId(id);
    setDeclineReason('Room capacity or maintenance conflict');
    setIsDeclineModalOpen(true);
  };

  const handleConfirmDecline = () => {
    if (targetDeclineId) {
      onCancel(targetDeclineId, declineReason || 'Declined by administrator');
      setIsDeclineModalOpen(false);
      setTargetDeclineId(null);
      if (selectedRes?.id === targetDeclineId) {
        setSelectedRes(null);
      }
    }
  };

  const renderStatusBadge = (status: AdminReservation['status']) => {
    switch (status) {
      case 'Pending Review':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>Pending</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Confirmed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 inline-flex items-center gap-1">
            <span>Completed</span>
          </span>
        );
    }
  };

  const renderPaymentBadge = (status: AdminReservation['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Paid
          </span>
        );
      case 'Partial':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            Partial
          </span>
        );
      case 'Pending':
      case 'Unpaid':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Unpaid
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-50 text-stone-700 border border-stone-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      {/* Header with Title and Search/Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-gold-200/70">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
              Recent Reservations
            </h3>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-pine-900 border border-gold-300">
              {filteredReservations.length} of {reservations.length}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monitor incoming bookings, review guest stays, and inspect payment settlements
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, guest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Quick status filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-[11px]">
            {(['All', 'Pending Review', 'Confirmed', 'Cancelled'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-pine-950 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'Pending Review' ? 'Pending' : status}
              </button>
            ))}
          </div>

          {/* View Master Tab */}
          <button
            type="button"
            onClick={() => onNavigateAll()}
            className="px-3 py-1.5 rounded-xl bg-gold-50 hover:bg-gold-100 text-pine-900 border border-gold-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>All Records</span>
            <ArrowRight className="w-3 h-3 text-pine-800" />
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto rounded-2xl border border-gold-200/70">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="text-[10px] uppercase font-bold tracking-wider text-pine-950 bg-gold-100/60 border-b border-gold-200">
            <tr>
              <th className="py-3 px-3.5">ID / Code</th>
              <th className="py-3 px-3.5">Guest</th>
              <th className="py-3 px-3.5">Room</th>
              <th className="py-3 px-3.5">Check-In</th>
              <th className="py-3 px-3.5">Check-Out</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5">Payment</th>
              <th className="py-3 px-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-100/80 bg-white">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No reservations matching your filter.
                </td>
              </tr>
            ) : (
              filteredReservations.slice(0, 6).map((res) => (
                <tr 
                  key={res.id} 
                  className="hover:bg-gold-50/40 transition-colors cursor-pointer group"
                  onClick={() => setSelectedRes(res)}
                >
                  {/* ID */}
                  <td className="py-3 px-3.5 font-mono font-bold text-pine-900 whitespace-nowrap">
                    {res.reservationCode}
                  </td>

                  {/* Guest */}
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-slate-900 group-hover:text-pine-900 transition-colors">
                      {res.guestName}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {res.phone}
                    </div>
                  </td>

                  {/* Room */}
                  <td className="py-3 px-3.5">
                    <div className="font-medium text-slate-800 truncate max-w-[140px]">
                      {res.roomName}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {res.category} • {res.guests} pax
                    </div>
                  </td>

                  {/* Check-in */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-700 font-medium">
                    {res.checkIn}
                  </td>

                  {/* Check-out */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-700 font-medium">
                    {res.checkOut}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    {renderStatusBadge(res.status)}
                  </td>

                  {/* Payment */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {renderPaymentBadge(res.paymentStatus)}
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        ₱{res.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td 
                    className="py-3 px-3.5 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {res.status === 'Pending Review' ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onConfirm(res.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1"
                          title="Confirm and accept booking"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeclineModal(res.id)}
                          className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                          title="Decline request"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedRes(res)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-pine-900 border border-stone-300 rounded-lg text-[11px] font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-pine-700" />
                        <span>View</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Details Modal */}
      {selectedRes && (
        <div 
          className="fixed inset-0 z-50 bg-pine-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedRes(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#fffdfa] rounded-3xl border-2 border-gold-300 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gold-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center text-pine-900 font-bold font-mono">
                  {selectedRes.reservationCode}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-pine-950">
                    Reservation Details
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Booked on {selectedRes.bookedAt || 'Recently'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRes(null)}
                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Guest Information</span>
                <div className="font-bold text-slate-900">{selectedRes.guestName}</div>
                <div className="text-[11px] text-slate-600">{selectedRes.phone}</div>
                <div className="text-[11px] text-slate-600 truncate">{selectedRes.email}</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Room & Capacity</span>
                <div className="font-bold text-pine-950">{selectedRes.roomName}</div>
                <div className="text-[11px] text-slate-600 capitalize">{selectedRes.category} Stays</div>
                <div className="text-[11px] text-slate-600">{selectedRes.guests} Guest(s)</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Stay Duration</span>
                <div className="font-bold text-slate-900">{selectedRes.checkIn} → {selectedRes.checkOut}</div>
                <div className="text-[11px] text-slate-500">Nightly Rate: ₱{selectedRes.rate.toLocaleString()}</div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Billing & Payment</span>
                <div className="font-bold text-emerald-800 text-sm">₱{selectedRes.totalAmount.toLocaleString()}</div>
                <div className="text-[11px] font-bold text-slate-700">Status: {selectedRes.paymentStatus}</div>
              </div>
            </div>

            {selectedRes.specialRequests && (
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
                <span className="font-bold text-amber-950 block mb-1">Guest Special Request:</span>
                <p className="text-amber-900 text-[11px] italic">"{selectedRes.specialRequests}"</p>
              </div>
            )}

            <div className="pt-3 border-t border-gold-200 flex items-center justify-between">
              {selectedRes.status === 'Pending Review' ? (
                <div className="flex items-center gap-2 w-full justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onConfirm(selectedRes.id);
                      setSelectedRes(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Reservation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDeclineModal(selectedRes.id)}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedRes(null)}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close Window
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 z-50 bg-pine-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#fffdfa] rounded-3xl border-2 border-rose-300 p-5 space-y-4 shadow-xl">
            <h4 className="font-serif font-bold text-base text-rose-950">
              Decline Reservation Request
            </h4>
            <p className="text-xs text-slate-600">
              Please specify the cancellation reason for front desk records:
            </p>
            <input
              type="text"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:outline-none focus:border-rose-500"
              placeholder="e.g. Fully booked on selected dates"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
