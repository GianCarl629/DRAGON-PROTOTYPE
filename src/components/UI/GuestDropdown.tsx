import React, { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Check, User } from 'lucide-react';

interface GuestDropdownProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  id?: string;
}

const GUEST_OPTIONS = [
  { count: 1, title: '1 Guest', subtitle: 'Solo Traveler' },
  { count: 2, title: '2 Guests', subtitle: 'Couple / Pair' },
  { count: 3, title: '3 Guests', subtitle: 'Small Group' },
  { count: 4, title: '4 Guests', subtitle: 'Family Room' },
  { count: 6, title: '5-6 Guests', subtitle: 'Group / Family Suite' },
];

export const GuestDropdown: React.FC<GuestDropdownProps> = ({
  value,
  onChange,
  label = 'Guests',
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = GUEST_OPTIONS.find((opt) => opt.count === value) || {
    count: value,
    title: `${value} Guests`,
    subtitle: 'Group Reservation'
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (count: number) => {
    onChange(count);
    setIsOpen(false);
  };

  return (
    <div className="relative space-y-1" ref={containerRef} id={id}>
      {label && (
        <label className="text-xs font-bold text-pine-950 flex items-center gap-1.5 uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
          <span>{label}</span>
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full text-left bg-[#fffdfa] border rounded-2xl px-3.5 py-2.5 transition-all duration-200 flex items-center justify-between gap-2 shadow-xs hover:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 cursor-pointer ${
          isOpen ? 'border-gold-500 ring-2 ring-gold-500/20 shadow-md' : 'border-gold-300/80 hover:border-gold-400'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gold-100 text-pine-900 flex items-center justify-center flex-shrink-0 border border-gold-200/80 shadow-2xs">
            <Users className="w-4 h-4 text-pine-700" strokeWidth={2} />
          </div>
          <div className="truncate">
            <span className="block text-xs sm:text-sm font-bold text-pine-950 truncate">
              {currentOption.title}
            </span>
            <span className="block text-[11px] text-slate-500 font-semibold truncate">
              {currentOption.subtitle}
            </span>
          </div>
        </div>

        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 flex-shrink-0 ${
          isOpen ? 'bg-pine-900 text-gold-300 rotate-180 shadow-xs' : 'bg-gold-50 text-gold-800 border border-gold-300/80'
        }`}>
          <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/98 backdrop-blur-xl border border-stone-200/90 rounded-2xl shadow-luxury p-1.5 space-y-1 animate-fade-in">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-stone-100">
            Party Size / Guests
          </div>
          {GUEST_OPTIONS.map((opt) => {
            const isSelected = opt.count === value;
            return (
              <button
                key={opt.count}
                type="button"
                onClick={() => handleSelect(opt.count)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-pine-900 text-white shadow-xs'
                    : 'hover:bg-stone-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 ${isSelected ? 'text-gold-300' : 'text-slate-400'}`} strokeWidth={2} />
                  <div>
                    <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-white' : 'text-pine-950'}`}>
                      {opt.title}
                    </span>
                    <span className={`text-[11px] block ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                      {opt.subtitle}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-gold-400 text-pine-950 flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
