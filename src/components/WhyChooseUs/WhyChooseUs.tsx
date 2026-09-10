import React from 'react';
import { Mountain, Users, Flame, ShieldCheck, HeartHandshake, Coffee } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: <Mountain className="w-6 h-6 text-pine-700" />,
      title: "Authentic Baguio Experience",
      description: "Enjoy the crisp mountain breeze and pine-scented air of Baguio City with easy access to iconic scenic spots, cafes, and parks."
    },
    {
      icon: <Users className="w-6 h-6 text-pine-700" />,
      title: "Hybrid Lodging & Monthly Dorms",
      description: "Whether you're visiting for a weekend vacation or studying for board exams, we cater to both short-term travelers and long-term students."
    },
    {
      icon: <Flame className="w-6 h-6 text-pine-700" />,
      title: "Hot Water & Cozy Highland Comfort",
      description: "Baguio mornings require reliable hot water! Enjoy pressurized hot and cold showers, strong Wi-Fi, and home-style comfort."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-pine-700" />,
      title: "Safe & Secure with 24/7 Caretaker",
      description: "Rest easy with round-the-clock caretaker support, secure key access, and CCTV surveillance throughout all common corridors."
    },
    {
      icon: <Coffee className="w-6 h-6 text-pine-700" />,
      title: "Community Kitchen & Amenities",
      description: "Save on dining costs with our shared cooking facilities, drinking-water stations, and convenient laundry areas."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-pine-700" />,
      title: "Friendly & Attentive Hospitality",
      description: "Experience genuine Cordilleran warmth and courteous assistance ensuring your stay is hassle-free from check-in to check-out."
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-cream-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cedar-100 text-cedar-800 text-xs font-semibold tracking-wide uppercase">
            <span>Hospitality Distinction</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pine-950">
            Why Choose Dragon Treasure
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A balanced condotel experience combining the warmth of a local transient house with the security and amenities of modern accommodations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-pine-50 border border-pine-100 flex items-center justify-center">
                  {pt.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pt.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
