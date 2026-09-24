import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, X, CalendarCheck, BedDouble, User, Mail, Phone, Calendar } from 'lucide-react';
import { BookingFormData } from '../../types';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingFormData | null;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  onClose,
  bookingData
}) => {
  useEffect(() => {
    if (isOpen && bookingData) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, bookingData]);

  if (!isOpen || !bookingData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200/90 text-center space-y-6">
        
        {/* Success Brand Crest with Check Badge */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold-500 shadow-glow-gold bg-pine-950 animate-pulse-subtle">
            <img
              src="/dragon-treasure-logo.jpg"
              alt="Dragon Treasure Official Logo"
              className="w-full h-full object-cover scale-[1.10]"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>

        {/* Confirmation Headline */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100/80 px-3 py-1 rounded-full border border-gold-300/80">
            Request Confirmed
          </span>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-pine-950 pt-1">
            Booking Request Received
          </h3>
          <p className="text-xs sm:text-sm font-medium text-emerald-900 bg-emerald-50/90 py-2.5 px-4 rounded-2xl border border-emerald-200">
            Booking request submitted successfully! Our front desk staff will review your reservation details and contact you shortly.
          </p>
        </div>

        {/* Summary of submitted request preview */}
        <div className="bg-gradient-to-br from-stone-50 to-cream-50 rounded-2xl p-4 sm:p-5 text-left text-xs sm:text-sm space-y-2.5 border border-stone-200/80">
          <div className="flex justify-between border-b border-stone-200/70 pb-2">
            <span className="text-slate-500 font-medium">Guest Name:</span>
            <span className="font-bold text-pine-950">{bookingData.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-stone-200/70 pb-2">
            <span className="text-slate-500 font-medium">Room Selected:</span>
            <span className="font-bold text-pine-900">{bookingData.roomType}</span>
          </div>
          <div className="flex justify-between border-b border-stone-200/70 pb-2">
            <span className="text-slate-500 font-medium">Dates:</span>
            <span className="font-semibold text-slate-800">
              {bookingData.checkInDate || 'TBD'} to {bookingData.checkOutDate || 'TBD'}
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-200/70 pb-2">
            <span className="text-slate-500 font-medium">Guests:</span>
            <span className="font-semibold text-slate-800">{bookingData.numberOfGuests} Guests</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Contact / Phone:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[210px]">{bookingData.contactNumber}</span>
          </div>
        </div>

        {/* Reassurance Note */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-pine-50 border border-pine-200/80 text-left text-xs text-pine-900">
          <Sparkles className="w-4 h-4 text-gold-600 flex-shrink-0" strokeWidth={2} />
          <span>Thank you for choosing Dragon Treasure. A confirmation message has been prepared for your contact details.</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="shimmer-btn w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 shadow-md transition-all"
        >
          Return to Website
        </button>

      </div>
    </div>
  );
};
