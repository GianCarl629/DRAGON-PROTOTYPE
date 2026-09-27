import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, Users, Mail, Phone, User, Calendar, BedDouble, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { SAMPLE_ROOMS } from '../../data/mockData';
import { BookingFormData } from '../../types';
import { RoomDropdown } from '../UI/RoomDropdown';
import { GuestDropdown } from '../UI/GuestDropdown';
import { DatePickerInput } from '../UI/DatePickerInput';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedRoomType?: string;
  preCheckIn?: string;
  preCheckOut?: string;
  preGuests?: number;
  onSubmitSuccess: (data: BookingFormData) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedRoomType,
  preCheckIn,
  preCheckOut,
  preGuests,
  onSubmitSuccess
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    roomType: SAMPLE_ROOMS[0].name,
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 2,
    fullName: '',
    contactNumber: '',
    email: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        roomType: preSelectedRoomType || SAMPLE_ROOMS[0].name,
        checkInDate: preCheckIn || '',
        checkOutDate: preCheckOut || '',
        numberOfGuests: preGuests || 2,
        fullName: '',
        contactNumber: '',
        email: '',
        specialRequests: ''
      });
      setErrors({});
      setIsSubmitting(false);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, preSelectedRoomType, preCheckIn, preCheckOut, preGuests]);

  if (!isOpen) return null;

  const currentRoom = SAMPLE_ROOMS.find(r => r.name === formData.roomType) || SAMPLE_ROOMS[0];

  const validate = () => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full guest name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact phone number is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid email address is required';
    }
    if (!formData.roomType) newErrors.roomType = 'Please select a room type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(formData);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden transform-gpu">
        
        {/* Pinned Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gold-500 shadow-glow-gold flex-shrink-0 bg-pine-950">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Logo"
                className="w-full h-full object-cover scale-[1.10]"
              />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-pine-950">
                Reservation Request
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Dragon Treasure Transient & Condotel • Baguio City
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Pinned Selected Room Summary Pill */}
        <div className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-pine-50 via-cream-100 to-pine-50 border-b border-pine-100 flex items-center justify-between text-xs text-pine-950 font-semibold flex-shrink-0">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-pine-700" strokeWidth={2} />
            <span>Selected: {currentRoom.name}</span>
          </div>
          <span className="text-pine-800 font-bold font-serif">{currentRoom.formattedRate}</span>
        </div>

        {/* Scrollable Form Body (Scrollbar strictly contained inside white body) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain flex flex-col justify-between">
          <div className="space-y-4">
          {/* Room Type Luxury Dropdown */}
          <div className="space-y-1">
            <RoomDropdown
              rooms={SAMPLE_ROOMS}
              selectedRoomName={formData.roomType}
              onSelectRoom={(name) => setFormData({ ...formData, roomType: name })}
              label="Room Choice *"
            />
            {errors.roomType && (
              <p className="text-xs text-red-500">{errors.roomType}</p>
            )}
          </div>

          {/* Dates Row with Luxury Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DatePickerInput
              label="Check-in Date"
              value={formData.checkInDate}
              onChange={(date) => {
                const updated: Partial<BookingFormData> = { checkInDate: date };
                if (!formData.checkOutDate || formData.checkOutDate <= date) {
                  const next = new Date(date);
                  next.setDate(next.getDate() + 1);
                  updated.checkOutDate = next.toISOString().split('T')[0];
                }
                setFormData({ ...formData, ...updated });
              }}
              placeholder="Select check-in"
            />
            <DatePickerInput
              label="Check-out Date"
              value={formData.checkOutDate}
              onChange={(date) => setFormData({ ...formData, checkOutDate: date })}
              minDate={formData.checkInDate || new Date().toISOString().split('T')[0]}
              placeholder="Select check-out"
            />
          </div>

          {/* Number of Guests Luxury Dropdown */}
          <GuestDropdown
            value={formData.numberOfGuests}
            onChange={(val) => setFormData({ ...formData, numberOfGuests: val })}
            label="Number of Guests *"
          />

          {/* Guest Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-pine-950 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
              <span>Full Name <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. Juan Dela Cruz"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-pine-700 font-medium transition-all"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Contact & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-pine-950 flex items-center gap-1.5 uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                <span>Contact Number <span className="text-red-500">*</span></span>
              </label>
              <input
                type="tel"
                placeholder="0917-000-0000"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-pine-700 font-medium transition-all"
              />
              {errors.contactNumber && (
                <p className="text-xs text-red-500">{errors.contactNumber}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-pine-950 flex items-center gap-1.5 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                <span>Email Address <span className="text-red-500">*</span></span>
              </label>
              <input
                type="email"
                placeholder="guest@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-pine-700 font-medium transition-all"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-pine-950 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Special Requests or Notes (Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Parking space reservation, estimated arrival time..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-pine-700 resize-none font-medium transition-all"
            />
          </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shimmer-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-95 shadow-md hover:shadow-glow-pine transition-all duration-200 flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-gold-400" strokeWidth={2} />
              <span>{isSubmitting ? 'Submitting Request...' : 'Submit Reservation'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
