// Real-time Philippine calendar and live clock widget for admin header
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  MapPin,
  CheckCircle2,
  X
} from 'lucide-react';
import { getPhilippineNow, PhilippineTimeInfo } from '../../utils/philippineTime';
import { AdminReservation } from '../data/adminMockData';

interface RealtimeCalendarDropdownProps {
  reservations: AdminReservation[];
  onSelectDateFilter?: (dateStr: string) => void;
}

export const RealtimeCalendarDropdown: React.FC<RealtimeCalendarDropdownProps> = ({
  reservations,
  onSelectDateFilter
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phtTime, setPhtTime] = useState<PhilippineTimeInfo>(getPhilippineNow());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calendar month view navigation
  const [viewYear, setViewYear] = useState<number>(phtTime.year);
  const [viewMonth, setViewMonth] = useState<number>(phtTime.month - 1); // 0-indexed
  const [selectedDayStr, setSelectedDayStr] = useState<string>(phtTime.isoDateStr);

  // Live Philippine clock ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setPhtTime(getPhilippineNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync calendar when opened
  useEffect(() => {
    if (isOpen) {
      setViewYear(phtTime.year);
      setViewMonth(phtTime.month - 1);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Calendar calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = getPhilippineNow();
    setViewYear(now.year);
    setViewMonth(now.month - 1);
    setSelectedDayStr(now.isoDateStr);
  };

  // Find operations for selected date
  const selectedDateArrivals = reservations.filter(
    r => r.checkIn === selectedDayStr && r.status !== 'Cancelled'
  );
  const selectedDateDepartures = reservations.filter(
    r => r.checkOut === selectedDayStr && r.status !== 'Cancelled'
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Live PHT Header Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-50/90 to-amber-50/80 hover:from-gold-100 hover:to-amber-100 border border-gold-300 text-pine-950 text-[11px] font-medium shadow-2xs transition-all cursor-pointer group"
        title="Current Philippine Time & Calendar (Click to view interactive calendar)"
        aria-label="Philippine Time Calendar"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <CalendarIcon className="w-3.5 h-3.5 text-pine-800 flex-shrink-0 group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-pine-950">{phtTime.shortDateStr}</span>
        <span className="text-slate-400 font-normal hidden xl:inline">•</span>
        <span className="font-mono text-[10px] text-pine-800 font-semibold hidden xl:inline">
          {phtTime.timeStr}
        </span>
        <span className="px-1.5 py-0.2 rounded-md bg-gold-200/80 text-[9px] font-bold text-pine-900 border border-gold-300/80 uppercase tracking-wider hidden sm:inline">
          PHT
        </span>
      </button>

      {/* Interactive Calendar Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#fffdfa] rounded-3xl border-2 border-gold-300 shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
          
          {/* Header & Live Clock Bar */}
          <div className="pb-3 border-b border-gold-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center text-pine-900">
                <Clock className="w-4 h-4 text-pine-800" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Philippine Standard Time (UTC+8)
                </div>
                <div className="font-mono font-bold text-base text-pine-950 tracking-tight">
                  {phtTime.timeStr}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Month Selector Bar */}
          <div className="py-3 flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-pine-950">
              {monthNames[viewMonth]} {viewYear}
            </h4>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-pine-900 flex items-center justify-center cursor-pointer transition-colors"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-pine-900 bg-gold-100 hover:bg-gold-200 border border-gold-300 cursor-pointer transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-pine-900 flex items-center justify-center cursor-pointer transition-colors"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="font-bold text-[10px] text-slate-400 py-1">
                {d}
              </div>
            ))}

            {/* Blank offset days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="h-8" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isToday = dateStr === phtTime.isoDateStr;
              const isSelected = dateStr === selectedDayStr;

              // Check if bookings exist on this day
              const hasCheckIn = reservations.some(r => r.checkIn === dateStr && r.status !== 'Cancelled');
              const hasCheckOut = reservations.some(r => r.checkOut === dateStr && r.status !== 'Cancelled');

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => {
                    setSelectedDayStr(dateStr);
                    if (onSelectDateFilter) onSelectDateFilter(dateStr);
                  }}
                  className={`h-8 rounded-xl relative flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-pine-950 text-white font-bold shadow-xs'
                      : isToday
                      ? 'bg-gold-200 text-pine-950 font-bold border border-gold-400'
                      : 'hover:bg-stone-100 text-slate-700'
                  }`}
                >
                  <span>{dayNum}</span>

                  {/* Operation Activity Dots */}
                  {(hasCheckIn || hasCheckOut) && (
                    <span className="absolute bottom-1 flex gap-0.5">
                      {hasCheckIn && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-600'}`} />
                      )}
                      {hasCheckOut && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-amber-600'}`} />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Operations Summary */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/90 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-[11px]">
                {selectedDayStr === phtTime.isoDateStr ? 'Today in Baguio' : selectedDayStr}:
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {selectedDateArrivals.length} Arrivals • {selectedDateDepartures.length} Departures
              </span>
            </div>

            {selectedDateArrivals.length === 0 && selectedDateDepartures.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">
                No scheduled check-ins or check-outs for this specific date.
              </p>
            ) : (
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1 text-[11px]">
                {selectedDateArrivals.map(a => (
                  <div key={a.id} className="flex items-center justify-between text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/80">
                    <span className="font-medium truncate max-w-[180px]">Arrival: {a.guestName}</span>
                    <span className="text-[10px] font-bold">{a.roomName.split(' ')[0]}</span>
                  </div>
                ))}
                {selectedDateDepartures.map(d => (
                  <div key={d.id} className="flex items-center justify-between text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/80">
                    <span className="font-medium truncate max-w-[180px]">Check-out: {d.guestName}</span>
                    <span className="text-[10px] font-bold">{d.roomName.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Baguio Climate & Season Footer Note */}
          <div className="mt-3 pt-2.5 border-t border-gold-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-pine-700" />
              <span>Engineers' Hill, Baguio City</span>
            </div>
            <span className="text-[10px] font-semibold text-pine-900 bg-pine-50 px-2 py-0.5 rounded-md border border-pine-200">
              Cool Mountain Air • Peak Season
            </span>
          </div>

        </div>
      )}
    </div>
  );
};
