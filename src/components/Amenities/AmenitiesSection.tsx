import React, { useState } from 'react';
import { 
  Wifi, 
  Clock, 
  Car, 
  Droplets, 
  Tv, 
  Wind, 
  UtensilsCrossed, 
  Shirt, 
  ShieldCheck, 
  ArrowUpDown, 
  GlassWater,
  Sparkles
} from 'lucide-react';
import { SAMPLE_AMENITIES } from '../../data/mockData';

// Map icon string to Lucide component with standardized props
const getAmenityIcon = (iconName: string) => {
  const iconProps = { className: "w-5 h-5", strokeWidth: 1.8 };
  switch (iconName) {
    case 'Wifi':
      return <Wifi {...iconProps} />;
    case 'Clock':
      return <Clock {...iconProps} />;
    case 'Car':
      return <Car {...iconProps} />;
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Tv':
      return <Tv {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed {...iconProps} />;
    case 'Shirt':
      return <Shirt {...iconProps} />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    case 'ArrowUpDown':
      return <ArrowUpDown {...iconProps} />;
    case 'GlassWater':
      return <GlassWater {...iconProps} />;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            Thoughtfully provided for vacationing families, weekend travelers, and long-term dormitory residents in Baguio City.
          </p>
        </div>

        {/* Category Pills */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-stone-100/80 border border-stone-200/80 shadow-xs flex-wrap justify-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  filterCategory === cat
                    ? 'bg-pine-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-pine-950 hover:bg-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 11 Amenities Bento Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAmenities.map((amenity) => (
            <div
              key={amenity.id}
              className="p-6 rounded-3xl bg-gradient-to-br from-white via-cream-50/40 to-white border border-stone-200/80 hover:border-gold-400/60 hover:bg-white hover:shadow-luxury-hover hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pine-50 to-cream-100 border border-pine-100/80 text-pine-800 group-hover:bg-pine-900 group-hover:text-gold-300 group-hover:scale-105 flex items-center justify-center transition-all duration-300 mb-4 shadow-xs">
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
    </section>
  );
};
