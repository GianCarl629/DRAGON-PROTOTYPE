import React, { useState } from 'react';
import { 
  Calendar, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Building,
  Layers,
  Clock
} from 'lucide-react';
import { AdminStoreState } from '../data/adminMockData';
import { 
  calculateDashboardMetrics, 
  getAttentionItems, 
  getRecentActivities,
  getRevenueTimeline,
  getOccupancyTimeline,
  getReservationStatusCounts,
  getRoomStatusCounts,
  getRoomTypePerformance,
  getRevenueBreakdown,
  TimePeriod 
} from '../data/adminAnalytics';

import { DashboardKpiCards } from '../components/dashboard/DashboardKpiCards';
import { RequiresAttentionBanner } from '../components/dashboard/RequiresAttentionBanner';
import { RevenueTrendChart } from '../components/charts/RevenueTrendChart';
import { ReservationStatusDonut } from '../components/charts/ReservationStatusDonut';
import { OccupancyTrendChart } from '../components/charts/OccupancyTrendChart';
import { RoomStatusDistribution } from '../components/charts/RoomStatusDistribution';
import { RoomTypePerformanceChart } from '../components/charts/RoomTypePerformanceChart';
import { DormitoryOccupancyChart } from '../components/charts/DormitoryOccupancyChart';
import { RevenueBreakdownCard } from '../components/charts/RevenueBreakdownCard';
import { TodaysOperationsSchedule } from '../components/dashboard/TodaysOperationsSchedule';
import { RecentReservationsTable } from '../components/dashboard/RecentReservationsTable';
import { RecentActivityTimeline } from '../components/dashboard/RecentActivityTimeline';

interface DashboardViewProps {
  store: AdminStoreState;
  onNavigateTab: (tab: string, filter?: string) => void;
  onConfirmReservation: (id: string) => void;
  onCancelReservation: (id: string, reason: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  store,
  onNavigateTab,
  onConfirmReservation,
  onCancelReservation
}) => {
  // Global Period Filter: 7d | 30d | 3m | 12m (Section 17)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');

  // Centralized calculations (Section 27)
  const metrics = calculateDashboardMetrics(store, selectedPeriod);
  const attentionItems = getAttentionItems(store);
  const recentActivities = getRecentActivities(store);

  const revenueData = getRevenueTimeline(store, selectedPeriod);
  const occupancyData = getOccupancyTimeline(store, selectedPeriod);
  const reservationStatusData = getReservationStatusCounts(store.reservations);
  const roomStatusData = getRoomStatusCounts(store.rooms);
  const roomTypePerformanceData = getRoomTypePerformance(store.reservations, store.rooms);
  const revenueBreakdownData = getRevenueBreakdown(store.billing);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Controls Bar: Welcome Headline & Global Time Filter (Section 17) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#fffdfa] border border-gold-200/90 shadow-luxury">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-pine-950">
              Operations Overview
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-pine-900 border border-gold-300 uppercase tracking-wider">
              Live Monitor
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Real-time occupancy, guest turnover, reservations review, and financial metrics for Dragon Treasure.
          </p>
        </div>

        {/* Global Date Filter Controls (Section 17) */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200/90 w-full sm:w-auto overflow-x-auto justify-between sm:justify-start">
          {(['7d', '30d', '3m', '12m'] as const).map((p) => {
            const shortLabels: Record<TimePeriod, string> = {
              '7d': '7D',
              '30d': '30D',
              '3m': '3M',
              '12m': '12M'
            };
            const labels: Record<TimePeriod, string> = {
              '7d': 'Past 7 Days',
              '30d': 'Past 30 Days',
              '3m': 'Quarter (3M)',
              '12m': 'Annual (12M)'
            };

            const isSelected = selectedPeriod === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPeriod(p)}
                className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-pine-950 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-200/60'
                }`}
              >
                <span className="sm:hidden">{shortLabels[p]}</span>
                <span className="hidden sm:inline">{labels[p]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority 1: Requires Attention Banner (Section 13 & Priority 1) */}
      <RequiresAttentionBanner
        items={attentionItems}
        onNavigate={onNavigateTab}
      />

      {/* Priority 2 & 3: 6 Core Summary KPI Cards (Section 5) */}
      <DashboardKpiCards
        metrics={metrics}
        onNavigateTab={onNavigateTab}
      />

      {/* Primary Analytics Section: Revenue Trend & Reservation Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart (2 cols) */}
        <div className="lg:col-span-2">
          <RevenueTrendChart
            data={revenueData}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            totalRevenue={metrics.totalRevenuePeriod}
          />
        </div>

        {/* Reservation Status Donut (1 col) */}
        <div className="lg:col-span-1">
          <ReservationStatusDonut
            data={reservationStatusData}
            totalCount={store.reservations.length}
            onFilterStatus={(status) => onNavigateTab('reservations', status)}
          />
        </div>
      </div>

      {/* Secondary Analytics Section: Occupancy Trend & Room Availability Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Trend Chart */}
        <OccupancyTrendChart
          data={occupancyData}
          currentOccupancyPct={metrics.occupancyRatePct}
        />

        {/* Room Inventory Availability & Floor Matrix */}
        <RoomStatusDistribution
          rooms={store.rooms}
          statusData={roomStatusData}
          onNavigateToRooms={(statusFilter) => onNavigateTab('rooms', statusFilter)}
        />
      </div>

      {/* Operational Scheduling & Room Type Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Operational Schedule (Check-ins / Check-outs) (Section 11) */}
        <TodaysOperationsSchedule
          reservations={store.reservations}
          onNavigateReservations={() => onNavigateTab('reservations')}
        />

        {/* Room Type Performance Comparison (Section 10) */}
        <RoomTypePerformanceChart
          data={roomTypePerformanceData}
          onNavigateToRooms={(roomType) => onNavigateTab('rooms', roomType)}
        />
      </div>

      {/* Dormitory Accommodation & Revenue Streams Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dormitory Bed Occupancy Chart (Section 15) */}
        <DormitoryOccupancyChart
          slots={store.dormSlots}
          onNavigateToDormitory={() => onNavigateTab('dormitory')}
        />

        {/* Revenue Stream Breakdown Card (Section 16) */}
        <RevenueBreakdownCard
          data={revenueBreakdownData}
          totalAmount={metrics.totalRevenuePeriod}
          onNavigateToBilling={() => onNavigateTab('billing')}
        />
      </div>

      {/* Operational Data: Recent Reservations Table (Section 12) */}
      <RecentReservationsTable
        reservations={store.reservations}
        onConfirm={onConfirmReservation}
        onCancel={onCancelReservation}
        onNavigateAll={(filter) => onNavigateTab('reservations', filter)}
      />

      {/* Activity Timeline (Section 14) */}
      <RecentActivityTimeline
        activities={recentActivities}
        onNavigateTab={onNavigateTab}
      />

    </div>
  );
};
