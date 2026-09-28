import React, { useEffect } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, BedDouble, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MyReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrowseRooms?: () => void;
}

export const MyReservationsModal: React.FC<MyReservationsModalProps> = ({
  isOpen,
  onClose,
  onBrowseRooms
}) => {
  const { user, reservations } = useAuth();

  // Lock background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/75 backdrop-blur-sm animate-fade-in overflow-hidden"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200/90 overflow-hidden transform-gpu flex flex-col max-h-[90vh]">
        
        {/* Pinned Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0 bg-stone-50/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-pine-950">
                My Reservations
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pine-100 text-pine-900 border border-pine-200">
                {reservations.length} {reservations.length === 1 ? 'Booking' : 'Bookings'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Guest Account: <strong>{user?.name || 'Guest'}</strong> ({user?.email})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 hover:text-pine-950 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close reservations modal"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Reservations List */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-slate-400 flex items-center justify-center mx-auto">
                <BedDouble className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-pine-950">
                  No active reservations yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  When you reserve a room or monthly dormitory, your booking details and confirmations will appear here.
                </p>
              </div>
              {onBrowseRooms && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBrowseRooms();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pine-900 hover:bg-pine-950 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Browse Accommodations</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:border-gold-300 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0 border border-stone-200">
                      <img
                        src={res.roomImage}
                        alt={res.roomName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-pine-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {res.reservationCode}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{res.status}</span>
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-pine-950 truncate">
                        {res.roomName}
                      </h4>
                      <p className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-pine-700" />
                          <span>{res.checkInDate} — {res.checkOutDate}</span>
                        </span>
                        <span>•</span>
                        <span>{res.numberOfGuests} Guests</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Rate & Action */}
                  <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end flex-shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Rate</span>
                      <strong className="text-sm sm:text-base font-bold text-pine-900 font-serif">
                        ₱{res.rate.toLocaleString()}
                        <span className="text-xs font-sans font-normal text-slate-600">/{res.ratePeriod}</span>
                      </strong>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Booked on {res.bookedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Assistance Notice */}
          <div className="p-3.5 bg-stone-100/70 rounded-2xl border border-stone-200 text-xs text-slate-600 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-pine-700 flex-shrink-0" />
              <span>Standard Check-in: 2:00 PM • Check-out: 12:00 PM</span>
            </div>
            <a
              href="tel:0917-123-4567"
              className="text-pine-800 hover:text-gold-700 font-bold hover:underline flex-shrink-0"
            >
              Call Front Desk
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
