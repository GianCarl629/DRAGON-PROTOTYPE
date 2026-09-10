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
  Sparkles,
  Layers
} from 'lucide-react';
import { SAMPLE_AMENITIES } from '../../data/mockData';

// Map icon string to Lucide component
const getAmenityIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wifi':
      return <Wifi className="w-5 h-5" />;
    case 'Clock':
      return <Clock className="w-5 h-5" />;
    case 'Car':
      return <Car className="w-5 h-5" />;
    case 'Droplets':
      return <Droplets className="w-5 h-5" />;
    case 'Tv':
      return <Tv className="w-5 h-5" />;
    case 'Wind':
      return <Wind className="w-5 h-5" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-5 h-5" />;
    case 'Shirt':
      return <Shirt className="w-5 h-5" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5" />;
    case 'ArrowUpDown':
      return <ArrowUpDown className="w-5 h-5" />;
    case 'GlassWater':
      return <GlassWater className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
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
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pine-600" />
            <span>Property Inclusions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pine-950">
            Amenities & Guest Facilities
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Thoughtfully planned for both vacationing travelers and long-term dormitory residents in Baguio City.
          </p>

          <p className="text-xs text-slate-600 italic">
            * Demonstration amenities data. Formatted for easy configuration when real client information is loaded.
          </p>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-pine-800 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 11 Amenities Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAmenities.map((amenity) => (
            <div
              key={amenity.id}
              className="p-5 rounded-2xl bg-cream-50/60 border border-slate-200/80 hover:border-pine-300 hover:bg-white hover:shadow-card transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-pine-100/80 text-pine-800 group-hover:bg-pine-800 group-hover:text-white flex items-center justify-center transition-colors duration-300 mb-3.5">
                {getAmenityIcon(amenity.icon)}
              </div>

              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold text-base text-slate-900 group-hover:text-pine-900 transition-colors">
                  {amenity.name}
                </h3>
              </div>

              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-cedar-700 bg-cedar-100/60 px-2 py-0.5 rounded-full mb-2">
                {amenity.category}
              </span>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
