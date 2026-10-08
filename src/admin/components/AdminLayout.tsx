import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  BedDouble, 
  Building2, 
  Receipt, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { AdminStoreState } from '../data/adminMockData';
import { CursorSettingsDropdown } from '../../components/UI/CursorSettingsDropdown';
import { getPhilippineNow } from '../../utils/philippineTime';
import { AdminNotificationsDropdown } from './AdminNotificationsDropdown';

interface AdminLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string, filter?: string) => void;
  onLogout: () => void;
  adminUsername: string;
  store: AdminStoreState;
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavSection {
  heading: string | null;
  items: NavItem[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  adminUsername,
  store,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Real-time Philippine date (display only)
  const [philippineDate, setPhilippineDate] = useState(() => {
    const now = getPhilippineNow();
    return `${now.monthName} ${now.day}, ${now.year}`;
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = getPhilippineNow();
      setPhilippineDate(`${now.monthName} ${now.day}, ${now.year}`);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic counts for notification badges
  const pendingReservationsCount = store.reservations.filter(r => r.status === 'Pending Review').length;
  const newInquiriesCount = store.inquiries.filter(i => i.status === 'New').length;
  const overdueBillingCount = store.billing.filter(b => b.paymentStatus === 'Pending' || b.paymentStatus === 'Overdue').length;

  const handleNavClick = (tabId: string, filter?: string) => {
    onSelectTab(tabId, filter);
    setIsMobileMenuOpen(false);
  };

  // Grouped Navigation Structure as required in Section 23
  const navSections: NavSection[] = [
    {
      heading: null, // Top level
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      heading: 'OPERATIONS',
      items: [
        { id: 'reservations', label: 'Reservations', icon: CalendarCheck2, badge: pendingReservationsCount },
        { id: 'rooms', label: 'Rooms', icon: BedDouble },
        { id: 'dormitory', label: 'Dormitory', icon: Building2 },
      ]
    },
    {
      heading: 'MANAGEMENT',
      items: [
        { id: 'billing', label: 'Billing', icon: Receipt, badge: overdueBillingCount > 0 ? overdueBillingCount : undefined },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, badge: newInquiriesCount },
      ]
    },
    {
      heading: 'ANALYTICS',
      items: [
        { id: 'reports', label: 'Reports', icon: BarChart3 }
      ]
    },
    {
      heading: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  // Dynamic header titles and subtitles
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Overview of Dragon Treasure operations'
        };
      case 'reservations':
        return {
          title: 'Reservations Management',
          subtitle: 'Transient guest bookings, check-in reviews, and calendar schedules'
        };
      case 'rooms':
        return {
          title: 'Room Inventory & Condotel Units',
          subtitle: 'Transient room statuses, pricing tiers, and maintenance logging'
        };
      case 'dormitory':
        return {
          title: 'Dormitory Accommodation',
          subtitle: 'Long-term bed allocations, wing distributions, and student tenant contracts'
        };
      case 'billing':
        return {
          title: 'Billing & Invoicing Console',
          subtitle: 'Settlements for transient stays, monthly rent, utilities, and security deposits'
        };
      case 'customers':
        return {
          title: 'Customer Directory',
          subtitle: 'Guest profiles, stay frequency, and concierge loyalty histories'
        };
      case 'inquiries':
        return {
          title: 'Guest Inquiries & Concierge',
          subtitle: 'Inbound message requests, rate inquiries, and front-desk dispatch'
        };
      case 'reports':
        return {
          title: 'Financial & Operational Reports',
          subtitle: 'Detailed revenue statements, occupancy analytics, and audit exports'
        };
      case 'settings':
        return {
          title: 'Property Settings',
          subtitle: 'Administrative credentials, database controls, and system parameters'
        };
      default:
        return {
          title: 'Administration Portal',
          subtitle: 'Dragon Treasure Condotel & Dormitory Management'
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#faf5ea] text-slate-800 font-sans relative overflow-x-hidden">
      
      {/* Golden Dragon Watermark Centered in the Middle of the Admin Page */}
      <div 
        className="fixed top-1/2 left-1/2 md:left-[calc(50%+9rem)] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] sm:w-[620px] sm:h-[620px] lg:w-[720px] lg:h-[720px] pointer-events-none select-none flex items-center justify-center opacity-20 z-0"
      >
        <img
          src="/golden-dragon-watermark.png"
          alt="Dragon Treasure Watermark"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Atmospheric Background Glows */}
      <div className="fixed top-0 right-0 z-0 w-[550px] h-[550px] bg-gradient-to-br from-gold-200/30 via-pine-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 z-0 w-[500px] h-[500px] bg-gradient-to-tr from-cedar-200/30 via-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* SIDEBAR NAVIGATION: Permanently fixed to the left side */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 h-screen w-72 max-w-[85vw] bg-pine-950 border-r border-pine-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl flex-shrink-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Header: Permanently sticks to the top of the side panel */}
        <div className="sticky top-0 z-30 p-4 sm:p-5 border-b border-pine-900/90 bg-pine-950/95 backdrop-blur-md flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-gold-400 shadow-glow-gold bg-pine-950 flex items-center justify-center p-0.5 flex-shrink-0">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Crest"
                className="w-full h-full object-cover scale-[1.10]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-serif font-bold text-sm sm:text-base text-gold-100 truncate">
                Dragon Treasure
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-gold-300 tracking-wider truncate">
                  Property Operations
                </span>
              </div>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg bg-pine-900 hover:bg-pine-800 text-gold-300 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links Grouped Hierarchically: Scrollable middle section */}
        <nav className="p-3 sm:p-3.5 space-y-3 sm:space-y-4 flex-1 overflow-y-auto min-h-0">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.heading && (
                <div className="text-[10px] uppercase tracking-wider text-gold-400/60 font-bold px-3 pt-2 pb-1">
                  {section.heading}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md font-bold'
                        : 'text-stone-300 hover:text-white hover:bg-pine-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gold-400/80'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && item.badge > 0 ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive 
                          ? 'bg-pine-950 text-gold-300' 
                          : 'bg-gold-500/20 text-gold-300 border border-gold-400/40'
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer User Info & Logout (Section 23): Permanently sticks to the bottom of the side panel */}
        <div className="sticky bottom-0 z-30 p-3 sm:p-4 border-t border-pine-900 bg-pine-950/95 backdrop-blur-md space-y-2.5 sm:space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-300 font-bold text-xs uppercase">
              {adminUsername.substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-stone-200 truncate capitalize">
                {adminUsername} (Staff Admin)
              </div>
              <div className="text-[10px] text-gold-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Session Active</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-pine-900/90 hover:bg-red-950 hover:border-red-400/50 text-red-200 border border-pine-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-pine-950/70 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* MAIN CONTENT AREA: Padded by w-72 (md:pl-72) */}
      <div className="md:pl-72 flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-[#fffdfa]/95 backdrop-blur-md border-b border-gold-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shadow-2xs gap-2">
          {/* Left: Mobile Toggle & Title + Contextual Subtitle */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-pine-950 flex items-center justify-center cursor-pointer border border-stone-200 flex-shrink-0"
              aria-label="Open mobile menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base lg:text-lg font-serif font-bold text-pine-950 leading-tight truncate">
                {headerInfo.title}
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                {headerInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right Header Controls: Realtime PHT Calendar, 10x Notifications, Cursor, Admin Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs flex-shrink-0">
            {/* Real-time Philippine Date (Display only) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50/80 border border-gold-300 text-pine-950 text-[11px] font-medium shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-pine-700" />
              <span>{philippineDate}</span>
            </div>

            {/* 10x Operational Alerts & Notification Dropdown */}
            <AdminNotificationsDropdown
              store={store}
              onNavigateTab={(tab, filter) => onSelectTab(tab, filter)}
            />

            {/* Quick Cursor Control: hidden on small mobile to preserve touch real estate */}
            <div className="hidden sm:block">
              <CursorSettingsDropdown />
            </div>

            {/* Admin Profile Pill / Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2 sm:pr-2.5 rounded-full bg-white hover:bg-gold-50/80 border border-stone-200 hover:border-gold-300 transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-pine-950 text-gold-300 font-bold text-[10px] flex items-center justify-center uppercase">
                  {adminUsername.substring(0, 2)}
                </div>
                <span className="text-xs font-bold text-pine-950 capitalize hidden sm:inline">
                  {adminUsername}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#fffdfa] rounded-2xl border-2 border-gold-300 shadow-xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-gold-200/80">
                    <div className="font-bold text-xs text-pine-950 capitalize">{adminUsername}</div>
                    <div className="text-[10px] text-slate-500">Front Desk Manager</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onSelectTab('settings');
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-gold-50 rounded-lg cursor-pointer"
                  >
                    System Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Page Content: generous bottom padding on mobile for bottom bar */}
        <main className="p-3.5 sm:p-6 lg:p-8 flex-1 overflow-y-auto pb-24 md:pb-8">
          {children}
        </main>

        {/* Footer info note */}
        <footer className="p-4 border-t border-gold-200/60 bg-[#fffdfa]/80 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 gap-2 pb-20 md:pb-4">
          <span>Dragon Treasure Transient & Condotel Administration • Baguio City</span>
          <span className="text-slate-400">Restricted Property Management Console</span>
        </footer>

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR: Native-like bottom bar for phones & touch devices */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-[#fffdfa]/95 backdrop-blur-md border-t border-gold-300 md:hidden shadow-2xl px-2 py-1.5 flex items-center justify-around safe-area-bottom">
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-pine-950 font-bold bg-gold-200/60 shadow-xs'
              : 'text-slate-600 hover:text-pine-950'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('reservations')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'reservations'
              ? 'text-pine-950 font-bold bg-gold-200/60 shadow-xs'
              : 'text-slate-600 hover:text-pine-950'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Bookings</span>
          {pendingReservationsCount > 0 && (
            <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-1 ring-white" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('rooms')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'rooms'
              ? 'text-pine-950 font-bold bg-gold-200/60 shadow-xs'
              : 'text-slate-600 hover:text-pine-950'
          }`}
        >
          <BedDouble className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Rooms</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('inquiries')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'text-pine-950 font-bold bg-gold-200/60 shadow-xs'
              : 'text-slate-600 hover:text-pine-950'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Inquiries</span>
          {newInquiriesCount > 0 && (
            <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-1 ring-white" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            !['dashboard', 'reservations', 'rooms', 'inquiries'].includes(activeTab)
              ? 'text-pine-950 font-bold bg-gold-200/60 shadow-xs'
              : 'text-slate-600 hover:text-pine-950'
          }`}
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

    </div>
  );
};
