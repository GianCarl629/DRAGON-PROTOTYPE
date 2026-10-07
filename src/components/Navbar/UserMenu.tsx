import React, { useState, useRef, useEffect } from 'react';
import { User, CalendarCheck, LogOut, ChevronDown, Award, MousePointer2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CursorPreference, getCursorPreference, setCursorPreference } from '../../services/cursorService';

export const UserMenu: React.FC = () => {
  const { user, logout, openReservationsModal, openProfileModal, reservations } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [cursorPref, setCursorPref] = useState<CursorPreference>(getCursorPreference);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCursorChange = (e: Event) => {
      const customEvent = e as CustomEvent<CursorPreference>;
      if (customEvent.detail) {
        setCursorPref(customEvent.detail);
      } else {
        setCursorPref(getCursorPreference());
      }
    };
    window.addEventListener('cursorPreferenceChanged', handleCursorChange);
    return () => window.removeEventListener('cursorPreferenceChanged', handleCursorChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  if (!user) return null;

  const firstName = user.name.split(' ')[0] || user.name;
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* User Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer flex-shrink-0 ${
          isOpen
            ? 'bg-pine-900 text-white border-pine-800 shadow-md ring-2 ring-gold-400/20'
            : 'bg-[#fffdfa] hover:bg-gold-50/60 text-pine-950 border-gold-300/90 shadow-2xs hover:border-gold-400'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pine-900 to-pine-800 text-gold-300 font-serif font-bold text-xs flex items-center justify-center border border-gold-400/80 flex-shrink-0 shadow-2xs">
          {initial}
        </div>
        <span className="text-xs font-bold max-w-[100px] truncate text-pine-950">
          Hi, {firstName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gold-400' : 'text-slate-400'
          }`}
          strokeWidth={2.5}
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#fffdfa] rounded-2xl shadow-2xl border border-gold-200/90 p-2 z-50 animate-fade-in divide-y divide-gold-100/80">
          
          {/* Header Section: User Details */}
          <div className="px-3 py-2.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-pine-950 block truncate">
                {user.name}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300/80 flex items-center gap-1">
                <Award className="w-2.5 h-2.5 text-gold-700" />
                <span>Member</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block truncate mt-0.5">
              {user.email}
            </span>
          </div>

          {/* Action Links */}
          <div className="py-1.5 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openReservationsModal();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-pine-950 hover:bg-stone-100/80 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-pine-700 group-hover:text-gold-600 transition-colors" />
                <span>Client Dashboard</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-pine-100 text-pine-900">
                {reservations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openProfileModal();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-pine-950 hover:bg-stone-100/80 transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <User className="w-4 h-4 text-pine-700 group-hover:text-gold-600 transition-colors" />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                const el = document.getElementById('inquire');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-pine-950 hover:bg-stone-100/80 transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-pine-700 group-hover:text-gold-600 transition-colors" />
              <span>Send Concierge Inquiry</span>
            </button>
          </div>

          {/* Preferences: Cursor Style */}
          <div className="py-2 px-3 bg-stone-50/70 rounded-xl my-1 border border-stone-200/60">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
              <span>Cursor Style</span>
              <span className="text-[10px] font-bold text-pine-900">
                {cursorPref === 'dragon' ? 'Dragon' : 'System'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setCursorPref('dragon');
                  setCursorPreference('dragon');
                }}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  cursorPref === 'dragon'
                    ? 'bg-gold-200 text-pine-950 font-bold shadow-2xs border border-gold-300'
                    : 'bg-white text-slate-600 hover:text-pine-950 border border-slate-200'
                }`}
              >
                <img src="/assets/cursor/dragon-cursor-32.png" alt="" className="w-3.5 h-3.5 object-contain" />
                <span>Dragon</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCursorPref('system');
                  setCursorPreference('system');
                }}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  cursorPref === 'system'
                    ? 'bg-pine-900 text-white font-bold shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-pine-950 border border-slate-200'
                }`}
              >
                <MousePointer2 className="w-3 h-3 text-slate-400" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Logout Action */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
