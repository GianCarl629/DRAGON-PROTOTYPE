// Concierge & inquiry section on the main page
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Calendar, 
  Sparkles,
  ShieldCheck,
  Check,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { submitCustomerInquiry } from '../../services/db/inquiryService';
import { SAMPLE_ROOMS, PROPERTY_CONTACT } from '../../data/mockData';

const INQUIRY_TOPICS = [
  'Monthly Dormitory Bedspace',
  'Transient Room Availability',
  'Group Booking & Seminar (10+ Pax)',
  'Early Check-in / Baggage Storage',
  'Student / Board Reviewee Package',
  'Rates, Amenities & General Questions'
];

export const InquirySection: React.FC = () => {
  const { user, openReservationsModal } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(INQUIRY_TOPICS[0]);
  const [roomOfInterest, setRoomOfInterest] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill if user logged in
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMessage('Please provide either your email address or mobile number.');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Please write your message or inquiry details.');
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

  return (
    <section id="inquire" className="py-20 sm:py-24 bg-gradient-to-b from-[#fdfbf7] via-stone-50 to-[#fdfbf7] relative overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-pine-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-100/80 border border-gold-300 text-pine-950 text-xs font-semibold shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5 text-pine-800" />
            <span>Front Desk Concierge & Inquiries</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-pine-950 tracking-tight">
            Have Questions Before Reserving?
          </h2>
          <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
            Need monthly dorm rates, group seminar arrangements, or early baggage drop-off? Send an inquiry and our front-desk caretaker at Engineers' Hill will assist you.
          </p>
        </div>

        {/* 2-Column Layout: Left Contact & FAQ Cards, Right Live Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contacts & Information */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Quick Contact Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#fffdfa] border-2 border-gold-300 shadow-card space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-gold-200">
                <div className="w-10 h-10 rounded-2xl bg-pine-900 text-gold-300 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-pine-950">
                    Direct Property Front Desk
                  </h3>
                  <p className="text-xs text-slate-700 font-semibold">
                    Engineers' Hill, Baguio City
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <a 
                  href={`tel:${PROPERTY_CONTACT.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-gold-50/70 border-2 border-stone-200 hover:border-gold-300 transition-all text-slate-800 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gold-100 text-pine-900 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-700 uppercase font-bold">Front Desk Phone / SMS</div>
                    <div className="font-bold text-pine-950">{PROPERTY_CONTACT.phone}</div>
                  </div>
                </a>

                <a 
                  href={`mailto:${PROPERTY_CONTACT.email}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-gold-50/70 border-2 border-stone-200 hover:border-gold-300 transition-all text-slate-800 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gold-100 text-pine-900 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-700 uppercase font-bold">Direct Email</div>
                    <div className="font-bold text-pine-950 truncate">{PROPERTY_CONTACT.email}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border-2 border-stone-200 text-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-gold-100 text-pine-900 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-700 uppercase font-bold">Property Location</div>
                    <div className="font-bold text-pine-950">{PROPERTY_CONTACT.address}</div>
                    <div className="text-[11px] text-slate-700 font-medium">Walking distance to SM Baguio & Session Rd</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border-2 border-stone-200 text-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-gold-100 text-pine-900 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-700 uppercase font-bold">Caretaker Assistance Hours</div>
                    <div className="font-bold text-pine-950">{PROPERTY_CONTACT.hours} Daily</div>
                    <div className="text-[11px] text-slate-700 font-medium">24/7 security & emergency desk</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Guarantees */}
            <div className="p-5 rounded-3xl bg-pine-950 text-white border border-gold-400/40 shadow-luxury space-y-3">
              <div className="flex items-center gap-2 text-gold-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Concierge Promise</span>
              </div>
              <ul className="text-xs text-stone-100 font-medium space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Responses within 1–2 hours during daytime hours</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Custom quotes for groups requiring 2 or more rooms</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Reviewee dorm slots with study desks & hot showers</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Live Inquiry Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#fffdfa] border-2 border-gold-300 shadow-luxury">
              {submittedRef ? (
                /* Success View */
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-400 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-2xl text-pine-950">
                      Inquiry Sent Successfully!
                    </h3>
                    <p className="text-sm text-slate-800 font-medium max-w-md mx-auto mt-1 leading-relaxed">
                      Thank you, <strong className="font-bold text-slate-950">{name}</strong>. Your message has been routed to our front-desk manager.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gold-50 border-2 border-gold-300 max-w-xs mx-auto space-y-1">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                      Inquiry Reference Code
                    </span>
                    <span className="font-mono font-bold text-lg text-pine-950">
                      {submittedRef}
                    </span>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={() => openReservationsModal('inquiries')}
                      className="w-full sm:flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-pine-950 bg-gold-200 hover:bg-gold-300 border border-gold-400 shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View My Inquiries</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmittedRef(null)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 transition-colors cursor-pointer"
                    >
                      Ask Another
                    </button>
                  </div>
                </div>
              ) : (
                /* Form View */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-pine-950">
                      Send a Message to Front Desk
                    </h3>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      Fill out the form below and we will contact you via email or mobile phone.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs font-bold">
                      {errorMessage}
                    </div>
                  )}

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-pine-900" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Juan Dela Cruz"
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-xs sm:text-sm text-slate-950 font-medium placeholder:text-slate-500 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-pine-900" />
                        <span>Mobile Phone *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0917 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-xs sm:text-sm text-slate-950 font-medium placeholder:text-slate-500 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800"
                      />
                    </div>
                  </div>

                  {/* Email & Topic */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-pine-900" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="juan.delacruz@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-xs sm:text-sm text-slate-950 font-medium placeholder:text-slate-500 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-pine-900" />
                        <span>Topic *</span>
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-xs sm:text-sm text-slate-950 font-semibold focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 cursor-pointer"
                      >
                        {INQUIRY_TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Optional Room & Target Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900">
                        Room of Interest (Optional)
                      </label>
                      <select
                        value={roomOfInterest}
                        onChange={(e) => setRoomOfInterest(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 bg-white text-xs text-slate-950 font-medium focus:outline-none focus:border-pine-800 cursor-pointer"
                      >
                        <option value="">-- General / Any Room --</option>
                        {SAMPLE_ROOMS.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name} ({r.category === 'dormitory' ? '₱3,000/mo' : r.formattedRate})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-pine-900" />
                        <span>Target Move-in / Stay Date (Optional)</span>
                      </label>
                      <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 bg-white text-xs text-slate-950 font-medium focus:outline-none focus:border-pine-800"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900">
                      Message / Special Requests *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please ask any questions about room amenities, student dormitory rules, discounts, or baggage storage..."
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 bg-white text-xs sm:text-sm text-slate-950 font-medium placeholder:text-slate-500 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pine-900 to-pine-800 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-md hover:shadow-glow-pine transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Inquiry to Front Desk</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
