// Customer inquiry modal dialog
import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
  Sparkles,
  Copy,
  Check,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { submitCustomerInquiry } from '../../services/db/inquiryService';
import { SAMPLE_ROOMS, PROPERTY_CONTACT } from '../../data/mockData';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedRoom?: string;
  preSelectedTopic?: string;
}

const INQUIRY_TOPICS = [
  'Monthly Dormitory Bedspace',
  'Transient Room Availability',
  'Group Booking & Seminar (10+ Pax)',
  'Early Check-in / Baggage Storage',
  'Student / Board Reviewee Package',
  'Rates, Amenities & General Questions'
];

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  preSelectedRoom,
  preSelectedTopic
}) => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(preSelectedTopic || INQUIRY_TOPICS[0]);
  const [roomOfInterest, setRoomOfInterest] = useState(preSelectedRoom || '');
  const [targetDate, setTargetDate] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill form from user account if logged in
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user, isOpen]);

  // Sync props when opening
  useEffect(() => {
    if (isOpen) {
      if (preSelectedTopic) setTopic(preSelectedTopic);
      if (preSelectedRoom) setRoomOfInterest(preSelectedRoom);
      setErrorMessage('');
      setSubmittedRef(null);
    }
  }, [isOpen, preSelectedTopic, preSelectedRoom]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMessage('Please provide either an email or phone number so we can respond.');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Please write your message or question.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCustomerInquiry({
        name,
        email,
        phone,
        topic,
        message,
        roomOfInterest,
        targetDate
      });

      if (res.success) {
        setSubmittedRef(res.referenceCode);
        setMessage('');
      } else {
        setErrorMessage('Failed to send inquiry. Please try again or call our front desk.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef).catch(() => {});
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#fffdfa] rounded-3xl border-2 border-gold-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-pine-950 via-pine-900 to-pine-950 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-gold-400/20 border border-gold-400/40 text-gold-300 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[11px] uppercase font-bold text-gold-300 tracking-wider">
              Front Desk Concierge
            </span>
          </div>

          <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
            Guest Inquiries & Assistance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
            Need special group rates, reviewee dormitory details, or check-in assistance? Our caretaker team is ready to help.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800 space-y-4">
          {submittedRef ? (
            /* Success confirmation screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-2xl text-pine-950">
                  Inquiry Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Thank you, <span className="font-bold text-slate-900">{name}</span>. Your question has been forwarded directly to our front-desk caretaker at Engineers' Hill.
                </p>
              </div>

              {/* Reference Code Box */}
              <div className="p-4 rounded-2xl bg-gold-50/80 border border-gold-300 max-w-xs mx-auto space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Reference Code
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono font-bold text-lg text-pine-950 tracking-wider">
                    {submittedRef}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 rounded-md hover:bg-gold-200 text-slate-600 hover:text-pine-950 transition-colors cursor-pointer"
                    title="Copy reference code"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Turnaround notice */}
              <div className="p-3.5 rounded-2xl bg-stone-100 text-xs text-slate-600 max-w-sm mx-auto flex items-center gap-3 text-left border border-stone-200">
                <Clock className="w-5 h-5 text-pine-800 flex-shrink-0" />
                <span>
                  Our front-desk manager typically responds within <strong>1–2 hours</strong> during operating hours (8:00 AM – 10:00 PM).
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full max-w-xs py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pine-900 to-pine-800 hover:from-pine-800 hover:to-pine-950 shadow-md cursor-pointer transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Name & Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-pine-800" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-pine-800" />
                    <span>Contact Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0917 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-pine-800" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maria.santos@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800"
                />
              </div>

              {/* Inquiry Topic Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-pine-800" />
                  <span>Topic of Inquiry *</span>
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 cursor-pointer"
                >
                  {INQUIRY_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Room Selection & Target Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">
                    Room of Interest (Optional)
                  </label>
                  <select
                    value={roomOfInterest}
                    onChange={(e) => setRoomOfInterest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:outline-none focus:border-pine-800 cursor-pointer"
                  >
                    <option value="">-- Any / General --</option>
                    {SAMPLE_ROOMS.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} ({r.category === 'dormitory' ? '₱3,000/mo' : r.formattedRate})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-pine-700" />
                    <span>Target Date / Move-in (Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:outline-none focus:border-pine-800"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Your Message or Question *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Is Bed C in the Female Wing available this November? What are the requirements and move-in deposit?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pine-900 to-pine-800 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-md hover:shadow-glow-pine disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Inquiry to Front Desk</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Help Footer */}
              <p className="text-[11px] text-center text-slate-500 pt-1">
                Need immediate room booking? Call front desk at{' '}
                <a
                  href={`tel:${PROPERTY_CONTACT.phone.replace(/\s+/g, '')}`}
                  className="font-bold text-pine-900 hover:underline"
                >
                  {PROPERTY_CONTACT.phone}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
