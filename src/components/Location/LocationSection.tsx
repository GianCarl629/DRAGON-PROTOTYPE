import React from 'react';
import { MapPin, Navigation, Car, Compass, Building, Bus } from 'lucide-react';
import { BAGUIO_LANDMARKS, PROPERTY_INFO } from '../../data/mockData';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-20 bg-slate-50/70 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5 text-pine-600" />
            <span>Highland Location & Accessibility</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pine-950">
            Find Us in Baguio City
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Conveniently situated in Baguio City, Benguet, offering straightforward access to universities, tourist attractions, and the city center.
          </p>
        </div>

        {/* Content Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Visual Interactive Map Mock (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              {/* Map Graphic / View */}
              <div className="absolute inset-0 bg-[#e5e9ec] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-full h-full relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 p-6 flex flex-col justify-between">
                  {/* Decorative map lines */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1b4337_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                      Baguio City Map Area
                    </span>
                    <span className="text-[11px] font-medium text-pine-800 bg-pine-100/90 px-2.5 py-1 rounded-full">
                      Benguet Province
                    </span>
                  </div>

                  {/* Central Pin */}
                  <div className="relative z-10 my-auto flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-pine-800 text-white flex items-center justify-center shadow-elevated border-2 border-white animate-bounce">
                        <Building className="w-6 h-6 text-cedar-300" />
                      </div>
                      <div className="absolute -inset-2 rounded-full bg-pine-600/30 animate-ping -z-10" />
                    </div>
                    <div className="mt-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-200 text-center">
                      <p className="font-serif font-bold text-sm text-pine-950">{PROPERTY_INFO.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Baguio City, Benguet</p>
                    </div>
                  </div>

                  <div className="relative z-10 text-[11px] text-slate-600 bg-white/80 backdrop-blur-sm p-2 rounded-lg text-center">
                    Demonstration map location. Google Maps integration can be configured with an API key.
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Directions Tip */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-pine-700 flex-shrink-0" />
                <span>Easily reachable via standard taxi cabs or private vehicles.</span>
              </div>
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-pine-700 flex-shrink-0" />
                <span>Regular jeepney routes connect nearby main thoroughfares.</span>
              </div>
            </div>
          </div>

          {/* Landmarks Proximity Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-pine-100 text-pine-800 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Nearby Baguio Destinations
                  </h3>
                  <p className="text-xs text-slate-600">Approximate travel times by car / taxi</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {BAGUIO_LANDMARKS.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-600">{item.desc}</p>
                    </div>
                    <span className="text-xs font-semibold text-pine-800 bg-pine-50 px-2.5 py-1 rounded-lg border border-pine-100 whitespace-nowrap">
                      {item.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Advice Card */}
            <div className="p-5 rounded-2xl bg-pine-900 text-white shadow-soft">
              <h4 className="text-sm font-bold text-cedar-300 mb-1">
                Guest Transportation Advice
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Baguio City taxis are known for fair metered fares and honest service. Simply mention Dragon Treasure Transient or your destination driver reference when booking a taxi.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
