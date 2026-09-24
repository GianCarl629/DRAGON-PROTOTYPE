import React from 'react';
import { MapPin, Navigation, Car, Compass, Bus, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { BAGUIO_LANDMARKS, PROPERTY_INFO } from '../../data/mockData';
import { MapboxMap } from './MapboxMap';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-24 bg-gradient-to-b from-stone-50 via-cream-50/60 to-stone-50 border-t border-stone-200/60 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 -z-10 w-[550px] h-[550px] bg-gradient-to-b from-pine-100/40 via-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100/80 text-gold-900 border border-gold-300/80 text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5 text-gold-700" strokeWidth={2} />
            <span>Highland Location & Accessibility</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pine-950 tracking-tight">
            Find Us in <span className="text-gold-gradient">Baguio City</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Conveniently situated in Baguio City, Benguet, offering straightforward access to universities, shopping centers, tourist attractions, and scenic pine trails.
          </p>
        </div>

        {/* Content Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Mapbox Map Container (7 cols) */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-card flex flex-col justify-between">
            <MapboxMap />

            {/* Travel Directions Tip */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pine-50 text-pine-800 flex items-center justify-center flex-shrink-0 border border-pine-100">
                  <Car className="w-4 h-4" strokeWidth={2} />
                </div>
                <span>Easily reachable via standard taxi cabs or private vehicles.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pine-50 text-pine-800 flex items-center justify-center flex-shrink-0 border border-pine-100">
                  <Bus className="w-4 h-4" strokeWidth={2} />
                </div>
                <span>Regular jeepney routes connect nearby main thoroughfares.</span>
              </div>
            </div>
          </div>

          {/* Landmarks Proximity Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pine-50 to-cream-100 text-pine-800 flex items-center justify-center border border-pine-100 shadow-xs">
                    <Navigation className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-pine-950">
                      Nearby Destinations
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Approximate travel times by car / taxi</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200/60">
                  Central Hub
                </span>
              </div>

              <div className="divide-y divide-stone-100 mt-2">
                {BAGUIO_LANDMARKS.map((item, idx) => (
                  <div key={idx} className="py-4 flex items-start justify-between gap-3 group">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-pine-950 group-hover:text-pine-800 transition-colors flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                        <span>{item.name}</span>
                      </p>
                      <p className="text-xs text-slate-500 pl-3 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-xs font-bold text-pine-900 bg-pine-50 px-3 py-1.5 rounded-xl border border-pine-100/80 whitespace-nowrap flex-shrink-0 shadow-xs">
                      {item.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Advice Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-pine-950 via-pine-900 to-pine-950 text-white border border-gold-500/30 shadow-luxury">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                <span>Guest Transportation Tip</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Baguio City taxis are widely recognized for honest, metered fares. Simply mention <strong className="text-white font-semibold">Dragon Treasure Transient</strong> to your taxi driver for direct drop-off.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
