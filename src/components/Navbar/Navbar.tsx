import React, { useState, useEffect } from 'react';
import { Menu, X, CalendarCheck, MapPin, Sparkles, Phone, ChevronRight } from 'lucide-react';
import { DEMO_CONTACT } from '../../data/mockData';

interface NavbarProps {
  onOpenBooking: (roomType?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'glass-nav shadow-elevated py-2.5 sm:py-3 border-b border-stone-200/70'
          : 'bg-white/80 backdrop-blur-md py-3.5 sm:py-4 border-b border-stone-200/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Property Brand */}
          <a href="#home" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gold-500/90 shadow-md group-hover:scale-105 group-hover:shadow-glow-gold transition-all duration-300 bg-pine-950 flex-shrink-0">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Transient & Condotel Logo"
                className="w-full h-full object-cover scale-[1.10]"
              />
              <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl text-pine-950 tracking-tight group-hover:text-pine-800 transition-colors">
                  Dragon Treasure
                </span>
                <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-gold-500" />
                <span className="hidden md:inline-block text-[11px] font-semibold uppercase tracking-wider text-gold-700">
                  Condotel
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 font-medium tracking-normal">
                <MapPin className="w-3.5 h-3.5 text-pine-700 flex-shrink-0" strokeWidth={2} />
                <span>Baguio City, Benguet</span>
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 bg-stone-100/70 rounded-full border border-stone-200/60 shadow-xs">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-pine-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-pine-950 hover:bg-white/80'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Contact Snippet + Book Now CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:0917-123-4567"
              className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-pine-900 hover:bg-stone-100 transition-colors"
              title="Call Front Desk"
            >
              <div className="w-7 h-7 rounded-lg bg-pine-50 text-pine-800 flex items-center justify-center border border-pine-100">
                <Phone className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
              <span>{DEMO_CONTACT.phone}</span>
            </a>

            <button
              onClick={() => onOpenBooking()}
              className="shimmer-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-sm hover:shadow-glow-pine transition-all duration-300 border border-pine-700/50"
            >
              <CalendarCheck className="w-4 h-4 text-gold-400" strokeWidth={2} />
              <span>Book Reservation</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
            <button
              onClick={() => onOpenBooking()}
              className="sm:hidden px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-pine-900 active:scale-95 shadow-xs"
            >
              Book
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-pine-900 hover:bg-stone-100 focus:outline-none transition-colors border border-stone-200"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-stone-200 px-5 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="px-3.5 py-2 bg-gradient-to-r from-pine-50 to-cream-100 rounded-xl text-xs text-pine-900 font-medium flex items-center justify-between border border-pine-100/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600 flex-shrink-0" strokeWidth={2} />
              <span>Dragon Treasure • Baguio City</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-pine-700">Open 24/7</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-pine-50 hover:text-pine-950 transition-colors border border-transparent hover:border-pine-100"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-2">
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
