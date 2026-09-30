import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  BedDouble, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  XCircle,
  Trash2,
  AlertTriangle,
  AlertCircle,
  User,
  Mail,
  Phone,
  FileText,
  Copy,
  Check,
  Eye,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CONTACT } from '../../data/mockData';

interface MyReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrowseRooms?: () => void;
}

const COMMON_CANCELLATION_REASONS = [
  'Change in travel plans or dates',
  'Unexpected medical or personal emergency',
  'Severe weather / travel advisory in Baguio',
  'Found alternative lodging or accommodation',
  'Accidentally booked incorrect dates or room type',
  'Transportation or flight/bus scheduling issues',
  'Financial or budget considerations',
  'Others (please specify)'
];

export const MyReservationsModal: React.FC<MyReservationsModalProps> = ({
  isOpen,
  onClose,
  onBrowseRooms
}) => {
  const { user, reservations, cancelReservation, deleteReservation } = useAuth();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReasonText, setOtherReasonText] = useState<string>('');
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

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

  const toggleDetails = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCancel = (id: string) => {
    setCancellingId(id);
    setSelectedReason('');
    setOtherReasonText('');
    setCancelError(null);
  };

  const handleDismissCancel = () => {
    setCancellingId(null);
    setSelectedReason('');
    setOtherReasonText('');
    setCancelError(null);
  };

  const handleConfirmCancel = (id: string, reservationCode: string) => {
    if (!selectedReason) {
      setCancelError('Please select a cancellation reason from the list.');
      return;
    }
    if (selectedReason === 'Others (please specify)' && !otherReasonText.trim()) {
      setCancelError('Please provide details for your cancellation in the text box below.');
      return;
    }

    const finalReason =
      selectedReason === 'Others (please specify)'
        ? `Others: ${otherReasonText.trim()}`
        : selectedReason;

    cancelReservation(id, finalReason);
    setCancellingId(null);
    setSelectedReason('');
    setOtherReasonText('');
    setCancelError(null);
    setCancelFeedback(`Reservation request ${reservationCode} has been cancelled.`);
    setTimeout(() => setCancelFeedback(null), 4000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/75 backdrop-blur-sm animate-fade-in overflow-hidden"
    >
      <div className="bg-white rounded-3xl max-w-2xl sm:max-w-3xl w-full shadow-2xl border border-stone-200/90 overflow-hidden transform-gpu flex flex-col max-h-[90vh]">
        
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
          
          {/* Cancellation Feedback Toast */}
          {cancelFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{cancelFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setCancelFeedback(null)}
                className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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
            <div className="space-y-4">
              {reservations.map((res) => {
                const isExpanded = expandedId === res.id;
                const isCancelling = cancellingId === res.id;

                return (
                  <div
                    key={res.id}
                    className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs hover:border-gold-300 transition-all flex flex-col gap-3.5"
                  >
                    {/* Top Row: Thumbnail, Main Info & Rate */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      {/* Left: Thumbnail & Essential Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0 border border-stone-200 relative group">
                          <img
                            src={res.roomImage}
                            alt={res.roomName}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-pine-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                              {res.reservationCode}
                            </span>

                            {res.status === 'Pending Review' ? (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>Pending Review</span>
                              </span>
                            ) : res.status === 'Confirmed' ? (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Confirmed</span>
                              </span>
                            ) : res.status === 'Cancelled' ? (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-rose-500" />
                                <span>Cancelled</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200 flex items-center gap-1">
                                <span>{res.status}</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif font-bold text-sm sm:text-base text-pine-950 truncate">
                            {res.roomName}
                          </h4>

                          <p className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-pine-700" />
                              <span>{res.checkInDate} — {res.checkOutDate}</span>
                            </span>
                            <span>•</span>
                            <span>{res.numberOfGuests} Guests</span>
                          </p>

                          {/* Cancellation Note Preview if Cancelled */}
                          {res.status === 'Cancelled' && res.cancellationReason && (
                            <p className="text-[11px] text-rose-700 flex items-center gap-1 font-medium mt-0.5">
                              <span className="text-rose-900 font-semibold">Reason:</span>
                              <span className="italic truncate">{res.cancellationReason}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Rate & Booking Time */}
                      <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end flex-shrink-0">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Rate</span>
                          <strong className="text-sm sm:text-base font-bold text-pine-900 font-serif">
                            ₱{res.rate.toLocaleString()}
                            <span className="text-xs font-sans font-normal text-slate-600">/{res.ratePeriod}</span>
                          </strong>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Requested on {res.bookedAt}
                        </span>
                      </div>
                    </div>

                    {/* Cancellation Form Box (with Reason Dropdown and "Others" text box) */}
                    {isCancelling && (
                      <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-2xl space-y-3 animate-fade-in shadow-xs">
                        <div className="flex items-start gap-2.5 text-rose-950 text-xs">
                          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-rose-900">Cancel Reservation Request</p>
                            <p className="text-[11px] text-rose-800">
                              Cancelling request for <strong>{res.roomName}</strong> ({res.reservationCode}). Please specify why you need to cancel this reservation.
                            </p>
                          </div>
                        </div>

                        {/* Reason Dropdown */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                            <span>Reason for Cancellation <span className="text-red-500">*</span></span>
                            <span className="text-[10px] text-slate-500 font-normal">Required</span>
                          </label>
                          <select
                            value={selectedReason}
                            onChange={(e) => {
                              setSelectedReason(e.target.value);
                              if (cancelError) setCancelError(null);
                            }}
                            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all cursor-pointer"
                          >
                            <option value="">-- Select a reason for cancellation --</option>
                            {COMMON_CANCELLATION_REASONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Custom Textarea if "Others" is selected */}
                        {selectedReason === 'Others (please specify)' && (
                          <div className="space-y-1 animate-fade-in">
                            <label className="text-[11px] font-bold text-slate-800 block">
                              Please specify your reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Briefly describe why you are requesting to cancel..."
                              value={otherReasonText}
                              onChange={(e) => {
                                setOtherReasonText(e.target.value);
                                if (cancelError) setCancelError(null);
                              }}
                              className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all font-medium resize-none"
                            />
                          </div>
                        )}

                        {/* Error Notice */}
                        {cancelError && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5 animate-shake">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{cancelError}</span>
                          </p>
                        )}

                        {/* Confirm & Keep Actions */}
                        <div className="flex items-center gap-2 pt-1 border-t border-rose-200/60">
                          <button
                            type="button"
                            onClick={() => handleConfirmCancel(res.id, res.reservationCode)}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Confirm Cancellation</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDismissCancel}
                            className="px-3.5 py-2 bg-white hover:bg-stone-100 active:scale-98 text-slate-700 border border-stone-300 rounded-xl text-xs font-medium transition-all cursor-pointer"
                          >
                            Keep Reservation
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Card Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/70 text-xs">
                      <button
                        type="button"
                        onClick={() => toggleDetails(res.id)}
                        className="inline-flex items-center gap-1.5 text-pine-800 hover:text-gold-700 font-semibold transition-colors cursor-pointer py-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-pine-700" />
                        <span>{isExpanded ? 'Hide Details' : 'View Full Details'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {res.status !== 'Cancelled' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenCancel(res.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-700 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                            title="Cancel reservation request"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Request</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => deleteReservation(res.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-stone-100 border border-stone-200 transition-all cursor-pointer"
                            title="Remove from history"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Reservation Details Breakdown */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-stone-200 space-y-3 bg-white/80 -mx-4 -mb-4 p-4 rounded-b-2xl border-b border-x border-stone-200/80 animate-fade-in">
                        
                        {/* Section Header with Copy Code */}
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pine-950">
                            <FileText className="w-4 h-4 text-pine-700" />
                            <span>Submitted Reservation Information</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopyCode(res.reservationCode, res.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-pine-800 hover:text-gold-700 transition-colors cursor-pointer"
                            title="Copy reservation code"
                          >
                            {copiedId === res.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* 2-Column Grid: Guest Contact & Stay Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* 1. Guest Information Submitted */}
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Guest Contact Info
                            </span>
                            <div className="flex items-center gap-2 text-slate-800 font-medium">
                              <User className="w-3.5 h-3.5 text-pine-700 flex-shrink-0" />
                              <span className="truncate">{res.fullName || user?.name || 'Guest'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                              <Mail className="w-3.5 h-3.5 text-pine-700 flex-shrink-0" />
                              <span className="truncate">{res.email || user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                              <Phone className="w-3.5 h-3.5 text-pine-700 flex-shrink-0" />
                              <span>{res.contactNumber || user?.phone || 'N/A'}</span>
                            </div>
                          </div>

                          {/* 2. Stay & Accommodation Details */}
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Stay Details
                            </span>
                            <div className="flex items-center justify-between text-slate-800">
                              <span className="text-slate-500">Category:</span>
                              <span className="font-semibold capitalize">
                                {res.roomCategory === 'dormitory' ? 'Monthly Dormitory' : 'Transient Lodging'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-800">
                              <span className="text-slate-500">Check-in:</span>
                              <span className="font-semibold">{res.checkInDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-800">
                              <span className="text-slate-500">Check-out:</span>
                              <span className="font-semibold">{res.checkOutDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-800">
                              <span className="text-slate-500">Guests:</span>
                              <span className="font-semibold">{res.numberOfGuests} Guests</span>
                            </div>
                          </div>
                        </div>

                        {/* Special Requests Section */}
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-1 text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Special Requests & Preferences
                          </span>
                          {res.specialRequests && res.specialRequests.trim().length > 0 ? (
                            <p className="text-slate-800 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/70 text-xs">
                              "{res.specialRequests}"
                            </p>
                          ) : (
                            <p className="text-slate-400 italic">
                              No special requests or notes were provided with this booking.
                            </p>
                          )}
                        </div>

                        {/* Cancellation Record (if Cancelled) */}
                        {res.status === 'Cancelled' && (
                          <div className="bg-rose-50/80 p-3 rounded-xl border border-rose-200 space-y-1.5 text-xs text-rose-950">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Cancellation Record</span>
                              </span>
                              {res.cancelledAt && (
                                <span className="text-[10px] text-slate-500 font-medium">
                                  Cancelled on {res.cancelledAt}
                                </span>
                              )}
                            </div>
                            <div className="bg-white/80 p-2.5 rounded-lg border border-rose-200/70">
                              <span className="text-[11px] font-semibold text-slate-700 block">Stated Reason:</span>
                              <p className="text-xs text-rose-950 font-medium italic mt-0.5">
                                "{res.cancellationReason || 'No reason provided'}"
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Status Description Banner */}
                        <div className="p-3 rounded-xl border text-xs flex items-start gap-2.5 bg-stone-50 border-stone-200/80">
                          {res.status === 'Pending Review' ? (
                            <>
                              <Clock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <span className="font-bold text-amber-950 block">Awaiting Staff Availability Verification</span>
                                <p className="text-slate-600 text-[11px]">
                                  Your reservation request is queued for front desk review. You will be contacted via SMS or email once approved. You can cancel this request at any time prior to approval.
                                </p>
                              </div>
                            </>
                          ) : res.status === 'Confirmed' ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <span className="font-bold text-emerald-950 block">Reservation Confirmed</span>
                                <p className="text-slate-600 text-[11px]">
                                  Your room is reserved. Check-in starts at 2:00 PM. Please present a valid government ID and reservation code upon arrival.
                                </p>
                              </div>
                            </>
                          ) : res.status === 'Cancelled' ? (
                            <>
                              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <span className="font-bold text-rose-950 block">Reservation Request Cancelled</span>
                                <p className="text-slate-600 text-[11px]">
                                  This booking was cancelled by you. No room is held under this reservation code.
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Info className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 block">Status: {res.status}</span>
                              </div>
                            </>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Assistance Notice */}
          <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Pending Review reservations are verified by staff for availability before final confirmation.</span>
            </div>
            <a
              href={`tel:${DEMO_CONTACT.phone.replace(/\s+/g, '')}`}
              className="text-pine-800 hover:text-gold-700 font-bold hover:underline flex-shrink-0"
              title={`Call Front Desk: ${DEMO_CONTACT.phone}`}
            >
              Call Front Desk ({DEMO_CONTACT.phone})
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
