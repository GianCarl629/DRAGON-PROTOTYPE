import React from 'react';
import { Mountain, Users, Flame, ShieldCheck, HeartHandshake, Car, Sparkles } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      num: "01",
      icon: Mountain,
      title: "Authentic Highland Experience",
      description: "Enjoy the crisp mountain breeze and pine-scented air of Baguio City with effortless access to iconic scenic spots, mountain cafes, and local parks."
    },
    {
      num: "02",
      icon: Users,
      title: "Hybrid Lodging & Monthly Dorms",
      description: "Whether visiting for a refreshing weekend vacation or studying for university board exams, our flexible accommodations cater to both short stays and monthly rentals."
    },
    {
      num: "03",
      icon: Flame,
      title: "Highland Warmth & Hot Showers",
      description: "Baguio mornings require dependable comfort. Enjoy strong water pressure with reliable hot and cold showers in every room and shared facility."
    },
    {
      num: "04",
      icon: ShieldCheck,
      title: "24/7 Caretaker & CCTV Security",
      description: "Rest easy with round-the-clock caretaker support on property grounds, secure key access, and continuous CCTV surveillance in all corridors."
    },
    {
      num: "05",
      icon: Car,
      title: "Dedicated Parking & Prime Access",
      description: "Enjoy designated on-site parking for your vehicle and convenient road access to Session Road, SM Baguio, and scenic tourist destinations."
    },
    {
      num: "06",
      icon: HeartHandshake,
      title: "Attentive Cordilleran Hospitality",
      description: "Experience genuine northern warmth and attentive customer care, ensuring your stay is peaceful, comfortable, and memorable from start to finish."
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-gradient-to-b from-stone-50 via-cream-50/70 to-stone-50 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[700px] h-[700px] bg-gradient-to-tr from-pine-100/40 via-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100/80 text-gold-900 border border-gold-300/80 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-700" strokeWidth={2} />
            <span>Hospitality Distinction</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pine-950 tracking-tight">
            Why Stay at <span className="text-gold-gradient">Dragon Treasure</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A harmonious condotel experience combining the comfort and warmth of a traditional transient home with the security and conveniences of modern accommodation.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white/90 backdrop-blur-sm p-7 rounded-3xl border border-stone-200/90 shadow-card hover:shadow-luxury-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Number & Icon Row */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gold-100/70 border border-gold-300/80 text-pine-900 flex items-center justify-center group-hover:scale-110 group-hover:bg-pine-900 group-hover:border-pine-950 group-hover:text-gold-300 transition-all duration-300 shadow-xs group-hover:shadow-md">
                      <Icon className="w-5 h-5 transition-colors duration-300" strokeWidth={1.8} />
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-600 group-hover:text-gold-700 transition-colors">
                      {pt.num}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-pine-950 mb-2.5 group-hover:text-pine-800 transition-colors">
                    {pt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pt.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-[11px] font-semibold text-gold-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Guest Comfort Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
