import React, { useState, useEffect } from 'react';
import { Menu, X, CalendarCheck, MapPin, Sparkles } from 'lucide-react';
import { PROPERTY_INFO } from '../../data/mockData';

interface NavbarProps {
  onOpenBooking: (roomType?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'About', href: '#about' },
    { name: 'Location', href: '#location' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100'
          : 'bg-white/80 backdrop-blur-sm py-4 border-b border-pine-900/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Property Brand */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pine-800 to-pine-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="font-serif font-bold text-lg text-cedar-300">DT</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl text-pine-950 tracking-tight">
                  Dragon Treasure
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cedar-100 text-cedar-800 border border-cedar-200">
                  Prototype
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-pine-600" />
                Transient & Condotel • Baguio City
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-pine-800 hover:bg-pine-50/80 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Book Now CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow-sm hover:shadow transition-all"
            >
              <CalendarCheck className="w-4 h-4 text-cedar-300" />
              <span>Book Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
            <button
              onClick={() => onOpenBooking()}
              className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-pine-800 active:scale-95 shadow-sm"
            >
              Book
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-pine-800 hover:bg-pine-50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
          <div className="px-3 py-2 mb-2 bg-pine-50/80 rounded-lg text-xs text-pine-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cedar-600 flex-shrink-0" />
            <span>Capstone Prototype • Mock Booking & Lodging View</span>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-pine-50 hover:text-pine-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 shadow transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-cedar-300" />
              <span>Book a Reservation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
