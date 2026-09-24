import React from 'react';
import { PROPERTY_INFO } from '../../data/mockData';
import { MapPin, BookOpen, CheckCircle2, Shield, HeartHandshake, Sparkles, Building2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white via-cream-50/50 to-white relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/3 left-0 -z-10 w-[500px] h-[500px] bg-gradient-to-tr from-pine-100/40 via-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story Images Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-luxury border-4 border-white bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80"
                alt="Dragon Treasure Lodging Atmosphere"
                className="w-full h-84 sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-950/85 via-black/25 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs font-bold text-gold-300 uppercase tracking-wider mb-1.5">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Baguio City, Benguet</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  City of Pines Hospitality & Community
                </h3>
              </div>
            </div>

            {/* Overlapping Floating Highlight Card */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-luxury border border-stone-200/90 max-w-xs animate-float">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500 shadow-glow-gold flex-shrink-0 bg-pine-950">
                  <img
                    src="/dragon-treasure-logo.jpg"
                    alt="Dragon Treasure Official Logo"
                    className="w-full h-full object-cover scale-[1.10]"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-pine-950 font-serif">Dragon Treasure</h4>
                  <p className="text-xs text-slate-500 font-medium">Transient Lodging & Condotel</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-gold-700 uppercase tracking-wider">
                    Cordillera Standard
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100/80 text-gold-900 border border-gold-300/80 text-xs font-semibold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5 text-gold-700" strokeWidth={2} />
              <span>About Our Property</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pine-950 leading-[1.15] tracking-tight">
              A Welcoming Haven for <span className="text-gold-gradient">Travelers & Students</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              <strong className="font-semibold text-pine-950">{PROPERTY_INFO.name}</strong> is a dedicated lodging property nestled in the cool highlands of Baguio City, Benguet, tailored to serve both short-term vacationers and long-term monthly residents.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              We harmonize the warm hospitality of an authentic Baguio transient home with the peace of mind and convenience of contemporary condotel management. From families touring Burnham Park to university students preparing for board exams, we offer a safe, comfortable, and budget-friendly sanctuary.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="w-5 h-5 rounded-full bg-pine-100 text-pine-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <span><strong>Short-Term Transient:</strong> Fully furnished rooms with flexible bedding options, private hot showers, and high-speed Wi-Fi.</span>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="w-5 h-5 rounded-full bg-pine-100 text-pine-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <span><strong>Monthly Dormitory:</strong> Secure shared quarters with individual lockers, study areas, full kitchen access, and laundry facilities.</span>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="w-5 h-5 rounded-full bg-pine-100 text-pine-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <span><strong>Safe & Accessible:</strong> 24-hour on-site caretaker assistance, CCTV surveillance, and straightforward public transport connectivity.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
