import React, { useState } from 'react';
import { 
  Wifi, 
  Clock, 
  Car, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  Sparkles,
  Armchair,
  Utensils,
  Coffee,
  Tv,
  DoorClosed,
  Home
} from 'lucide-react';
import { SAMPLE_AMENITIES, SHARED_UNIT_AMENITIES } from '../../data/mockData';

// Map icon string to Lucide component with standardized props
const getAmenityIcon = (iconName: string) => {
  const iconProps = { className: "w-5 h-5 transition-colors duration-300", strokeWidth: 1.8 };
  switch (iconName) {
    case 'Wifi':
      return <Wifi {...iconProps} />;
    case 'Clock':
      return <Clock {...iconProps} />;
    case 'Car':
      return <Car {...iconProps} />;
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    case 'Armchair':
      return <Armchair {...iconProps} />;
    case 'Utensils':
      return <Utensils {...iconProps} />;
    case 'Coffee':
      return <Coffee {...iconProps} />;
    case 'Tv':
      return <Tv {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export const AmenitiesSection: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Comfort', 'Convenience', 'Safety & Facilities'];

  const filteredAmenities = SAMPLE_AMENITIES.filter((item) => {
    if (filterCategory === 'All') return true;
    return item.category === filterCategory;
  });

  return (
    <section id="amenities" className="py-24 bg-white relative overflow-hidden border-t border-stone-200/60">
      {/* Decorative ambient glow */}
      <div className="absolute bottom-0 left-1/3 -z-10 w-[500px] h-[500px] bg-gradient-to-tr from-cream-100/60 via-pine-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100/80 text-gold-900 border border-gold-300/80 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-700" strokeWidth={2} />
            <span>Property Inclusions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pine-950 tracking-tight">
            Amenities & <span className="text-gold-gradient">Guest Facilities</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Thoughtfully curated with a cozy Baguio feel, dark wood accents, matte black industrial fixtures, and red accents for transient guests and dormitory residents.
          </p>
        </div>

        {/* Category Pills & General Amenities Grid */}
        <div className="space-y-10">
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 rounded-full bg-stone-100/80 border border-stone-200/80 shadow-xs flex-wrap justify-center gap-1">
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? SAMPLE_AMENITIES.length 
                  : SAMPLE_AMENITIES.filter(a => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-pine-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-pine-950 hover:bg-white/80'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      filterCategory === cat ? 'bg-pine-800 text-gold-300' : 'bg-stone-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* General Amenities Grid */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300"
            style={{ overflowAnchor: 'none' }}
          >
            {filteredAmenities.map((amenity) => (
              <div
                key={amenity.id}
                className="p-6 rounded-3xl bg-gradient-to-br from-white via-cream-50/40 to-white border border-stone-200/80 hover:border-gold-400/60 hover:bg-white hover:shadow-luxury-hover hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between animate-fade-in"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gold-100/70 border border-gold-300/80 text-pine-900 group-hover:bg-pine-900 group-hover:border-pine-950 group-hover:text-gold-300 group-hover:scale-105 flex items-center justify-center transition-all duration-300 mb-4 shadow-xs group-hover:shadow-md">
                    {getAmenityIcon(amenity.icon)}
                  </div>

                  <div className="mb-1.5">
                    <h3 className="font-serif font-bold text-lg text-pine-950 group-hover:text-pine-800 transition-colors">
                      {amenity.name}
                    </h3>
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gold-800 bg-gold-50 border border-gold-200/70 px-2.5 py-0.5 rounded-full mb-3">
                    {amenity.category}
                  </span>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {amenity.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-slate-600 group-hover:text-pine-800 transition-colors">
                  <span>Standard In-House Feature</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHARED AMENITIES (Common Area per Unit) Showcase */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#faf6ed] via-[#f7f2e4] to-[#f4ece0] border-2 border-gold-300/90 shadow-luxury space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gold-300/60">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold-200/80 text-gold-950 border border-gold-400/80 text-[11px] font-bold tracking-wider uppercase mb-2">
                <Home className="w-3.5 h-3.5 text-gold-800" />
                <span>Common Area Inclusions</span>
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-pine-950">
                Shared Amenities (Common Area per Unit)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Every unit is equipped with a cozy communal suite shared exclusively between staying guests or dormitory boarders.
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-xl bg-pine-950 text-gold-200 border border-gold-400/40 text-xs font-bold self-start md:self-auto">
              Per-Unit Inclusions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SHARED_UNIT_AMENITIES.map((sh) => (
              <div 
                key={sh.id}
                className="p-5 rounded-2xl bg-white/95 border border-gold-200/90 hover:border-gold-400 hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gold-100/80 text-pine-950 border border-gold-300 flex items-center justify-center">
                      {getAmenityIcon(sh.icon)}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gold-900 bg-gold-100/70 border border-gold-300/80 px-2 py-0.5 rounded-full">
                      {sh.category}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-pine-950">
                    {sh.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {sh.description}
                  </p>
                </div>

                {sh.details && (
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                    {sh.details.map((item, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-slate-700 font-medium">
                        • {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
