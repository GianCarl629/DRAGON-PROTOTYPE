import React from 'react';
import { 
  CalendarCheck2, 
  Clock, 
  BedDouble, 
  Building2, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  User, 
  Sparkles, 
  ArrowRight,
  Receipt
} from 'lucide-react';
import { AdminStoreState } from '../data/adminMockData';

interface DashboardViewProps {
  store: AdminStoreState;
  onNavigateTab: (tab: string) => void;
  onConfirmReservation: (id: string) => void;
  onCancelReservation: (id: string, reason: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  store,
  onNavigateTab,
  onConfirmReservation,
  onCancelReservation
}) => {
  const totalReservations = store.reservations.length;
  const pendingReservations = store.reservations.filter(r => r.status === 'Pending Review');
  const confirmedReservations = store.reservations.filter(r => r.status === 'Confirmed');
  
  const availableRooms = store.rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = store.rooms.filter(r => r.status === 'Occupied' || r.status === 'Reserved').length;
  
  const totalBeds = store.dormSlots.length;
  const occupiedBeds = store.dormSlots.filter(s => s.status === 'Occupied' || s.status === 'Reserved').length;

  const monthlyRevenue = 84500; // Demo specification value
  const pendingPayments = store.billing
    .filter(b => b.paymentStatus === 'Pending' || b.paymentStatus === 'Overdue')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Notification Bar */}
      <div className="p-6 rounded-3xl bg-[#fffdfa] border-2 border-gold-300/80 shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-pine-950">
              Dragon Treasure Administration
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-gold-900 border border-gold-300 uppercase tracking-wider">
              Baguio Front Desk
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-xl">
            Welcome to the internal property management dashboard. Monitor transient room reservations, long-term dormitory beds, billing settlements, and guest concierge inquiries.
          </p>
        </div>

        {/* Quick Review Alert if Pending Requests Exist */}
        {pendingReservations.length > 0 && (
          <button
            type="button"
            onClick={() => onNavigateTab('reservations')}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Clock className="w-4 h-4 text-amber-700" />
            <span>{pendingReservations.length} Pending Review Requests</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          </button>
        )}
      </div>

      {/* 6 Core Summary KPI Cards (Section 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Today's Reservations */}
        <div className="p-5 rounded-2xl bg-[#fffdfa] border border-gold-200/90 hover:border-gold-400 transition-all shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pine-950 uppercase tracking-wider">
              Today's Reservations
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-pine-900 flex items-center justify-center border border-gold-300">
              <CalendarCheck2 className="w-4 h-4 text-pine-700" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-serif text-pine-950">8</span>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +2 from yesterday
            </span>
          </div>
          <div className="pt-2 border-t border-gold-100 text-[11px] text-slate-600 flex justify-between">
            <span>Confirmed: <strong>{confirmedReservations.length}</strong></span>
            <span>Total records: <strong>{totalReservations}</strong></span>
          </div>
        </div>

        {/* 2. Pending Reservations */}
        <div className="p-5 rounded-2xl bg-[#fffdfa] border border-amber-300/80 hover:border-amber-400 transition-all shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Pending Reservations
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-serif text-amber-800">
              {pendingReservations.length > 0 ? pendingReservations.length : 5}
            </span>
            <span className="text-[11px] text-amber-800 font-semibold">Awaiting staff review</span>
          </div>
          <div className="pt-2 border-t border-amber-100 text-[11px] text-slate-600 flex justify-between">
            <span>Needs room availability check</span>
            <button
              onClick={() => onNavigateTab('reservations')}
              className="text-pine-800 hover:text-gold-700 font-bold underline"
            >
              Review now →
            </button>
          </div>
        </div>

        {/* 3. Available Rooms */}
        <div className="p-5 rounded-2xl bg-[#fffdfa] border border-emerald-300/80 hover:border-emerald-400 transition-all shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Available Rooms
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center border border-emerald-300">
              <BedDouble className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-serif text-emerald-800">
              {availableRooms || 12}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">Ready for check-in</span>
          </div>
          <div className="pt-2 border-t border-emerald-100 text-[11px] text-slate-600 flex justify-between">
            <span>Total Units: {store.rooms.length}</span>
            <span className="text-emerald-700 font-bold">Cleaned & Inspected</span>
          </div>
        </div>

        {/* 4. Occupied Rooms */}
        <div className="p-5 rounded-2xl bg-[#fffdfa] border border-gold-200/90 hover:border-gold-400 transition-all shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pine-950 uppercase tracking-wider">
              Occupied Rooms
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-pine-900 flex items-center justify-center border border-gold-300">
              <Building2 className="w-4 h-4 text-pine-700" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-serif text-pine-950">
              {occupiedRooms || 18}
            </span>
            <span className="text-[11px] text-pine-800 font-bold">68% Occupancy</span>
          </div>
          <div className="pt-2 border-t border-gold-100 text-[11px] text-slate-600 flex justify-between">
            <span>Dorm Beds Occupied: {occupiedBeds}/{totalBeds}</span>
            <span>Check-outs today: 2</span>
          </div>
        </div>

        {/* 5. Monthly Revenue */}
        <div className="p-5 rounded-2xl bg-[#fffdfa] border border-gold-300/90 hover:border-gold-400 transition-all shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-950 uppercase tracking-wider">
              Monthly Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-900 flex items-center justify-center border border-gold-300">
              <TrendingUp className="w-4 h-4 text-gold-700" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-serif text-gold-700">
              ₱{monthlyRevenue.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">+14.2% YoY</span>
          </div>
          <div className="pt-2 border-t border-gold-100 text-[11px] text-slate-600 flex justify-between">
            <span>Transient: ₱52,000</span>
            <span>Dorm: ₱32,500</span>
          </div>
        </div>

        {/* 6. Pending Payments */}
        <div className="p-5 rounded-2xl bg-[#fffdfa] border border-rose-300/80 hover:border-rose-400 transition-all shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-950 uppercase tracking-wider">
              Pending Payments
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-900 flex items-center justify-center border border-rose-300">
              <CreditCard className="w-4 h-4 text-rose-700" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-serif text-rose-800">
              ₱{(pendingPayments || 12300).toLocaleString()}
            </span>
            <span className="text-[11px] text-rose-700 font-medium">Due this week</span>
          </div>
          <div className="pt-2 border-t border-rose-100 text-[11px] text-slate-600 flex justify-between">
            <span>Unsettled invoices: {store.billing.filter(b => b.paymentStatus !== 'Paid').length}</span>
            <button
              onClick={() => onNavigateTab('billing')}
              className="text-rose-800 hover:text-rose-950 font-bold underline"
            >
              View billing →
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Pending Review Queue & Quick Operational Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Recent Reservations Queue */}
        <div className="lg:col-span-2 bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-gold-200/70">
            <div>
              <h3 className="font-serif font-bold text-lg text-pine-950 flex items-center gap-2">
                <span>Recent Reservation Requests</span>
                <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-gold-100 text-pine-900 border border-gold-300">
                  {store.reservations.length} total
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Latest customer submissions awaiting review or confirmed for check-in.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => onNavigateTab('reservations')}
              className="text-xs font-bold text-pine-800 hover:text-gold-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-pine-950 border-b border-gold-200/80 bg-gold-50/50">
                <tr>
                  <th className="py-2.5 px-3">Code / ID</th>
                  <th className="py-2.5 px-3">Guest Name</th>
                  <th className="py-2.5 px-3">Room / Stay</th>
                  <th className="py-2.5 px-3">Dates</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-100/70">
                {store.reservations.slice(0, 5).map((res) => (
                  <tr key={res.id} className="hover:bg-gold-50/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-pine-900 whitespace-nowrap">
                      {res.reservationCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{res.guestName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[120px]">{res.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div className="font-medium truncate max-w-[140px]">{res.roomName}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{res.category}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                      {res.checkIn} → {res.checkOut}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {res.status === 'Pending Review' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-700" />
                          <span>Pending</span>
                        </span>
                      ) : res.status === 'Confirmed' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Confirmed</span>
                        </span>
                      ) : res.status === 'Cancelled' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5 text-rose-500" />
                          <span>Cancelled</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                          {res.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {res.status === 'Pending Review' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onConfirmReservation(res.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                            title="Confirm reservation request"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelReservation(res.id, 'Declined by staff due to room unavailability')}
                            className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                            title="Decline reservation request"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigateTab('reservations')}
                          className="text-[11px] text-pine-800 hover:text-gold-700 font-bold hover:underline"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (1 col): Quick Operations & Room Occupancy Breakdown */}
        <div className="space-y-4">
          
          {/* Quick Shortcuts */}
          <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 space-y-3 shadow-card">
            <h3 className="font-serif font-bold text-sm text-pine-950 uppercase tracking-wider">
              Admin Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigateTab('reservations')}
                className="p-3 rounded-2xl bg-stone-50 hover:bg-gold-50/80 text-pine-950 border border-gold-200/70 hover:border-gold-400 text-left transition-all cursor-pointer flex flex-col gap-1 shadow-2xs"
              >
                <CalendarCheck2 className="w-4 h-4 text-pine-700" />
                <span className="font-bold">Reservations</span>
                <span className="text-[10px] text-slate-500">View & approve</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('rooms')}
                className="p-3 rounded-2xl bg-stone-50 hover:bg-gold-50/80 text-pine-950 border border-gold-200/70 hover:border-gold-400 text-left transition-all cursor-pointer flex flex-col gap-1 shadow-2xs"
              >
                <BedDouble className="w-4 h-4 text-pine-700" />
                <span className="font-bold">Room Inventory</span>
                <span className="text-[10px] text-slate-500">Status & rates</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('dormitory')}
                className="p-3 rounded-2xl bg-stone-50 hover:bg-gold-50/80 text-pine-950 border border-gold-200/70 hover:border-gold-400 text-left transition-all cursor-pointer flex flex-col gap-1 shadow-2xs"
              >
                <Building2 className="w-4 h-4 text-pine-700" />
                <span className="font-bold">Dormitory Beds</span>
                <span className="text-[10px] text-slate-500">Monthly tenants</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('billing')}
                className="p-3 rounded-2xl bg-stone-50 hover:bg-gold-50/80 text-pine-950 border border-gold-200/70 hover:border-gold-400 text-left transition-all cursor-pointer flex flex-col gap-1 shadow-2xs"
              >
                <Receipt className="w-4 h-4 text-pine-700" />
                <span className="font-bold">Billing Records</span>
                <span className="text-[10px] text-slate-500">Rent & utilities</span>
              </button>
            </div>
          </div>

          {/* Room Allocation Status Mini Breakdown */}
          <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 space-y-3 text-xs shadow-card">
            <h3 className="font-serif font-bold text-sm text-pine-950 uppercase tracking-wider">
              Room Occupancy Status
            </h3>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Available for Walk-ins/Booking</span>
                </span>
                <span className="font-bold font-mono text-pine-900">{availableRooms} Units</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${(availableRooms / store.rooms.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500" />
                  <span>Occupied / In-House Guests</span>
                </span>
                <span className="font-bold font-mono text-pine-900">{occupiedRooms} Units</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <div 
                  className="bg-gold-500 h-full rounded-full" 
                  style={{ width: `${(occupiedRooms / store.rooms.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Maintenance / Deep Cleaning</span>
                </span>
                <span className="font-bold font-mono text-pine-900">
                  {store.rooms.filter(r => r.status === 'Maintenance').length} Units
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <div 
                  className="bg-amber-500 h-full rounded-full" 
                  style={{ width: `${(store.rooms.filter(r => r.status === 'Maintenance').length / store.rooms.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gold-200/70 flex items-center justify-between text-slate-500 text-[11px]">
              <span>Front Desk Caretaker: 24/7 On-Duty</span>
              <span className="text-emerald-700 font-bold">Shift Active</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
