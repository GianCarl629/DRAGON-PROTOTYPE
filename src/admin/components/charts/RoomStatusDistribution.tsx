import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { AdminRoom } from '../../data/adminMockData';

interface RoomStatusItem {
  label: string;
  count: number;
  pct: number;
  color: string;
}

interface RoomStatusDistributionProps {
  rooms: AdminRoom[];
  statusData: RoomStatusItem[];
  onNavigateToRooms: (statusFilter?: string) => void;
}

export const RoomStatusDistribution: React.FC<RoomStatusDistributionProps> = ({
  rooms,
  statusData,
  onNavigateToRooms
}) => {
  const total = rooms.length || 1;

  // Group rooms by floor
  const floors = ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor (Top Floor)'];

  const getStatusColorClass = (status: AdminRoom['status']) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500 text-white';
      case 'Occupied': return 'bg-pine-900 text-gold-300';
      case 'Reserved': return 'bg-amber-400 text-pine-950';
      case 'Maintenance': return 'bg-rose-500 text-white';
      default: return 'bg-stone-300 text-slate-800';
    }
  };

  return (
    <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gold-200/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gold-100/90 border border-gold-300 text-pine-900 flex items-center justify-center">
            <Layers className="w-4 h-4 text-pine-800" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
              Room Inventory Status
            </h3>
            <p className="text-xs text-slate-500">
              Operational readiness across all floors
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToRooms()}
          className="text-xs font-bold text-pine-800 hover:text-gold-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Manage Rooms</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stacked Percentage Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Overall Allocation</span>
          <span>{total} Total Rooms</span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-stone-100 border border-stone-200 shadow-inner">
          {statusData.map((item, idx) => (
            item.count > 0 && (
              <div
                key={idx}
                style={{
                  width: `${(item.count / total) * 100}%`,
                  backgroundColor: item.color
                }}
                className="h-full transition-all duration-300 hover:opacity-90 cursor-pointer"
                title={`${item.label}: ${item.count} rooms (${item.pct}%)`}
                onClick={() => onNavigateToRooms(item.label)}
              />
            )
          ))}
        </div>
      </div>

      {/* Status KPI Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {statusData.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onNavigateToRooms(item.label)}
            className="p-3 rounded-2xl bg-stone-50 hover:bg-gold-50/70 border border-stone-200/80 hover:border-gold-300 transition-all text-left cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.label}</span>
            </div>
            <div className="text-xl font-bold font-serif text-pine-950 mt-1">
              {item.count} <span className="text-xs font-sans font-normal text-slate-500">units</span>
            </div>
            <div className="text-[10px] text-slate-400 group-hover:text-gold-700 font-medium mt-0.5">
              {item.pct}% of capacity →
            </div>
          </button>
        ))}
      </div>

      {/* Floor-by-floor Visual Room Matrix */}
      <div className="pt-2 border-t border-gold-100 space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Floor Level Unit Availability
        </span>
        <div className="space-y-2">
          {floors.map((floorName) => {
            const floorRooms = rooms.filter(r => r.floor.toLowerCase().includes(floorName.split(' ')[0].toLowerCase()));
            if (floorRooms.length === 0) return null;

            return (
              <div key={floorName} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="text-slate-500 font-semibold w-28 flex-shrink-0">
                  {floorName.split('(')[0]}:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                  {floorRooms.map(rm => (
                    <button
                      key={rm.id}
                      type="button"
                      onClick={() => onNavigateToRooms(rm.status)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-transform hover:scale-105 cursor-pointer shadow-2xs ${getStatusColorClass(rm.status)}`}
                      title={`${rm.roomNumber} - ${rm.name} (${rm.status})`}
                    >
                      {rm.roomNumber}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
