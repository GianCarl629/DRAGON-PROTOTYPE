import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, Check, Sparkles } from 'lucide-react';
import {
  CursorPreference,
  getCursorPreference,
  setCursorPreference
} from '../../services/cursorService';

interface CursorSettingsProps {
  className?: string;
  compact?: boolean;
}

export const CursorSettingsDropdown: React.FC<CursorSettingsProps> = ({
  className = '',
  compact = false
}) => {
  const [pref, setPref] = useState<CursorPreference>(getCursorPreference);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePrefChange = (e: Event) => {
      const customEvent = e as CustomEvent<CursorPreference>;
      if (customEvent.detail) {
        setPref(customEvent.detail);
      } else {
        setPref(getCursorPreference());
      }
    };

    window.addEventListener('cursorPreferenceChanged', handlePrefChange);
    window.addEventListener('storage', handlePrefChange);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
      window.removeEventListener('cursorPreferenceChanged', handlePrefChange);
      window.removeEventListener('storage', handlePrefChange);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (newPref: CursorPreference) => {
    setPref(newPref);
    setCursorPreference(newPref);
    // Keep open a brief moment for visual confirmation, or close
    setTimeout(() => setIsOpen(false), 160);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Discreet Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-semibold ${
          isOpen
            ? 'bg-pine-900 text-gold-300 border-gold-500/50 shadow-md ring-2 ring-gold-400/20'
            : 'bg-[#fcf7ee] hover:bg-gold-50/80 text-slate-700 hover:text-pine-950 border-gold-300/80 shadow-2xs hover:border-gold-400'
        }`}
        title="Cursor Settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {pref === 'dragon' ? (
          <img
            src="/assets/cursor/dragon-cursor-32.png"
            alt=""
            className="w-4 h-4 object-contain flex-shrink-0"
            aria-hidden="true"
          />
        ) : (
          <MousePointer2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" strokeWidth={2} />
        )}

        <span className="hidden sm:inline">
          {compact ? '' : pref === 'dragon' ? 'Dragon' : 'System'}
        </span>

        {/* Small active indicator dot */}
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            pref === 'dragon' ? 'bg-gold-500 animate-pulse' : 'bg-slate-400'
          }`}
        />
      </button>

      {/* Floating Preferences Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#fffdfa] rounded-2xl shadow-2xl border border-gold-200/90 p-2.5 z-50 animate-fade-in divide-y divide-gold-100/80">
          {/* Header */}
          <div className="px-2 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pine-950 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold-600" />
                <span>Cursor Settings</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Preference</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Customize your pointer browsing experience
            </p>
          </div>

          {/* Options List */}
          <div className="pt-2 space-y-1">
            {/* Dragon Cursor Option */}
            <button
              type="button"
              onClick={() => handleSelect('dragon')}
              className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                pref === 'dragon'
                  ? 'bg-gold-100/60 border border-gold-300/80 shadow-xs'
                  : 'hover:bg-stone-100/70 border border-transparent'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-pine-900/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <img
                  src="/assets/cursor/dragon-cursor-32.png"
                  alt=""
                  className="w-4 h-4 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pine-950">Dragon Cursor</span>
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-full bg-gold-200/90 text-gold-900 border border-gold-300">
                    Default
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                  Signature golden dragon pointer with click state
                </span>
              </div>
              <div className="mt-1 flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    pref === 'dragon'
                      ? 'border-gold-600 bg-gold-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {pref === 'dragon' && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                </div>
              </div>
            </button>

            {/* System Default Option */}
            <button
              type="button"
              onClick={() => handleSelect('system')}
              className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                pref === 'system'
                  ? 'bg-stone-100 border border-slate-300 shadow-xs'
                  : 'hover:bg-stone-100/70 border border-transparent'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-stone-200/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MousePointer2 className="w-3.5 h-3.5 text-slate-600" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-800 block">System Default</span>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                  Standard pointer provided by your operating system
                </span>
              </div>
              <div className="mt-1 flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    pref === 'system'
                      ? 'border-pine-800 bg-pine-800 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {pref === 'system' && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursorSettingsDropdown;
