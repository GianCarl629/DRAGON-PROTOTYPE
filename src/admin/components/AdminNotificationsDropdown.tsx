import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  CalendarCheck2, 
  DollarSign, 
  MessageSquare, 
  BedDouble, 
  X, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Idinagdag ang Supabase

interface AdminNotificationsDropdownProps {
  onNavigateTab: (tab: string, filter?: string) => void;
  // Tinanggal na natin ang 'store' prop kasi sa Supabase na tayo kukuha
}

interface NotificationItem {
  id: string;
  category: 'reservations' | 'billing' | 'inquiries' | 'rooms';
  urgency: 'high' | 'medium' | 'info';
  title: string;
  description: string;
  time: string;
  actionLabel: string;
  targetTab: string;
  targetFilter?: string;
  metaBadge?: string;
}

export const AdminNotificationsDropdown: React.FC<AdminNotificationsDropdownProps> = ({
  onNavigateTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'reservations' | 'billing' | 'inquiries' | 'rooms'>('all');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // MGA LIVE STATE PARA SA SUPABASE
  const [pendingReservations, setPendingReservations] = useState<any[]>([]);
  const [maintenanceRooms, setMaintenanceRooms] = useState<any[]>([]);

  // Fetch live notifications from Supabase
  const fetchNotifications = async () => {
    // 1. Kunin ang mga Pending Reservations
    const { data: resData } = await supabase
      .from('reservations')
      .select('*')
      .eq('status', 'Pending Review');
    
    if (resData) setPendingReservations(resData);

    // 2. Kunin ang mga naka-Maintenance na kwarto
    const { data: roomData } = await supabase
      .from('room_units')
      .select('*')
      .eq('status', 'Maintenance');
    
    if (roomData) setMaintenanceRooms(roomData);
  };

  useEffect(() => {
    fetchNotifications();
    
    // Optional: Pwede mong i-set na mag-refresh ito every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
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

  // Build specific, actionable notification records from live database
  const allNotifications: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];

    // 1. Pending Reservations (Galing sa Supabase)
    pendingReservations.forEach(r => {
      list.push({
        id: `notif-res-${r.id}`,
        category: 'reservations',
        urgency: 'high',
        title: `Reservation Request: ${r.guest_name}`,
        description: `${r.room_type || 'Room'} • ${r.number_of_guests} Pax • ${r.check_in_date} to ${r.check_out_date} (₱${Number(r.total_price).toLocaleString()})`,
        time: 'Pending',
        actionLabel: 'Review & Confirm',
        targetTab: 'reservations',
        targetFilter: 'Pending Review',
        metaBadge: 'Pending Review'
      });
    });

    // 2. Maintenance Rooms (Galing sa Supabase)
    maintenanceRooms.forEach(r => {
      list.push({
        id: `notif-room-${r.id}`,
        category: 'rooms',
        urgency: 'info',
        title: `Maintenance Flag: ${r.room_number}`,
        description: `${r.floor || ''} - Status flagged for caretaker inspection and housekeeping`,
        time: 'Active Maintenance',
        actionLabel: 'Inspect Room',
        targetTab: 'rooms',
        targetFilter: 'Maintenance',
        metaBadge: 'Maintenance'
      });
    });

    return list;
  }, [pendingReservations, maintenanceRooms]);

  // Active un-dismissed items
  const activeNotifications = allNotifications.filter(item => !dismissedIds.has(item.id));

  // Count by category
  const counts = {
    all: activeNotifications.length,
    reservations: activeNotifications.filter(i => i.category === 'reservations').length,
    billing: activeNotifications.filter(i => i.category === 'billing').length,
    inquiries: activeNotifications.filter(i => i.category === 'inquiries').length,
    rooms: activeNotifications.filter(i => i.category === 'rooms').length,
  };

  const filteredNotifications = activeNotifications.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleMarkAllRead = () => {
    setDismissedIds(new Set(allNotifications.map(i => i.id)));
  };

  const handleAction = (item: NotificationItem) => {
    setIsOpen(false);
    onNavigateTab(item.targetTab, item.targetFilter);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-stone-100 hover:bg-stone-200/90 text-pine-950 flex items-center justify-center cursor-pointer border border-stone-200/80 transition-all shadow-2xs group"
        aria-label="View notifications and operational alerts"
        title="Operational Alerts"
      >
        <Bell className="w-4 h-4 text-slate-700 group-hover:scale-110 group-hover:text-pine-900 transition-transform" />
        
        {counts.all > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
            {counts.all}
          </span>
        )}
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="fixed inset-x-2 top-14 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-[420px] max-w-[calc(100vw-1rem)] bg-[#fffdfa] rounded-3xl border-2 border-gold-300 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[80vh]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-stone-50 to-[#fffdfa] border-b border-gold-200/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gold-100 border border-gold-300 flex items-center justify-center text-pine-900 shadow-xs">
                  <Bell className="w-4 h-4 text-pine-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-pine-950 leading-tight">
                      Operational Alerts
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {counts.all} Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Live dispatch, bookings, billing, and concierge
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {counts.all > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="p-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:text-pine-950 hover:bg-gold-100 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Mark all as resolved"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline">Mark All</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleSound}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-stone-200/70 transition-colors cursor-pointer"
                  title={soundEnabled ? 'Alert chimes on' : 'Alert chimes muted'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-pine-800" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-200/70 transition-colors cursor-pointer"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-pine-950 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                All ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('reservations')}
                className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'reservations'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                Bookings ({counts.reservations})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('rooms')}
                className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'rooms'
                    ? 'bg-purple-800 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                Rooms ({counts.rooms})
              </button>
            </div>
          </div>

          {/* Notifications Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 max-h-[380px] divide-y divide-stone-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-pine-950">
                    All Caught Up!
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">
                    {activeFilter === 'all'
                      ? 'No pending operational alerts. Everything is currently operating smoothly.'
                      : `No active alerts found in the "${activeFilter}" category.`}
                  </p>
                </div>
              </div>
            ) : (
              filteredNotifications.map(item => {
                const iconMap = {
                  reservations: <CalendarCheck2 className="w-4 h-4 text-emerald-700" />,
                  inquiries: <MessageSquare className="w-4 h-4 text-sky-700" />,
                  billing: <DollarSign className="w-4 h-4 text-amber-700" />,
                  rooms: <BedDouble className="w-4 h-4 text-purple-700" />,
                };

                const bgMap = {
                  reservations: 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-50',
                  inquiries: 'bg-sky-50/70 border-sky-200/80 hover:bg-sky-50',
                  billing: 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-50',
                  rooms: 'bg-purple-50/70 border-purple-200/80 hover:bg-purple-50',
                };

                const urgencyBadgeColor = {
                  high: 'bg-rose-100 text-rose-800 border-rose-300',
                  medium: 'bg-amber-100 text-amber-900 border-amber-300',
                  info: 'bg-slate-100 text-slate-800 border-slate-300',
                }[item.urgency];

                return (
                  <div
                    key={item.id}
                    onClick={() => handleAction(item)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3 pt-3 ${bgMap[item.category]}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-stone-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {iconMap[item.category]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-pine-900 transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        
                        <button
                          type="button"
                          onClick={(e) => handleDismiss(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all flex-shrink-0 cursor-pointer"
                          title="Dismiss alert"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/5 text-[10px]">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.time}</span>
                          {item.metaBadge && (
                            <span className={`px-1.5 py-0.2 rounded-md font-bold border ${urgencyBadgeColor}`}>
                              {item.metaBadge}
                            </span>
                          )}
                        </div>

                        <span className="font-bold text-pine-900 group-hover:underline flex items-center gap-1 flex-shrink-0">
                          <span>{item.actionLabel}</span>
                          <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-stone-50 border-t border-gold-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium">
              Front Desk Concierge Dispatch
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onNavigateTab('dashboard');
              }}
              className="font-bold text-pine-900 hover:underline cursor-pointer"
            >
              View Activity Timeline →
            </button>
          </div>

        </div>
      )}
    </div>
  );
};