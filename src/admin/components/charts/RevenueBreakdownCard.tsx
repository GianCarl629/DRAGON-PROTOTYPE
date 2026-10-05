import React from 'react';
import { Receipt, ArrowRight } from 'lucide-react';

interface RevenueItem {
  label: string;
  amount: number;
  pct: number;
  color: string;
}

interface RevenueBreakdownCardProps {
  data: RevenueItem[];
  totalAmount: number;
  onNavigateToBilling: () => void;
}

export const RevenueBreakdownCard: React.FC<RevenueBreakdownCardProps> = ({
  data,
  totalAmount,
  onNavigateToBilling
}) => {
  return (
    <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gold-200/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gold-100/90 border border-gold-300 text-pine-900 flex items-center justify-center">
            <Receipt className="w-4 h-4 text-pine-800" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
              Revenue Stream Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Contribution by property operational channel
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToBilling}
          className="text-xs font-bold text-pine-800 hover:text-gold-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Billing Records</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stacked Bar Distribution */}
      <div className="space-y-1.5">
        <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-stone-100 border border-stone-200 shadow-inner">
          {data.map((item, idx) => (
            <div
              key={idx}
              style={{
                width: `${item.pct}%`,
                backgroundColor: item.color
              }}
              className="h-full transition-all duration-300 hover:opacity-90 cursor-pointer"
              title={`${item.label}: ₱${item.amount.toLocaleString()} (${item.pct}%)`}
              onClick={onNavigateToBilling}
            />
          ))}
        </div>
      </div>

      {/* Detailed Items List */}
      <div className="space-y-2.5 pt-1">
        {data.map((item, idx) => (
          <div
            key={idx}
            onClick={onNavigateToBilling}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 hover:bg-gold-50/70 border border-stone-200/80 transition-all cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-slate-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-pine-950">₱{item.amount.toLocaleString()}</span>
              <span className="text-[11px] font-mono text-slate-400 font-bold w-10 text-right">
                {item.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
