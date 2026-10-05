import React from 'react';
import { Building2, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { AdminDormSlot } from '../../data/adminMockData';

interface DormitoryOccupancyChartProps {
  slots: AdminDormSlot[];
  onNavigateToDormitory: () => void;
}

export const DormitoryOccupancyChart: React.FC<DormitoryOccupancyChartProps> = ({
  slots,
  onNavigateToDormitory
}) => {
  const total = slots.length || 1;
  const occupied = slots.filter(s => s.status === 'Occupied' || s.status === 'Reserved').length;
  const available = slots.filter(s => s.status === 'Available').length;
  const underCleaning = slots.filter(s => s.status === 'Under Cleaning').length;
  const occupancyPct = Math.round((occupied / total) * 100);

  const maleOccupied = slots.filter(s => s.wing === 'Male Wing' && (s.status === 'Occupied' || s.status === 'Reserved')).length;
  const maleTotal = slots.filter(s => s.wing === 'Male Wing').length || 1;

  const femaleOccupied = slots.filter(s => s.wing === 'Female Wing' && (s.status === 'Occupied' || s.status === 'Reserved')).length;
  const femaleTotal = slots.filter(s => s.wing === 'Female Wing').length || 1;

  const radius = 46;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (occupancyPct / 100) * circumference;

  return (
    <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gold-200/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gold-100/90 border border-gold-300 text-pine-900 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-pine-800" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
              Dormitory Bed Occupancy
            </h3>
            <p className="text-xs text-slate-500">
              Long-term monthly student & reviewer tenant quarters
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToDormitory}
          className="text-xs font-bold text-pine-800 hover:text-gold-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Dorm Slots</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Graphic & Stats Row */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-1">
        {/* Progress Ring */}
        <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 110 110">
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#b47818"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-serif font-bold text-pine-950 leading-tight">
              {occupancyPct}%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              Occupied
            </span>
          </div>
        </div>

        {/* Wing Breakdown Stats */}
        <div className="w-full sm:w-auto space-y-3 text-xs flex-1">
          {/* Male Wing */}
          <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Male Wing (Highland)</span>
              </span>
              <span className="font-mono font-bold text-pine-950">{maleOccupied} / {maleTotal} Beds</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(maleOccupied / maleTotal) * 100}%` }}
              />
            </div>
          </div>

          {/* Female Wing */}
          <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Female Wing (Blossom)</span>
              </span>
              <span className="font-mono font-bold text-pine-950">{femaleOccupied} / {femaleTotal} Beds</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-rose-500 rounded-full"
              style={{ width: `${(femaleOccupied / femaleTotal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Bed Counters */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gold-100 text-center text-xs">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70">
          <div className="text-[10px] uppercase font-bold text-emerald-800">Available</div>
          <div className="text-lg font-bold font-serif">{available} Beds</div>
        </div>
        <div className="p-2 rounded-xl bg-gold-50 text-pine-950 border border-gold-200">
          <div className="text-[10px] uppercase font-bold text-gold-800">Occupied</div>
          <div className="text-lg font-bold font-serif">{occupied} Beds</div>
        </div>
        <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/70">
          <div className="text-[10px] uppercase font-bold text-amber-800">Cleaning</div>
          <div className="text-lg font-bold font-serif">{underCleaning} Beds</div>
        </div>
      </div>

    </div>
  );
};
