import React from 'react';
import { BedDouble, ArrowUpRight } from 'lucide-react';

interface RoomTypeStat {
  typeName: string;
  bookingCount: number;
  revenue: number;
  roomCount: number;
}

interface RoomTypePerformanceChartProps {
  data: RoomTypeStat[];
  onNavigateToRooms: (roomType?: string) => void;
}

export const RoomTypePerformanceChart: React.FC<RoomTypePerformanceChartProps> = ({
  data,
  onNavigateToRooms
}) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1000);

  return (
    <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gold-200/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gold-100/90 border border-gold-300 text-pine-900 flex items-center justify-center">
            <BedDouble className="w-4 h-4 text-pine-800" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
              Room Type Performance
            </h3>
            <p className="text-xs text-slate-500">
              Gross revenue generated and booking volume by accommodation category
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Top Performer: Family Suite
        </span>
      </div>

      {/* Horizontal Bar Rows */}
      <div className="space-y-3.5 pt-1">
        {data.map((item, idx) => {
          const barPct = Math.round((item.revenue / maxRevenue) * 100);

          return (
            <div
              key={idx}
              className="space-y-1 group cursor-pointer"
              onClick={() => onNavigateToRooms(item.typeName)}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 group-hover:text-gold-700 transition-colors flex items-center gap-1.5">
                  <span>{item.typeName}</span>
                  <span className="text-[10px] font-normal text-slate-400">({item.bookingCount} bookings)</span>
                </span>
                <span className="font-serif font-bold text-pine-950">
                  ₱{item.revenue.toLocaleString()}
                </span>
              </div>

              {/* Progress bar track */}
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden border border-stone-200/80 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pine-900 via-gold-600 to-amber-500 transition-all duration-500 group-hover:brightness-110"
                  style={{ width: `${Math.max(barPct, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
