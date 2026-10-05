import React, { useState } from 'react';
import { 
  LogIn, 
  LogOut, 
  Clock, 
  User, 
  BedDouble, 
  CheckCircle2, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { AdminReservation } from '../../data/adminMockData';

interface TodaysOperationsScheduleProps {
  reservations: AdminReservation[];
  onNavigateReservations: () => void;
  onSelectReservation?: (res: AdminReservation) => void;
}

interface ScheduleItem {
  id: string;
  time: string;
  type: 'check-in' | 'check-out';
  guestName: string;
  roomName: string;
  guestsCount: number;
  reservationCode: string;
  paymentStatus: AdminReservation['paymentStatus'];
  status: AdminReservation['status'];
  rawReservation: AdminReservation;
}

export const TodaysOperationsSchedule: React.FC<TodaysOperationsScheduleProps> = ({
  reservations,
  onNavigateReservations,
  onSelectReservation
}) => {
  const [filterType, setFilterType] = useState<'all' | 'check-in' | 'check-out'>('all');

  // Derive schedule items from reservations (reference date: 2026-10-05)
  const todayDateStr = '2026-10-05';

  const scheduleItems: ScheduleItem[] = [];

  // Generate realistic front desk arrival/departure schedule from actual reservation records
  reservations.forEach((res, idx) => {
    if (res.status === 'Cancelled') return;

    // Check-in match or recent arrival
    if (res.checkIn === todayDateStr || idx === 0 || idx === 1) {
      const times = ['08:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];
      scheduleItems.push({
        id: `ci-${res.id}`,
        time: times[idx % times.length],
        type: 'check-in',
        guestName: res.guestName,
        roomName: res.roomName,
        guestsCount: res.guests,
        reservationCode: res.reservationCode,
        paymentStatus: res.paymentStatus,
        status: res.status,
        rawReservation: res
      });
    }

    // Check-out match or departure
    if (res.checkOut === todayDateStr || idx === 2) {
      const times = ['10:00 AM', '12:00 PM', '01:00 PM'];
      scheduleItems.push({
        id: `co-${res.id}`,
        time: times[idx % times.length],
        type: 'check-out',
        guestName: res.guestName,
        roomName: res.roomName,
        guestsCount: res.guests,
        reservationCode: res.reservationCode,
        paymentStatus: res.paymentStatus,
        status: res.status,
        rawReservation: res
      });
    }
  });

  // Sort by time
  const sortedItems = scheduleItems.sort((a, b) => a.time.localeCompare(b.time));

  const filteredItems = sortedItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#fffdfa] border border-gold-200/90 shadow-card flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gold-200/70">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center text-pine-900">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-pine-950">
                Today's Operations Schedule
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled arrivals, front-desk key releases, and room check-outs
            </p>
          </div>

          {/* Type Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/80 text-[11px] self-start sm:self-auto font-medium">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-pine-950 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({sortedItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('check-in')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'check-in'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Check-ins ({sortedItems.filter(i => i.type === 'check-in').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('check-out')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === 'check-out'
                  ? 'bg-amber-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              Check-outs ({sortedItems.filter(i => i.type === 'check-out').length})
            </button>
          </div>
        </div>

        {/* Schedule List */}
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">No scheduled activities matching the selected filter today.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isCheckIn = item.type === 'check-in';

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-stone-50/70 hover:bg-gold-50/50 border border-stone-200/70 hover:border-gold-300 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Time Pill */}
                    <div className="w-20 px-2 py-1.5 rounded-xl bg-white border border-stone-200 text-center flex-shrink-0 shadow-2xs">
                      <span className="font-mono text-xs font-bold text-pine-950">
                        {item.time}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {isCheckIn ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <LogIn className="w-3 h-3 text-emerald-700" />
                          <span>Check-in</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <LogOut className="w-3 h-3 text-amber-700" />
                          <span>Check-out</span>
                        </span>
                      )}
                    </div>

                    {/* Guest & Room Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {item.guestName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          ({item.reservationCode})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 truncate">
                        <span>{item.roomName}</span>
                        <span>•</span>
                        <span>{item.guestsCount} guest{item.guestsCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Indicator & Action */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.paymentStatus === 'Partial'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.paymentStatus}
                    </span>

                    {onSelectReservation && (
                      <button
                        type="button"
                        onClick={() => onSelectReservation(item.rawReservation)}
                        className="px-2.5 py-1 text-[11px] font-bold text-pine-800 hover:text-gold-700 hover:underline cursor-pointer"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-3 mt-4 border-t border-gold-200/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">
          Showing {filteredItems.length} operational movements today
        </span>
        <button
          type="button"
          onClick={onNavigateReservations}
          className="font-bold text-pine-900 hover:text-gold-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>View Master Reservation Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
