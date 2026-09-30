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
  Clock, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { AdminStoreState } from '../data/adminMockData';
import { CursorSettingsDropdown } from '../../components/UI/CursorSettingsDropdown';

interface AdminLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  adminUsername: string;
  store: AdminStoreState;
  children: React.ReactNode;
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

  const pendingReservationsCount = store.reservations.filter(r => r.status === 'Pending Review').length;
  const newInquiriesCount = store.inquiries.filter(i => i.status === 'New').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck2, badge: pendingReservationsCount },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'dormitory', label: 'Dormitory', icon: Building2 },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, badge: newInquiriesCount },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#faf5ea] text-slate-800 font-sans relative overflow-x-hidden">
      
      {/* Golden Dragon Watermark Centered in the Middle of the Admin Page (matching index.html) */}
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

      {/* SIDEBAR NAVIGATION: Permanently fixed to the left side so scrolling does not scroll or cut the panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 h-screen w-72 bg-pine-950 border-r border-pine-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl flex-shrink-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Top Brand Header */}
          <div className="p-5 border-b border-pine-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gold-400 shadow-glow-gold bg-pine-950 flex items-center justify-center p-0.5 flex-shrink-0">
                <img
                  src="/dragon-treasure-logo.jpg"
                  alt="Dragon Treasure Crest"
                  className="w-full h-full object-cover scale-[1.10]"
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-serif font-bold text-base text-gold-100 truncate">
                  Dragon Treasure
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span className="text-[10px] uppercase font-bold text-gold-300 tracking-wider">
                    Admin Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden w-8 h-8 rounded-lg bg-pine-900 hover:bg-pine-800 text-gold-300 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-gold-300/60 font-bold px-3 py-2">
              Management Menu
            </div>

            {navItems.map((item) => {
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
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-pine-950 text-gold-300' : 'bg-gold-500/20 text-gold-300 border border-gold-400/40'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Footer User Info & Logout (Section 16) */}
          <div className="p-4 border-t border-pine-900 bg-pine-950/90 space-y-3 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-300 font-bold text-xs uppercase">
                {adminUsername.substring(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-stone-200 truncate capitalize">
                  {adminUsername} (Staff Admin)
                </div>
                <div className="text-[10px] text-gold-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
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
              <span>Sign Out of Admin</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-pine-950/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* MAIN CONTENT AREA: Padded by w-72 (md:pl-72) to remain perfectly positioned alongside the fixed sidebar */}
      <div className="md:pl-72 flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-[#fffdfa]/95 backdrop-blur-md border-b border-gold-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-pine-950 flex items-center justify-center cursor-pointer border border-stone-200"
              aria-label="Open mobile menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-gold-700 tracking-wider">
                Administration Portal
              </span>
              <h2 className="text-sm sm:text-base font-serif font-bold text-pine-950 capitalize">
                {activeTab} Overview
              </h2>
            </div>
          </div>

          {/* Right Header Status Strip */}
          <div className="flex items-center gap-3 text-xs">
            {/* Quick Cursor Control */}
            <CursorSettingsDropdown />

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50/80 border border-gold-300 text-pine-950 text-[11px] font-medium shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-pine-700" />
              <span>Baguio City • Front Desk Management</span>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-pine-100 border border-pine-300 text-pine-900 text-[10px] font-bold uppercase tracking-wider">
              Internal Mode
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Footer info note */}
        <footer className="p-4 border-t border-gold-200/60 bg-[#fffdfa]/80 text-center text-[11px] text-slate-500">
          Dragon Treasure Transient & Condotel Administration • Restricted Property Management Console
        </footer>

      </div>

    </div>
  );
};
