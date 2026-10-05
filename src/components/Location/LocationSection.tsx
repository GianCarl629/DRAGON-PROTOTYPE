import React, { useState } from 'react';
import { 
  Navigation, 
  Car, 
  Compass, 
  Bus, 
  ShieldCheck, 
  ExternalLink, 
  MapPin, 
  Copy, 
  Check, 
  Maximize2, 
  X, 
  Footprints, 
  Clock, 
  Sparkles,
  Phone
} from 'lucide-react';
import { DEMO_CONTACT } from '../../data/mockData';
import { MAP_CONFIG, LandmarkLocation } from '../../config/mapConfig';
import { MapboxMap } from './MapboxMap';

export const LocationSection: React.FC = () => {
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkLocation | null>(null);
  const [photoModalLandmark, setPhotoModalLandmark] = useState<LandmarkLocation | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'walk' | 'drive'>('all');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const landmarks = MAP_CONFIG.landmarks;

  const filteredLandmarks = landmarks.filter((item) => {
    if (filterCategory === 'walk') return item.travelMode === 'walk';
    if (filterCategory === 'drive') return item.travelMode === 'drive';
    return true;
  });

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(MAP_CONFIG.propertyAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  const handleSelectLandmarkFromCard = (landmark: LandmarkLocation) => {
    setSelectedLandmark(landmark);
    // Smooth scroll to map on smaller screens
    if (window.innerWidth < 1024) {
      document.getElementById('interactive-map-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="location" className="py-24 bg-gradient-to-b from-stone-50 via-cream-50/50 to-stone-50 border-t border-stone-200/60 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 -z-10 w-[550px] h-[550px] bg-gradient-to-b from-pine-100/40 via-gold-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-[450px] h-[450px] bg-gradient-to-t from-gold-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100/80 text-gold-900 border border-gold-300/80 text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5 text-gold-700" strokeWidth={2} />
            <span>Prime Engineers' Hill Location & Accessibility</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pine-950 tracking-tight">
            Find Us in <span className="text-gold-gradient">Baguio City</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Nestled in peaceful Engineers' Hill, Baguio City. Walkable to Session Road and Victory Liner, and minutes away from Burnham Park, Camp John Hay, and mountain overlooks.
          </p>
        </div>

        {/* Address & Quick Directions Banner */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-100 to-amber-100 text-pine-900 flex items-center justify-center flex-shrink-0 border border-gold-300/60 shadow-xs">
              <MapPin className="w-5 h-5 text-pine-900" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gold-800 uppercase tracking-wider">Property Address</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-800 font-semibold">Engineers' Hill</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-pine-950 leading-snug">
                {MAP_CONFIG.propertyAddress}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAddress}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                copiedAddress
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-stone-50 hover:bg-gold-50 text-slate-700 hover:text-pine-950 border-stone-200'
              }`}
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Address Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Address</span>
                </>
              )}
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_CONFIG.propertyCoordinates[1]},${MAP_CONFIG.propertyCoordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pine-900 to-pine-950 hover:from-pine-950 hover:to-black text-white shadow-md transition-all"
            >
              <span>Get Google Maps Route</span>
              <ExternalLink className="w-3.5 h-3.5 text-gold-300" />
            </a>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Mapbox Map Container (7 cols) */}
          <div id="interactive-map-panel" className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-card flex flex-col justify-between space-y-4">
            <MapboxMap 
              selectedLandmarkId={selectedLandmark?.id}
              onSelectLandmark={setSelectedLandmark}
              onOpenPhotoModal={setPhotoModalLandmark}
            />

            {/* Travel Directions Tip Strip */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-pine-50 text-pine-800 flex items-center justify-center flex-shrink-0 border border-pine-100">
                  <Footprints className="w-4 h-4 text-pine-700" strokeWidth={2} />
                </div>
                <span><strong>Walk:</strong> 3-5 mins to Victory Liner, 5-8 mins to SM Baguio & Session Rd.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-pine-50 text-pine-800 flex items-center justify-center flex-shrink-0 border border-pine-100">
                  <Car className="w-4 h-4 text-pine-700" strokeWidth={2} />
                </div>
                <span><strong>Drive / Taxi:</strong> 8-15 mins to Burnham Park, Camp John Hay & Mines View.</span>
              </div>
            </div>
          </div>

          {/* Nearby Destinations Showcase (5 cols) */}
          <div className="lg:col-span-5 space-y-5 flex flex-col">
            
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-card space-y-4">
              
              {/* Header with Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pine-50 to-cream-100 text-pine-800 flex items-center justify-center border border-pine-100 shadow-2xs">
                    <Navigation className="w-4 h-4 text-pine-800" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-pine-950">
                      Nearby Destinations
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Baguio landmarks & travel times</p>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="inline-flex p-1 rounded-xl bg-stone-100 gap-1 text-[11px] font-semibold self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setFilterCategory('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      filterCategory === 'all'
                        ? 'bg-pine-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-pine-950'
                    }`}
                  >
                    All ({landmarks.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterCategory('walk')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      filterCategory === 'walk'
                        ? 'bg-pine-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-pine-950'
                    }`}
                  >
                    Walk (2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterCategory('drive')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      filterCategory === 'drive'
                        ? 'bg-pine-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-pine-950'
                    }`}
                  >
                    Drive (3)
                  </button>
                </div>
              </div>

              {/* Destination Cards List */}
              <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1 overscroll-contain">
                {filteredLandmarks.map((landmark) => {
                  const isSelected = selectedLandmark?.id === landmark.id;
                  const isWalk = landmark.travelMode === 'walk';

                  return (
                    <div
                      key={landmark.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                        isSelected 
                          ? 'border-gold-500 ring-2 ring-gold-400/40 shadow-md bg-gold-50/20' 
                          : 'border-stone-200 hover:border-gold-300 hover:shadow-card'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-stretch">
                        
                        {/* Image Frame with perfectly tuned aspect ratio */}
                        <div className="relative sm:w-44 aspect-[16/10] sm:aspect-auto sm:h-auto overflow-hidden bg-stone-900 flex-shrink-0 group">
                          <img
                            src={landmark.image}
                            alt={landmark.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
                          
                          {/* Travel badge */}
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-pine-950/85 backdrop-blur-md text-gold-300 border border-white/10 shadow-xs">
                            {isWalk ? <Footprints className="w-3 h-3 text-gold-400" /> : <Car className="w-3 h-3 text-gold-400" />}
                            <span>{landmark.travelTime}</span>
                          </div>

                          {/* Full Photo Modal Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhotoModalLandmark(landmark);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-gold-500 text-white hover:text-pine-950 backdrop-blur-md transition-all shadow-md cursor-pointer"
                            title="View full uncut photo"
                          >
                            <Maximize2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Card Content */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold text-gold-800 uppercase tracking-wider bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200/50">
                                {landmark.category}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                                {landmark.distance}
                              </span>
                            </div>

                            <h4 className="font-serif font-bold text-sm text-pine-950 leading-snug">
                              {landmark.name}
                            </h4>

                            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                              {landmark.description}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectLandmarkFromCard(landmark)}
                              className={`text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-pine-900 text-white shadow-xs'
                                  : 'bg-stone-100 hover:bg-pine-100 text-pine-900'
                              }`}
                            >
                              <MapPin className="w-3 h-3 text-gold-500" />
                              <span>{isSelected ? 'Focused on Map' : 'Focus on Map'}</span>
                            </button>

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&origin=${MAP_CONFIG.propertyCoordinates[1]},${MAP_CONFIG.propertyCoordinates[0]}&destination=${landmark.coordinates[1]},${landmark.coordinates[0]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-slate-700 hover:text-pine-950 inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Directions</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Baguio Transportation Tip Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-pine-950 via-pine-900 to-pine-950 text-white border border-gold-500/30 shadow-luxury space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-gold-400" strokeWidth={2} />
                  <span>Baguio Taxi & Commuter Guide</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Honest Metered Fares
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Baguio City taxis are known for honest, metered fares and giving exact change. Simply say <strong className="text-gold-200 font-semibold">"Engineers' Hill, Vergara 2 Alley, Dragon Treasure"</strong> for straightforward drop-off right at our entrance.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Caretaker Hotline:</span>
                <a href={`tel:${DEMO_CONTACT.phone}`} className="font-bold text-gold-300 hover:text-white transition-colors flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3" />
                  <span>{DEMO_CONTACT.phone}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* FULL UNCUT PHOTO MODAL (LIGHTBOX) */}
      {photoModalLandmark && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-pine-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setPhotoModalLandmark(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col transform-gpu"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-100 bg-stone-50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-800 bg-gold-100 px-2 py-0.5 rounded-md border border-gold-200">
                    {photoModalLandmark.category}
                  </span>
                  <span className="text-xs font-bold text-pine-900 flex items-center gap-1 font-mono">
                    📍 {photoModalLandmark.distance} ({photoModalLandmark.travelTime})
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-pine-950 leading-tight">
                  {photoModalLandmark.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPhotoModalLandmark(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-200 text-slate-600 flex items-center justify-center border border-stone-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Container: 100% uncut and fitted perfectly */}
            <div className="flex-1 bg-stone-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-[300px] max-h-[62vh]">
              <img
                src={photoModalLandmark.image}
                alt={photoModalLandmark.name}
                className="max-h-[58vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-stone-100">
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                {photoModalLandmark.description}
              </p>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectLandmarkFromCard(photoModalLandmark);
                    setPhotoModalLandmark(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-pine-700" />
                  <span>Show on Map</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${MAP_CONFIG.propertyCoordinates[1]},${MAP_CONFIG.propertyCoordinates[0]}&destination=${photoModalLandmark.coordinates[1]},${photoModalLandmark.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pine-900 to-pine-950 hover:from-pine-950 hover:to-black text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold-300" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
