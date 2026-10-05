import React, { useState } from 'react';
import { BedDouble, ArrowUpRight } from 'lucide-react';
import { ChartDataPoint } from '../../data/adminAnalytics';

interface OccupancyTrendChartProps {
  data: ChartDataPoint[];
  currentOccupancyPct: number;
}

export const OccupancyTrendChart: React.FC<OccupancyTrendChartProps> = ({
  data,
  currentOccupancyPct
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 500;
  const height = 200;
  const paddingX = 35;
  const paddingY = 25;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const maxValue = 100;
  const minValue = 0;

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * plotWidth;
    const y = height - paddingY - ((d.value - minValue) / (maxValue - minValue)) * plotHeight;
    return { x, y, ...d };
  });

  const linePath = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gold-200/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-900 flex items-center justify-center">
            <BedDouble className="w-4 h-4 text-emerald-800" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
              Occupancy Rate Trend
            </h3>
            <p className="text-xs text-slate-500">
              Daily percentage of occupied units over time
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-serif font-bold text-emerald-800">
            {activePoint ? activePoint.value : currentOccupancyPct}%
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block flex items-center justify-end gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            Target: 70%+
          </span>
        </div>
      </div>

      {/* SVG Line / Area Graph */}
      <div className="relative w-full h-[180px] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="occupancyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Target 70% Guideline */}
          {(() => {
            const targetY = height - paddingY - (70 / 100) * plotHeight;
            return (
              <g>
                <line
                  x1={paddingX}
                  y1={targetY}
                  x2={width - paddingX}
                  y2={targetY}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth="1.2"
                  opacity={0.6}
                />
                <text
                  x={width - paddingX + 5}
                  y={targetY + 3}
                  className="text-[9px] fill-emerald-700 font-bold"
                >
                  70%
                </text>
              </g>
            );
          })()}

          {/* Grid lines (0, 50, 100%) */}
          {[0, 0.5, 1].map((pct, i) => {
            const y = height - paddingY - pct * plotHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  {Math.round(pct * 100)}%
                </text>
              </g>
            );
          })}

          {/* Area */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#occupancyGradient)"
            />
          )}

          {/* Stroke */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Points */}
          {points.map((pt, i) => {
            const isHovered = hoverIndex === i;
            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill={isHovered ? '#065f46' : '#ffffff'}
                  stroke="#059669"
                  strokeWidth={2}
                  className="transition-all duration-150"
                />

                <text
                  x={pt.x}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[9px] font-sans ${
                    isHovered ? 'fill-emerald-950 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {pt.label.split(' ')[0]}
                </text>

                <rect
                  x={pt.x - plotWidth / (points.length * 2)}
                  y={0}
                  width={plotWidth / points.length}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoverIndex !== null && points[hoverIndex] && (
          <div
            className="absolute top-2 -translate-x-1/2 bg-emerald-950 text-white text-[11px] px-2.5 py-1 rounded-lg shadow-md border border-emerald-400/40 pointer-events-none z-10 whitespace-nowrap animate-fade-in"
            style={{
              left: `${(points[hoverIndex].x / width) * 100}%`
            }}
          >
            <span>{points[hoverIndex].label}: </span>
            <span className="font-bold text-emerald-300">{points[hoverIndex].value}% Occupied</span>
          </div>
        )}
      </div>

    </div>
  );
};
