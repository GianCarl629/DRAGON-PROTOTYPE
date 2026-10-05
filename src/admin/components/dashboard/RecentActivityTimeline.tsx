import React, { useState } from 'react';
import { 
  History, 
  CalendarCheck2, 
  CreditCard, 
  BedDouble, 
  MessageSquare, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ActivityEvent } from '../../data/adminAnalytics';

interface RecentActivityTimelineProps {
  activities: ActivityEvent[];
  onNavigateTab: (tab: string) => void;
}

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({
  activities,
  onNavigateTab
}) => {
  const [filterType, setFilterType] = useState<'all' | 'reservation' | 'payment' | 'inquiry'>('all');

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    return act.type === filterType;
  });

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'reservation':
        return <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-700" />;
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-gold-700" />;
      case 'room':
      case 'dorm':
        return <BedDouble className="w-3.5 h-3.5 text-pine-700" />;
      case 'inquiry':
        return <MessageSquare className="w-3.5 h-3.5 text-sky-700" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-700" />;
    }
  };

  const getBadgeStyle = (variant: ActivityEvent['badgeVariant']) => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'danger':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'info':
        return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#fffdfa] border border-gold-200/90 shadow-card flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gold-200/70">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center text-pine-900">
                <History className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-pine-950">
                Recent Operations Feed
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live chronological log of administrative and system events
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-[11px] font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-pine-950 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('reservation')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'reservation'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Bookings
            </button>
            <button
              type="button"
              onClick={() => setFilterType('payment')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'payment'
                  ? 'bg-gold-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-gold-900'
              }`}
            >
              Billing
            </button>
            <button
              type="button"
              onClick={() => setFilterType('inquiry')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'inquiry'
                  ? 'bg-sky-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-sky-900'
              }`}
            >
              Inquiries
            </button>
          </div>
        </div>

        {/* Timeline list */}
        {filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No events logged for this category recently.
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {/* Vertical connector line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gold-200/80 rounded-full" />

            {filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gold-400 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-pine-900" />
                </div>

                <div className="p-3 rounded-2xl bg-stone-50/70 hover:bg-gold-50/50 border border-stone-200/70 hover:border-gold-300 transition-all space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {act.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(act.badgeVariant)} flex-shrink-0`}>
                      {act.badgeText}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    {act.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{act.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (act.type === 'reservation') onNavigateTab('reservations');
                        else if (act.type === 'payment') onNavigateTab('billing');
                        else if (act.type === 'inquiry') onNavigateTab('inquiries');
                        else onNavigateTab('rooms');
                      }}
                      className="font-semibold text-pine-800 hover:text-gold-700 hover:underline cursor-pointer"
                    >
                      Inspect log →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-4 border-t border-gold-200/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">
          Showing real-time property activity
        </span>
        <button
          type="button"
          onClick={() => onNavigateTab('reports')}
          className="font-bold text-pine-900 hover:text-gold-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>View Audit Reports</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
