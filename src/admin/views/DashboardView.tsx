import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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
  onNavigateTab: (tab: string, filter?: string) => void;
  onConfirmReservation: (id: string) => void;
  onCancelReservation: (id: string, reason: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onConfirmReservation,
  onCancelReservation
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [liveStore, setLiveStore] = useState<any>({
    reservations: [],
    rooms: [],
    dormSlots: [],
    billing: [],
    inquiries: []
  });

  // Fetch lahat ng live data mula sa Supabase para sa Dashboard Analytics
  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    const [resRes, roomRes, dormRes, billRes, inqRes] = await Promise.all([
      supabase.from('reservations').select('*'),
      supabase.from('room_units').select('*'),
      supabase.from('dorm_beds').select('*'),
      supabase.from('billing_records').select('*'),
      supabase.from('guest_inquiries').select('*')
    ]);

    // Formatter para sa reservations
    const formattedReservations = (resRes.data || []).map((r: any) => ({
      id: r.id,
      reservationCode: r.reservation_code || `RES-${r.id.substring(0, 5)}`,
      guestName: r.guest_name,
      roomName: r.room_type || 'Room Unit',
      roomType: r.room_type,
      guests: r.number_of_guests || 1,
      checkIn: r.check_in_date,
      checkOut: r.check_out_date,
      status: r.status,
      totalAmount: Number(r.total_price) || 0,
      bookedAt: 'Recent'
    }));

    // Formatter para sa rooms
    const formattedRooms = (roomRes.data || []).map((rm: any) => ({
      id: rm.id,
      name: rm.room_number,
      roomType: rm.room_type,
      floor: rm.floor,
      status: rm.status,
      price: rm.price_per_night
    }));

    // Formatter para sa dorm beds
    const formattedDormSlots = (dormRes.data || []).map((d: any) => ({
      id: d.id,
      dormRoom: d.room_number,
      wing: d.wing,
      bedSlot: d.bed_identifier,
      status: d.status,
      tenantName: d.tenant_name,
      tenantPhone: d.tenant_phone,
      dueDate: d.due_date,
      monthlyRate: Number(d.monthly_rent) || 3500,
      utilityStatus: d.amenities || 'Inclusive of Wi-Fi'
    }));

    // Formatter para sa billing
    const formattedBilling = (billRes.data || []).map((b: any) => ({
      id: b.id,
      invoiceNumber: b.invoice_number,
      tenantOrGuest: b.tenant_or_guest,
      type: b.type,
      roomOrBed: b.room_or_bed,
      billingPeriod: b.billing_period,
      rentAmount: Number(b.rent_amount) || 0,
      waterAmount: Number(b.water_amount) || 0,
      electricityAmount: Number(b.electricity_amount) || 0,
      depositAmount: Number(b.deposit_amount) || 0,
      totalAmount: Number(b.total_amount) || 0,
      paymentStatus: b.payment_status,
      dueDate: b.due_date,
      paidAt: b.paid_at
    }));

    // Formatter para sa inquiries
    const formattedInquiries = (inqRes.data || []).map((i: any) => ({
      id: i.id,
      guestName: i.guest_name,
      topic: i.topic,
      message: i.message,
      status: i.status,
      receivedAt: i.received_at || 'Recent'
    }));

    setLiveStore({
      reservations: formattedReservations,
      rooms: formattedRooms,
      dormSlots: formattedDormSlots,
      billing: formattedBilling,
      inquiries: formattedInquiries
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Centralized calculations gamit ang live store data
  const metrics = calculateDashboardMetrics(liveStore, selectedPeriod);
  const attentionItems = getAttentionItems(liveStore);
  const recentActivities = getRecentActivities(liveStore);

  const revenueData = getRevenueTimeline(liveStore, selectedPeriod);
  const occupancyData = getOccupancyTimeline(liveStore, selectedPeriod);
  const reservationStatusData = getReservationStatusCounts(liveStore.reservations);
  const roomStatusData = getRoomStatusCounts(liveStore.rooms);
  const roomTypePerformanceData = getRoomTypePerformance(liveStore.reservations, liveStore.rooms);
  const revenueBreakdownData = getRevenueBreakdown(liveStore.billing);

  if (isLoading) {
    return (
      <div className="py-32 text-center text-slate-500 font-semibold text-sm flex justify-center items-center gap-3">
        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        Karkargaen dagiti real-time analytics ken operations metrics manipud Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#fffdfa] border border-gold-200/90 shadow-luxury">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-pine-950">
              Operations Overview
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-pine-900 border border-gold-300 uppercase tracking-wider">
              Live Supabase Monitor
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Real-time occupancy, guest turnover, reservations review, and financial metrics for Dragon Treasure.
          </p>
        </div>

        {/* Global Date Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200/90 self-start md:self-auto">
          {(['7d', '30d', '3m', '12m'] as const).map((p) => {
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pine-950 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-200/60'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority 1: Requires Attention Banner */}
      <RequiresAttentionBanner
        items={attentionItems}
        onNavigate={onNavigateTab}
      />

      {/* Priority 2 & 3: 6 Core Summary KPI Cards */}
      <DashboardKpiCards
        metrics={metrics}
        onNavigateTab={onNavigateTab}
      />

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueTrendChart
            data={revenueData}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            totalRevenue={metrics.totalRevenuePeriod}
          />
        </div>

        <div className="lg:col-span-1">
          <ReservationStatusDonut
            data={reservationStatusData}
            totalCount={liveStore.reservations.length}
            onFilterStatus={(status) => onNavigateTab('reservations', status)}
          />
        </div>
      </div>

      {/* Secondary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyTrendChart
          data={occupancyData}
          currentOccupancyPct={metrics.occupancyRatePct}
        />

        <RoomStatusDistribution
          rooms={liveStore.rooms}
          statusData={roomStatusData}
          onNavigateToRooms={(statusFilter) => onNavigateTab('rooms', statusFilter)}
        />
      </div>

      {/* Operational Scheduling & Room Type Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysOperationsSchedule
          reservations={liveStore.reservations}
          onNavigateReservations={() => onNavigateTab('reservations')}
        />

        <RoomTypePerformanceChart
          data={roomTypePerformanceData}
          onNavigateToRooms={(roomType) => onNavigateTab('rooms', roomType)}
        />
      </div>

      {/* Dormitory Accommodation & Revenue Streams Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DormitoryOccupancyChart
          slots={liveStore.dormSlots}
          onNavigateToDormitory={() => onNavigateTab('dormitory')}
        />

        <RevenueBreakdownCard
          data={revenueBreakdownData}
          totalAmount={metrics.totalRevenuePeriod}
          onNavigateToBilling={() => onNavigateTab('billing')}
        />
      </div>

      {/* Recent Reservations Table */}
      <RecentReservationsTable
        reservations={liveStore.reservations}
        onConfirm={onConfirmReservation}
        onCancel={onCancelReservation}
        onNavigateAll={(filter) => onNavigateTab('reservations', filter)}
      />

      {/* Activity Timeline */}
      <RecentActivityTimeline
        activities={recentActivities}
        onNavigateTab={onNavigateTab}
      />

    </div>
  );
};