import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CreditCard, 
  Wrench, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { AttentionItem } from '../../data/adminAnalytics';

interface RequiresAttentionBannerProps {
  items: AttentionItem[];
  onNavigate: (tab: string, filter?: string) => void;
}

export const RequiresAttentionBanner: React.FC<RequiresAttentionBannerProps> = ({
  items,
  onNavigate
}) => {
  if (items.length === 0) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-emerald-950">
              No Pending Action Items
            </h4>
            <p className="text-xs text-emerald-800">
              All reservations are reviewed, payments are settled, and rooms are inspected.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          All Systems Normal
        </span>
      </div>
    );
  }

  const getCategoryIcon = (category: AttentionItem['category']) => {
    switch (category) {
      case 'reservations':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'billing':
        return <CreditCard className="w-4 h-4 text-rose-600" />;
      case 'rooms':
        return <Wrench className="w-4 h-4 text-orange-600" />;
      case 'inquiries':
        return <MessageSquare className="w-4 h-4 text-sky-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getUrgencyBadge = (urgency: AttentionItem['urgency']) => {
    switch (urgency) {
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-rose-50/60 border-2 border-amber-300/80 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white shadow-sm flex items-center justify-center flex-shrink-0 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-pine-950">
                Requires Attention
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/90 text-amber-950 border border-amber-300 uppercase tracking-wider">
                {items.length} Action{items.length > 1 ? 's' : ''} Needed
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Immediate operational notices requiring manager verification or intervention.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.targetTab, item.targetFilter)}
            className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-amber-200/90 hover:border-amber-400 transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer group flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  {getCategoryIcon(item.category)}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getUrgencyBadge(item.urgency)}`}>
                  {item.count} Pending
                </span>
              </div>
              <h5 className="font-semibold text-xs text-slate-900 leading-snug group-hover:text-pine-900 transition-colors">
                {item.title}
              </h5>
            </div>

            <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold text-pine-800 group-hover:text-gold-700 transition-colors">
              <span>{item.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
