import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Clock, CreditCard, CalendarCheck, AlertCircle, ShieldAlert } from 'lucide-react';
import { SAMPLE_FAQS, PROPERTY_POLICIES } from '../../data/mockData';

export const FAQSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(SAMPLE_FAQS[0].id);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-semibold tracking-wide uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-pine-600" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pine-950">
            Frequently Asked Questions & Policies
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Everything you need to know about our sample rates, guest check-in/out times, and property guidelines.
          </p>

          <p className="text-xs text-slate-600 italic">
            * All policies and questions reflect demonstration data for this prototype.
          </p>
        </div>

        {/* Grid Layout: Accordion (7 cols) + Policy Summary Card (5 cols) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {SAMPLE_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-pine-50/40 border-pine-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm sm:text-base text-slate-900">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen ? 'bg-pine-800 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-pine-100/60 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Policies & Procedure Overview Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-cream-50 p-6 rounded-3xl border border-cedar-200/60 shadow-card space-y-5">
              <h3 className="font-serif font-bold text-lg text-pine-950 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-pine-700" />
                <span>Property Policies at a Glance</span>
              </h3>

              {/* Check-in / Check-out */}
              <div className="space-y-1.5 pb-4 border-b border-cedar-200/50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-pine-700" />
                  <span>Hours of Arrival & Departure</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 mt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-600 block">Check-in</span>
                    <strong className="text-pine-900">{PROPERTY_POLICIES.checkInTime}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-600 block">Check-out</span>
                    <strong className="text-pine-900">{PROPERTY_POLICIES.checkOutTime}</strong>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-1.5 pb-4 border-b border-cedar-200/50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <CreditCard className="w-3.5 h-3.5 text-pine-700" />
                  <span>Accepted Payment Options</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {PROPERTY_POLICIES.paymentMethods.map((method, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="space-y-2 pb-4 border-b border-cedar-200/50 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cancellation Policy</span>
                </div>
                <p className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  • {PROPERTY_POLICIES.cancellation.freeCancellation}<br />
                  • {PROPERTY_POLICIES.cancellation.lateCancellation}
                </p>
              </div>

              {/* Booking Process Description */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-pine-700" />
                  <span>Reservation Process</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {PROPERTY_POLICIES.bookingProcess}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
