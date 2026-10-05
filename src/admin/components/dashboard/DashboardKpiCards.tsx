import React from 'react';
import { 
  CalendarCheck2, 
  BedDouble, 
  Clock, 
  TrendingUp, 
  DoorOpen, 
  CreditCard,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { DashboardMetrics } from '../../data/adminAnalytics';

interface DashboardKpiCardsProps {
  metrics: DashboardMetrics;
  onNavigateTab: (tab: string, filter?: string) => void;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({
  metrics,
  onNavigateTab
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      
      {/* 1. Today's Reservations */}
      <div 
        onClick={() => onNavigateTab('reservations')}
        className="p-4 sm:p-5 rounded-3xl bg-[#fffdfa] border border-gold-200/90 hover:border-gold-400 hover:shadow-md transition-all cursor-pointer shadow-card space-y-2.5 flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-pine-950 uppercase tracking-wider">
            Today's Bookings
          </span>
          <div className="w-8 h-8 rounded-xl bg-gold-100 text-pine-900 flex items-center justify-center border border-gold-300 group-hover:scale-105 transition-transform">
            <CalendarCheck2 className="w-4 h-4 text-pine-700" />
          </div>
        </div>

        <div>
          <div className="text-3xl font-serif font-bold text-pine-950">
            {metrics.todayReservationsCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.todayReservationsChangePct}% vs yesterday</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gold-100 text-[10px] text-slate-500 flex justify-between">
          <span>Arrivals: <strong>{metrics.todayArrivalsCount}</strong></span>
          <span>Departures: <strong>{metrics.todayDeparturesCount}</strong></span>
        </div>
      </div>

      {/* 2. Current Occupancy */}
      <div 
        onClick={() => onNavigateTab('rooms')}
        className="p-4 sm:p-5 rounded-3xl bg-[#fffdfa] border border-gold-200/90 hover:border-gold-400 hover:shadow-md transition-all cursor-pointer shadow-card space-y-2.5 flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-pine-950 uppercase tracking-wider">
            Current Occupancy
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center border border-emerald-300 group-hover:scale-105 transition-transform">
            <BedDouble className="w-4 h-4 text-emerald-700" />
          </div>
        </div>

        <div>
          <div className="text-3xl font-serif font-bold text-emerald-800">
            {metrics.occupancyRatePct}%
          </div>
          <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
            {metrics.occupiedRooms} / {metrics.totalRooms} rooms occupied
          </div>
        </div>

        <div className="pt-2 border-t border-gold-100 space-y-1">
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.occupancyRatePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Pending Reservations (HIGH VISIBILITY ACTION ITEM) */}
      <div 
        onClick={() => onNavigateTab('reservations', 'Pending Review')}
        className="p-4 sm:p-5 rounded-3xl bg-amber-50/60 border-2 border-amber-400 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer shadow-card space-y-2.5 flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending Review</span>
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center border border-amber-400 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 text-amber-800" />
          </div>
        </div>

        <div>
          <div className="text-3xl font-serif font-bold text-amber-900">
            {metrics.pendingReservationsCount}
          </div>
          <div className="text-[11px] text-amber-800 font-bold mt-0.5">
            Awaiting front desk approval
          </div>
        </div>

        <div className="pt-2 border-t border-amber-200 text-[10px] text-amber-900 font-bold flex justify-between items-center">
          <span>Action Required</span>
          <span className="underline group-hover:text-amber-950">Review now →</span>
        </div>
      </div>

      {/* 4. Revenue */}
      <div 
        onClick={() => onNavigateTab('billing')}
        className="p-4 sm:p-5 rounded-3xl bg-[#fffdfa] border border-gold-200/90 hover:border-gold-400 hover:shadow-md transition-all cursor-pointer shadow-card space-y-2.5 flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gold-950 uppercase tracking-wider">
            Total Revenue
          </span>
          <div className="w-8 h-8 rounded-xl bg-gold-100 text-gold-900 flex items-center justify-center border border-gold-300 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4 text-gold-800" />
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-pine-950 truncate">
            ₱{metrics.totalRevenuePeriod.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{metrics.revenueChangePct}% vs last period</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gold-100 text-[10px] text-slate-500 flex justify-between">
          <span>Settled: <strong>{metrics.paidInvoicesCount} invoices</strong></span>
          <span className="text-gold-700 font-bold">Ledger live</span>
        </div>
      </div>

      {/* 5. Available Rooms */}
      <div 
        onClick={() => onNavigateTab('rooms', 'Available')}
        className="p-4 sm:p-5 rounded-3xl bg-[#fffdfa] border border-gold-200/90 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer shadow-card space-y-2.5 flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
            Available Rooms
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
            <DoorOpen className="w-4 h-4 text-emerald-700" />
          </div>
        </div>

        <div>
          <div className="text-3xl font-serif font-bold text-emerald-800">
            {metrics.availableRooms} <span className="text-sm font-sans font-normal text-slate-400">/ {metrics.totalRooms}</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            Ready for immediate check-in
          </div>
        </div>

        <div className="pt-2 border-t border-gold-100 text-[10px] text-slate-500 flex justify-between items-center">
          <span>Cleaned & inspected</span>
          <span className="text-emerald-700 font-bold group-hover:underline">Filter →</span>
        </div>
      </div>

      {/* 6. Outstanding Payments */}
      <div 
        onClick={() => onNavigateTab('billing', 'Pending')}
        className="p-4 sm:p-5 rounded-3xl bg-[#fffdfa] border border-rose-200/90 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer shadow-card space-y-2.5 flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-rose-950 uppercase tracking-wider">
            Outstanding Due
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center border border-rose-300 group-hover:scale-105 transition-transform">
            <CreditCard className="w-4 h-4 text-rose-700" />
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-800 truncate">
            ₱{metrics.outstandingPaymentsAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
            {metrics.outstandingPaymentsCount} unsettled invoice{metrics.outstandingPaymentsCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="pt-2 border-t border-rose-100 text-[10px] text-rose-800 font-bold flex justify-between items-center">
          <span>Pending or overdue</span>
          <span className="underline group-hover:text-rose-950">Settle →</span>
        </div>
      </div>

    </div>
  );
};
