import React, { useState } from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { ChartDataPoint, TimePeriod } from '../../data/adminAnalytics';

interface RevenueTrendChartProps {
  data: ChartDataPoint[];
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  totalRevenue: number;
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({
  data,
  period,
  onPeriodChange,
  totalRevenue
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const values = data.map(d => d.value);
  const maxValue = Math.max(...values, 1000);
  const minValue = 0;

  // Chart dimensions
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  // Compute points
  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * plotWidth;
    const y = height - paddingY - ((d.value - minValue) / (maxValue - minValue)) * plotHeight;
    return { x, y, ...d };
  });

  // Generate SVG path for line
  const linePath = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  // Generate area path
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      
      {/* Header with Title and Period Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gold-200/70">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gold-100/90 border border-gold-300 text-pine-900 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-pine-800" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
                Revenue Performance Trend
              </h3>
              <p className="text-xs text-slate-500">
                Gross property receipts (Transient Lodging + Monthly Dormitory Rent)
              </p>
            </div>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-stone-100/80 border border-stone-200/80 self-start sm:self-auto text-xs font-semibold max-w-full overflow-x-auto">
          {(['7d', '30d', '3m', '12m'] as TimePeriod[]).map((p) => {
            const shortLabels: Record<TimePeriod, string> = {
              '7d': '7D',
              '30d': '30D',
              '3m': '3M',
              '12m': '12M'
            };
            const labels: Record<TimePeriod, string> = {
              '7d': '7 Days',
              '30d': '30 Days',
              '3m': '3 Months',
              '12m': '12 Months'
            };
            const isSelected = period === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pine-950 text-gold-300 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-pine-950 hover:bg-stone-200/60'
                }`}
              >
                <span className="sm:hidden">{shortLabels[p]}</span>
                <span className="hidden sm:inline">{labels[p]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Snapshot metrics strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
            {activePoint ? activePoint.label : 'Period Total'}
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-pine-950">
            ₱{activePoint ? activePoint.value.toLocaleString() : totalRevenue.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
            <span className="text-slate-600">Total Revenue (₱)</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            +14.2% Growth
          </span>
        </div>
      </div>

      {/* Interactive Responsive SVG Line/Area Chart */}
      <div className="relative w-full h-[220px] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d9a33c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#d9a33c" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b47818" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - paddingY - pct * plotHeight;
            const val = Math.round(minValue + pct * (maxValue - minValue));
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  ₱{(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#revenueGradient)"
            />
          )}

          {/* Line Stroke */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Interactive Data Points and Invisible Hitboxes */}
          {points.map((pt, i) => {
            const isHovered = hoverIndex === i;
            return (
              <g key={i}>
                {/* Visual point dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#1b382b' : '#ffffff'}
                  stroke="#d9a33c"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* X-axis label */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[10px] font-sans transition-colors ${
                    isHovered ? 'fill-pine-950 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {pt.label.split(' ')[0]}
                </text>

                {/* Wide invisible click/hover column hitbox */}
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

          {/* Active Crosshair Line */}
          {hoverIndex !== null && points[hoverIndex] && (
            <line
              x1={points[hoverIndex].x}
              y1={paddingY}
              x2={points[hoverIndex].x}
              y2={height - paddingY}
              stroke="#1b382b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="pointer-events-none"
            />
          )}
        </svg>

        {/* Floating Tooltip Pill */}
        {hoverIndex !== null && points[hoverIndex] && (
          <div
            className="absolute top-2 -translate-x-1/2 bg-pine-950 text-gold-200 text-xs px-3 py-1.5 rounded-xl shadow-lg border border-gold-400/40 pointer-events-none flex items-center gap-2 z-10 whitespace-nowrap animate-fade-in"
            style={{
              left: `${(points[hoverIndex].x / width) * 100}%`
            }}
          >
            <span className="font-semibold text-white">{points[hoverIndex].label}:</span>
            <span className="font-mono font-bold text-gold-300">
              ₱{points[hoverIndex].value.toLocaleString()}
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
