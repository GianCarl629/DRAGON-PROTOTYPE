import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Download, 
  Building2, 
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ReservationRow {
  reservationCode: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
}

export const ReportsView: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportsData = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('reservations').select('*');

    if (data) {
      const formatted: ReservationRow[] = data.map((r: any) => ({
        reservationCode: r.reservation_code || `RES-${r.id.substring(0, 5)}`,
        guestName: r.guest_name,
        roomName: r.room_type || 'Room Unit',
        checkIn: r.check_in_date,
        checkOut: r.check_out_date,
        status: r.status,
        totalAmount: Number(r.total_price) || 0
      }));
      setReservations(formatted);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const confirmedCount = reservations.filter(r => r.status === 'Confirmed').length;
  const pendingCount = reservations.filter(r => r.status === 'Pending Review').length;
  const cancelledCount = reservations.filter(r => r.status === 'Cancelled').length;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Code,Guest,Room,CheckIn,CheckOut,Status,Amount\n' +
      reservations
        .map(
          r =>
            `${r.reservationCode},"${r.guestName}","${r.roomName}",${r.checkIn},${r.checkOut},${r.status},${r.totalAmount}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dragon_treasure_reservations_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
            <span>Property Performance & Analytics</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-pine-900 border border-gold-300">
              Q4 2026
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Occupancy rate indicators, monthly revenue breakdown, and reservation conversion metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-pine-950 border border-gold-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4 text-gold-600" />
          <span>Export Summary CSV</span>
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#fffdfa] border border-gold-200/90 shadow-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Occupancy</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-pine-950">76.4%</div>
          <div className="text-[11px] text-emerald-700 font-bold">+5.8% vs last month</div>
        </div>

        <div className="bg-[#fffdfa] border border-gold-200/90 shadow-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average Nightly Rate</span>
            <DollarSign className="w-4 h-4 text-gold-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-gold-700">₱2,450</div>
          <div className="text-[11px] text-slate-500">Across transient rooms</div>
        </div>

        <div className="bg-[#fffdfa] border border-gold-200/90 shadow-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Dorm Retention Rate</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-purple-900">87.5%</div>
          <div className="text-[11px] text-purple-700 font-semibold">Semester renewal rate</div>
        </div>

        <div className="bg-[#fffdfa] border border-gold-200/90 shadow-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Booking Approval Rate</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-blue-900">92.0%</div>
          <div className="text-[11px] text-slate-500">Pending review conversion</div>
        </div>
      </div>

      {/* Visual Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Revenue Distribution */}
        <div className="bg-[#fffdfa] border border-gold-200/90 shadow-card p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 className="font-serif font-bold text-base text-pine-950 flex items-center justify-between">
            <span>Revenue by Business Segment</span>
            <span className="text-xs font-sans text-slate-500 font-medium">Monthly Gross</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1 font-medium">
                <span>Transient Accommodations (Short-Term)</span>
                <span className="font-bold text-gold-800">₱52,000 (61.5%)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-gradient-to-r from-gold-500 to-gold-600 h-full rounded-full" style={{ width: '61.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1 font-medium">
                <span>Dormitory Student & Worker Rentals</span>
                <span className="font-bold text-purple-800">₱32,500 (38.5%)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '38.5%' }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-slate-500 flex justify-between">
            <span>Target Q4 Revenue: ₱250,000</span>
            <span className="text-emerald-700 font-bold">On Track (68%)</span>
          </div>
        </div>

        {/* Reservation Status Distribution */}
        <div className="bg-[#fffdfa] border border-gold-200/90 shadow-card p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 className="font-serif font-bold text-base text-pine-950 flex items-center justify-between">
            <span>Reservation Status Breakdown</span>
            <span className="text-xs font-sans text-slate-500 font-medium">
              {isLoading ? '...' : `${reservations.length} records`}
            </span>
          </h3>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
              <span className="text-2xl font-bold font-serif text-emerald-800">{confirmedCount}</span>
              <span className="text-[10px] text-emerald-900 uppercase font-bold block mt-1">Confirmed</span>
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
              <span className="text-2xl font-bold font-serif text-amber-800">{pendingCount}</span>
              <span className="text-[10px] text-amber-900 uppercase font-bold block mt-1">Pending</span>
            </div>

            <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
              <span className="text-2xl font-bold font-serif text-rose-800">{cancelledCount}</span>
              <span className="text-[10px] text-rose-900 uppercase font-bold block mt-1">Cancelled</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            All reservation requests submitted by visitors are staged under "Pending Review" awaiting staff confirmation, preventing double-bookings.
          </p>
        </div>

      </div>

    </div>
  );
};