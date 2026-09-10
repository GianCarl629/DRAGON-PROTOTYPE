import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, Users, Mail, Phone, User, Calendar, Bed, Sparkles, Info } from 'lucide-react';
import { SAMPLE_ROOMS } from '../../data/mockData';
import { BookingFormData } from '../../types';

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
    }
  }, [isOpen, preSelectedRoomType, preCheckIn, preCheckOut, preGuests]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
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
    // Simulate minor submission delay for natural feel
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(formData);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pine-100 text-pine-800 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5 text-pine-700" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-900">
                Reservation Request
              </h2>
              <p className="text-xs text-slate-500">
                Dragon Treasure Transient & Condotel (Frontend Demo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Notice Banner */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-100 text-xs text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Demo Form: No real reservation is made or charged in this prototype.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Room Type */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-pine-700" />
              Room Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
            >
              {SAMPLE_ROOMS.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name} — {room.formattedRate} ({room.capacityLabel})
                </option>
              ))}
            </select>
            {errors.roomType && (
              <p className="text-xs text-red-500">{errors.roomType}</p>
            )}
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pine-700" />
                Check-in Date
              </label>
              <input
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pine-700" />
                Check-out Date
              </label>
              <input
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
              />
            </div>
          </div>

          {/* Number of Guests */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-pine-700" />
              Number of Guests <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={formData.numberOfGuests}
              onChange={(e) => setFormData({ ...formData, numberOfGuests: Number(e.target.value) })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
            />
          </div>

          {/* Guest Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-pine-700" />
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Juan Dela Cruz"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Contact & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-pine-700" />
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="0917-000-0000"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
              />
              {errors.contactNumber && (
                <p className="text-xs text-red-500">{errors.contactNumber}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-pine-700" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="guest@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Special Requests or Inquiries (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Parking space reservation, estimated arrival time..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-cedar-300" />
              <span>{isSubmitting ? 'Processing...' : 'Submit Booking Request'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
