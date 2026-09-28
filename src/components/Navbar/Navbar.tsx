import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  CalendarCheck,
  MapPin,
  Sparkles,
  Phone,
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';
import { DEMO_CONTACT } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  onOpenBooking: (roomType?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const {
    isLoggedIn,
    user,
    openAuthModal,
    openReservationsModal,
    openProfileModal,
    logout,
    reservations
  } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active section detection
      const sections = ['home', 'rooms', 'amenities', 'why-us', 'about', 'location', 'faq'];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Rooms', href: '#rooms', id: 'rooms' },
    { name: 'Amenities', href: '#amenities', id: 'amenities' },
    { name: 'Why Us', href: '#why-us', id: 'why-us' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Location', href: '#location', id: 'location' },
    { name: 'FAQs', href: '#faq', id: 'faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'nav-header-scrolled py-2.5 sm:py-3'
          : 'nav-header-top py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Property Brand (flex-shrink-0 to prevent awkward wrapping) */}
          <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-gold-500/90 shadow-md group-hover:scale-105 group-hover:shadow-glow-gold transition-all duration-300 bg-pine-950 flex-shrink-0">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Transient & Condotel Logo"
                className="w-full h-full object-cover scale-[1.10]"
              />
              <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif font-bold text-base sm:text-xl text-pine-950 tracking-tight whitespace-nowrap group-hover:text-pine-800 transition-colors">
                  Dragon Treasure
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 font-medium whitespace-nowrap -mt-0.5">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pine-700 flex-shrink-0" strokeWidth={2} />
                <span>Baguio City, Benguet</span>
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links (with whitespace-nowrap so "Why Us" never wraps) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 bg-[#f5ecdc] rounded-full border border-gold-300/80 shadow-2xs flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap tracking-normal transition-all duration-200 ${
                    isActive
                      ? 'bg-pine-900 text-white shadow-xs'
                      : 'text-slate-700 hover:text-pine-950 hover:bg-white/80'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Auth State + Contact Snippet + Book Now CTA (hidden lg:flex so it matches desktop nav breakpoint) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            
            {/* Authentication UI Controls (Login / Register OR User Menu) */}
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-1 p-0.5 bg-[#f5ecdc] rounded-full border border-gold-300/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-pine-950 hover:bg-white transition-all cursor-pointer whitespace-nowrap"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-bold text-pine-950 bg-gold-200 hover:bg-gold-300 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}

            {/* Front Desk Phone (shown on xl+ matching reference layout) */}
            <a
              href="tel:0917-123-4567"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-cream-200/90 border border-gold-300/80 shadow-2xs hover:text-pine-900 transition-colors whitespace-nowrap"
              title="Call Front Desk: 0917-123-4567"
            >
              <div className="w-5 h-5 rounded-full bg-gold-100 text-pine-800 flex items-center justify-center border border-gold-300/60 flex-shrink-0">
                <Phone className="w-3 h-3 text-pine-700" strokeWidth={2} />
              </div>
              <span>{DEMO_CONTACT.phone}</span>
            </a>

            {/* Main Reservation CTA */}
            <button
              onClick={() => onOpenBooking()}
              className="shimmer-btn inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-sm hover:shadow-glow-pine transition-all duration-300 border border-pine-700/50 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <CalendarCheck className="w-4 h-4 text-gold-400 flex-shrink-0" strokeWidth={2} />
              <span>Book Reservation</span>
            </button>
          </div>

          {/* Mobile Menu Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden flex-shrink-0">
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-pine-900 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 cursor-pointer whitespace-nowrap"
              >
                Log In
              </button>
            ) : (
              <button
                type="button"
                onClick={openProfileModal}
                className="w-8 h-8 rounded-full bg-pine-900 text-gold-300 font-bold flex items-center justify-center text-xs border border-gold-400 flex-shrink-0"
                title="View Profile"
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </button>
            )}

            <button
              onClick={() => onOpenBooking()}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-pine-900 active:scale-95 shadow-xs whitespace-nowrap"
            >
              Book
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-pine-900 hover:bg-stone-100 focus:outline-none transition-colors border border-stone-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-t border-stone-200 px-5 pt-3 pb-6 space-y-3.5 animate-fade-in shadow-xl">
          
          {/* User Status Bar in Mobile Drawer */}
          {isLoggedIn && user ? (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-pine-900 text-gold-300 font-bold flex items-center justify-center text-xs border border-gold-400 flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-pine-950 block truncate">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-stone-100 hover:bg-stone-200 text-center border border-stone-200"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-pine-950 bg-gold-200 hover:bg-gold-300 text-center shadow-2xs"
              >
                Register
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-pine-50 hover:text-pine-950 transition-colors border border-transparent hover:border-pine-100"
              >
                <span className="whitespace-nowrap">{link.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            ))}
          </div>

          {/* Logged-In Mobile Quick Actions */}
          {isLoggedIn && (
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openReservationsModal();
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-stone-50 hover:bg-stone-100 text-center border border-stone-200 flex items-center justify-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-pine-700" />
                <span>My Bookings ({reservations.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openProfileModal();
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-stone-50 hover:bg-stone-100 text-center border border-stone-200 flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-pine-700" />
                <span>My Profile</span>
              </button>
            </div>
          )}

          {/* Mobile Bottom Reservation & Contact */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="shimmer-btn w-full py-3 px-4 rounded-xl text-center text-sm font-semibold text-white bg-pine-900 hover:bg-pine-950 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-gold-400" strokeWidth={2} />
              <span>Book a Reservation</span>
            </button>

            <a
              href="tel:0917-123-4567"
              className="w-full py-2 px-4 rounded-xl text-center text-xs font-semibold text-slate-600 hover:text-pine-900 bg-stone-50 hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 border border-stone-200"
            >
              <Phone className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
              <span>Direct Front Desk: {DEMO_CONTACT.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
