import React from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
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
  if (!isOpen || !bookingData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6">
        
        {/* Success Brand Crest with Check Badge */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500 shadow-elevated bg-pine-950">
            <img
              src="/dragon-treasure-logo.jpg"
              alt="Dragon Treasure Official Logo"
              className="w-full h-full object-cover scale-[1.09]"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        {/* Required Confirmation Headline & Message */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-2xl text-pine-950">
            Booking Request Received
          </h3>
          <p className="text-sm font-medium text-emerald-800 bg-emerald-50 py-2 px-4 rounded-xl border border-emerald-200">
            Booking request submitted successfully. This is a prototype and does not yet create a real reservation.
          </p>
        </div>

        {/* Summary of submitted request preview */}
        <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs sm:text-sm space-y-2 border border-slate-200/80">
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Guest Name:</span>
            <span className="font-semibold text-slate-800">{bookingData.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Room Selected:</span>
            <span className="font-semibold text-pine-900">{bookingData.roomType}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Dates:</span>
            <span className="font-semibold text-slate-800">
              {bookingData.checkInDate || 'TBD'} to {bookingData.checkOutDate || 'TBD'}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Guests:</span>
            <span className="font-semibold text-slate-800">{bookingData.numberOfGuests} Guests</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Contact / Email:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">{bookingData.contactNumber} • {bookingData.email}</span>
          </div>
        </div>

        {/* Prototype Alert Notice */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>No payment was charged and no database record was created. This concludes the frontend reservation flow demonstration.</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 shadow transition-all"
        >
          Return to Website
        </button>

      </div>
    </div>
  );
};
