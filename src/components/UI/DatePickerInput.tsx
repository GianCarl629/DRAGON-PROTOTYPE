import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DatePickerInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  placeholder?: string;
  id?: string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChange,
  minDate = new Date().toISOString().split('T')[0],
  placeholder = 'Select date',
  id
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const openCalendar = () => {
    if (!inputRef.current) return;
    try {
      if ('showPicker' in HTMLInputElement.prototype) {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
        inputRef.current.click();
      }
    } catch {
      inputRef.current.focus();
      inputRef.current.click();
    }
  };

  // Format readable display date (e.g., "Thu, Oct 15, 2026")
  const formatReadableDate = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const readableDate = formatReadableDate(value);

  return (
    <div className="relative space-y-1" id={id}>
      <label className="text-xs font-bold text-pine-950 flex items-center gap-1.5 uppercase tracking-wider">
        <Calendar className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
        <span>{label}</span>
      </label>

      {/* Styled Interactive Card with full clickable trigger */}
      <button
        type="button"
        onClick={openCalendar}
        className="relative w-full text-left bg-[#fffdfa] border border-gold-300/80 rounded-2xl px-3.5 py-2.5 transition-all duration-200 flex items-center justify-between gap-2 shadow-xs hover:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 cursor-pointer group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gold-100 text-pine-900 flex items-center justify-center flex-shrink-0 border border-gold-200/80 group-hover:bg-gold-200/80 transition-colors shadow-2xs">
            <Calendar className="w-4 h-4 text-pine-700" strokeWidth={2} />
          </div>
          <div className="truncate">
            {readableDate ? (
              <>
                <span className="block text-xs sm:text-sm font-bold text-pine-950 truncate">
                  {readableDate}
                </span>
                <span className="block text-[10px] text-gold-800 font-bold">
                  Date Selected
                </span>
              </>
            ) : (
              <>
                <span className="block text-xs sm:text-sm font-medium text-slate-500 truncate">
                  {placeholder}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  Tap to choose date
                </span>
              </>
            )}
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-gold-50 group-hover:bg-gold-100 text-gold-800 border border-gold-300/80 flex items-center justify-center transition-colors flex-shrink-0 shadow-2xs">
          <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>

        {/* Hidden Native Date Input Triggered via showPicker */}
        <input
          ref={inputRef}
          type="date"
          min={minDate}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          aria-label={label}
        />
      </button>
    </div>
  );
};
