import React, { useEffect } from 'react';
import { X, Users, Check, CalendarCheck, BedDouble, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200/90 flex flex-col">
        {/* Modal Header Image */}
        <div className="relative h-64 sm:h-76 bg-stone-900 flex-shrink-0">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950/90 via-black/30 to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/85 transition-colors border border-white/20 backdrop-blur-md shadow-md z-10"
            aria-label="Close details"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Header Title Overlay */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-pine-900/90 border border-gold-500/40 text-gold-300 backdrop-blur-md shadow-xs">
              {isDorm ? 'Monthly Dormitory Rental' : 'Short-Term Transient Lodging'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1.5 text-white leading-tight">
              {room.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-50 to-cream-100 border border-stone-200/80">
            <div>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Rate</span>
              <span className="text-lg font-bold text-pine-950 font-serif block mt-0.5">
                ₱{room.rate.toLocaleString()} <span className="text-xs font-normal text-slate-600 font-sans">/ {room.ratePeriod}</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Capacity</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                <Users className="w-4 h-4 text-pine-700" strokeWidth={2} />
                <span>{room.capacityLabel}</span>
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Availability</span>
              <span className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{room.sampleQuantity} rooms available</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-pine-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" strokeWidth={2} />
              <span>Room Overview</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Inclusions & Amenities */}
          <div>
            <h3 className="text-xs font-bold text-pine-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
              <span>Included Amenities & Features</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 p-2 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="w-5 h-5 rounded-full bg-pine-100 text-pine-800 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                  </div>
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Total Rate</p>
              <p className="font-serif font-bold text-xl text-pine-950">
                ₱{room.rate.toLocaleString()} <span className="text-xs font-normal text-slate-600 font-sans">/ {room.ratePeriod}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-stone-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBook(room);
                }}
                className="shimmer-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-95 shadow-md hover:shadow-glow-pine transition-all duration-200 flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-gold-400" strokeWidth={2} />
                <span>Book This Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
