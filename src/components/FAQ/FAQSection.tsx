import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Clock, CreditCard, CalendarCheck, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { SAMPLE_FAQS, PROPERTY_POLICIES } from '../../data/mockData';

export const FAQSection: React.FC = () => {
  // All FAQs collapsed by default
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -z-10 w-[500px] h-[500px] bg-gradient-to-tr from-gold-100/30 via-cream-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100/80 text-gold-900 border border-gold-300/80 text-xs font-semibold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-gold-700" strokeWidth={2} />
            <span>Guest Information & Policies</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pine-950 tracking-tight">
            Frequently Asked <span className="text-gold-gradient">Questions</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Everything you need to know about our room rates, check-in and check-out procedures, on-site parking, and property policies.
          </p>
        </div>

        {/* Grid Layout: Accordion (7 cols) + Policy Summary Card (5 cols) */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {SAMPLE_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-gradient-to-r from-pine-50/50 to-cream-50/40 border-gold-400/60 shadow-card'
                      : 'bg-white border-stone-200/90 hover:border-gold-300 hover:shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-pine-950">
                      {faq.question}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isOpen 
                          ? 'bg-pine-900 rotate-180 shadow-sm border border-gold-500/50' 
                          : 'bg-stone-100 hover:bg-stone-200 border border-stone-200'
                      }`}
                    >
                      <ChevronDown 
                        className={`w-4 h-4 transition-colors ${isOpen ? 'text-white' : 'text-pine-950'}`} 
                        strokeWidth={2.5} 
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 animate-fade-in font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Policies & Procedure Overview Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-gradient-to-br from-white via-cream-50/60 to-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-card space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pine-50 to-cream-100 text-pine-800 flex items-center justify-center border border-pine-100 shadow-xs">
                  <CalendarCheck className="w-5 h-5 text-pine-800" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-pine-950">
                    Property Policies at a Glance
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Standard stay guidelines & guest procedures</p>
                </div>
              </div>

              {/* Check-in / Check-out Hours */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-pine-950 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                  <span>Check-In & Check-Out Hours</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Standard Check-In</span>
                    <strong className="text-base text-pine-950 font-serif block mt-0.5">{PROPERTY_POLICIES.checkInTime}</strong>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Standard Check-Out</span>
                    <strong className="text-base text-pine-950 font-serif block mt-0.5">{PROPERTY_POLICIES.checkOutTime}</strong>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-pine-950 uppercase tracking-wider">
                  <CreditCard className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                  <span>Accepted Payment Methods</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {PROPERTY_POLICIES.paymentMethods.map((method, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-slate-700 shadow-xs"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-pine-950 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                  <span>Cancellation Guarantee</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-xs text-slate-600 leading-relaxed shadow-xs space-y-1">
                  <p className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span>{PROPERTY_POLICIES.cancellation.freeCancellation}</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5 ml-1" />
                    <span>{PROPERTY_POLICIES.cancellation.lateCancellation}</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
