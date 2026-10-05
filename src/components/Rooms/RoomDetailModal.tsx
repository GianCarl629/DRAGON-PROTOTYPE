import React, { useEffect } from 'react';
import { X, Users, Check, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Room } from '../../types';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onBook: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose, onBook }) => {
  useEffect(() => {
    if (!room) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [room]);

  if (!room) return null;

  const isDorm = room.category === 'dormitory';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in overflow-hidden">
      {/* Outer Modal Container with strict overflow-hidden so nothing surpasses rounded corners */}
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden transform-gpu">
        
        {/* Pinned Modal Header Image with Title & Close Button */}
        <div className="relative h-48 sm:h-60 bg-stone-900 flex-shrink-0">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950/90 via-black/25 to-black/20" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-md shadow-md z-10 cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Header Title Overlay */}
          {/* Header Title Overlay */}
          <div className="absolute bottom-3.5 left-5 right-5 text-white">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pine-900/90 border border-gold-500/40 text-gold-300 backdrop-blur-md shadow-xs">
                {isDorm ? 'Monthly Dormitory Rental' : 'Short-Term Transient Lodging'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold mt-1 text-white leading-tight">
              {room.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 overscroll-contain">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-stone-50 to-cream-100 border border-stone-200/80">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Rate</span>
              <span className="text-base sm:text-lg font-bold text-pine-950 font-serif block mt-0.5">
                ₱{room.rate.toLocaleString()} <span className="text-xs font-normal text-slate-600 font-sans">/ {room.ratePeriod}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Capacity</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                <Users className="w-4 h-4 text-pine-700" strokeWidth={2} />
                <span>{room.capacityLabel}</span>
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Availability</span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-800 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{room.sampleQuantity} units ready</span>
              </span>
            </div>
          </div>


          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-pine-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" strokeWidth={2} />
              <span>Room Overview & Vibe</span>
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Inclusions & Room Amenities */}
          <div>
            <h3 className="text-xs font-bold text-pine-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
              <span>Room Amenities & Inclusions</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {room.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div className="w-4 h-4 rounded-full bg-pine-100 text-pine-800 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-700" strokeWidth={3} />
                  </div>
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Amenities (Common Area per Unit) */}
          {room.sharedAmenities && room.sharedAmenities.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold text-pine-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-700" strokeWidth={2} />
                <span>Shared Amenities (Common Area per Unit)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {room.sharedAmenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 p-2.5 rounded-xl bg-gold-50/60 border border-gold-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-600 flex-shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Pinned Bottom Action Bar (Convenient, never gets lost) */}
        <div className="p-4 sm:px-6 py-3.5 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-3 flex-shrink-0">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rate</p>
            <p className="font-serif font-bold text-lg text-pine-950 leading-tight">
              ₱{room.rate.toLocaleString()} <span className="text-xs font-normal text-slate-600 font-sans">/ {room.ratePeriod}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-stone-200/80 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(room);
              }}
              className="shimmer-btn px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-95 shadow-md hover:shadow-glow-pine transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-gold-400" strokeWidth={2} />
              <span>Book This Room</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
