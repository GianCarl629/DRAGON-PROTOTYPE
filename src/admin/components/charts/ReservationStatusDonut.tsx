import React, { useState } from 'react';
import { PieChart } from 'lucide-react';

interface StatusItem {
  label: string;
  count: number;
  pct: number;
  color: string;
}

interface ReservationStatusDonutProps {
  data: StatusItem[];
  totalCount: number;
  onFilterStatus?: (status: string) => void;
}

export const ReservationStatusDonut: React.FC<ReservationStatusDonutProps> = ({
  data,
  totalCount,
  onFilterStatus
}) => {
  const [activeItem, setActiveItem] = useState<StatusItem | null>(null);

  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray offsets
  let accumulatedAngle = 0;
  const slices = data.map((item) => {
    const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle;
    accumulatedAngle += (item.pct / 100) * circumference;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const displayItem = activeItem || data[0] || { label: 'All', count: totalCount, pct: 100, color: '#10b981' };

  return (
    <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gold-200/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gold-100/90 border border-gold-300 text-pine-900 flex items-center justify-center">
            <PieChart className="w-4 h-4 text-pine-800" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
              Reservation Status
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of current booking lifecycle
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-pine-900 px-2.5 py-1 rounded-full bg-gold-50 border border-gold-300">
          {totalCount} Total
        </span>
      </div>

      {/* Donut Graphic + Center Readout */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-6 py-2">
        <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full -rotate-90 transform overflow-visible" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Slices */}
            {slices.map((slice, i) => {
              if (slice.count === 0) return null;
              const isHovered = activeItem?.label === slice.label;
              return (
                <circle
                  key={i}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveItem(slice)}
                  onMouseLeave={() => setActiveItem(null)}
                  onClick={() => onFilterStatus?.(slice.label)}
                />
              );
            })}
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate max-w-[100px]">
              {displayItem.label}
            </span>
            <span className="text-2xl font-serif font-bold text-pine-950 leading-tight">
              {displayItem.pct}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {displayItem.count} booking{displayItem.count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full sm:w-auto space-y-2.5">
          {data.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onFilterStatus?.(item.label)}
              onMouseEnter={() => setActiveItem(item)}
              onMouseLeave={() => setActiveItem(null)}
              className={`w-full text-left flex items-center justify-between gap-4 p-2 rounded-xl transition-all cursor-pointer ${
                activeItem?.label === item.label ? 'bg-gold-50 shadow-2xs' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-pine-950">{item.count}</span>
                <span className="text-slate-400 text-[11px]">({item.pct}%)</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
