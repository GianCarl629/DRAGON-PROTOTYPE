import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  MAPBOX_ACCESS_TOKEN, 
  MAP_CONFIG, 
  LandmarkLocation 
} from '../../config/mapConfig';
import { 
  Compass, 
  Layers, 
  RotateCcw, 
  ExternalLink, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Navigation,
  Car,
  Sparkles
} from 'lucide-react';

interface MapboxMapProps {
  onSelectLandmark?: (landmark: LandmarkLocation) => void;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({ onSelectLandmark }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Token management: check env/config or allow runtime quick-paste test
  const [token, setToken] = useState<string>(MAPBOX_ACCESS_TOKEN);
  const [inputToken, setInputToken] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<'streets' | 'outdoors' | 'satellite'>('streets');

  const isTokenConfigured = Boolean(token && token.trim().startsWith('pk.'));

  // Initialize Mapbox map when token is present
  useEffect(() => {
    if (!isTokenConfigured || !mapContainerRef.current) return;

    try {
      mapboxgl.accessToken = token.trim();
      setMapError(null);

      const styleUrls = {
        streets: MAP_CONFIG.defaultStyle,
        outdoors: MAP_CONFIG.outdoorsStyle,
        satellite: MAP_CONFIG.satelliteStyle
      };

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: styleUrls[currentStyle],
        center: MAP_CONFIG.propertyCoordinates,
        zoom: MAP_CONFIG.defaultZoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        attributionControl: true
      });

      // Navigation control (zoom in/out, pitch, bearing)
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);

        // Clear existing markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // 1. Create Main Dragon Treasure Property Marker
        const mainEl = document.createElement('div');
        mainEl.className = 'group cursor-pointer relative';
        mainEl.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-pine-950 border-2 border-gold-500 shadow-glow-gold overflow-hidden flex items-center justify-center transition-transform transform group-hover:scale-115 duration-300">
              <img src="/dragon-treasure-logo.jpg" alt="Dragon Treasure" class="w-full h-full object-cover scale-[1.10]" />
            </div>
            <div class="absolute -inset-1.5 rounded-full bg-gold-400/40 animate-ping -z-10"></div>
            <div class="absolute -bottom-1.5 w-3 h-3 bg-gold-500 rotate-45 border-r border-b border-pine-950"></div>
          </div>
        `;

        const propertyPopupContent = `
          <div class="text-slate-800 font-sans max-w-[250px] overflow-hidden rounded-xl">
            <div class="p-3.5">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 rounded-full overflow-hidden border border-gold-500 flex-shrink-0 bg-pine-950">
                  <img src="/dragon-treasure-logo.jpg" alt="Logo" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 class="font-bold text-xs text-pine-950 leading-tight">Dragon Treasure</h4>
                  <span class="text-[10px] text-gold-700 font-semibold uppercase">Transient & Condotel</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
                Baguio City, Benguet • Short-term lodging & monthly dormitory rentals.
              </p>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${MAP_CONFIG.propertyCoordinates[1]},${MAP_CONFIG.propertyCoordinates[0]}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center justify-center gap-1.5 w-full text-[11px] font-semibold text-white bg-pine-900 hover:bg-pine-950 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                <span>Get Directions</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>
        `;

        const mainPopup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(propertyPopupContent);

        const propertyMarker = new mapboxgl.Marker({ element: mainEl, anchor: 'bottom' })
          .setLngLat(MAP_CONFIG.propertyCoordinates)
          .setPopup(mainPopup)
          .addTo(map);

        markersRef.current.push(propertyMarker);

        // Open popup by default
        propertyMarker.togglePopup();

        // 2. Add Surrounding Landmark Markers with Photos & Directions
        MAP_CONFIG.landmarks.forEach((landmark) => {
          const lEl = document.createElement('div');
          lEl.className = 'cursor-pointer group flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-stone-300 text-pine-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md hover:bg-pine-900 hover:text-white hover:border-pine-900 transition-all transform hover:scale-108';
          lEl.innerHTML = `
            <span class="w-2 h-2 rounded-full bg-gold-500 group-hover:bg-gold-400"></span>
            <span>${landmark.name.split('&')[0].trim()}</span>
          `;

          const landmarkPopupHtml = `
            <div class="text-slate-800 font-sans max-w-[240px] overflow-hidden rounded-xl">
              <div class="h-28 w-full overflow-hidden bg-stone-900 relative">
                <img src="${landmark.image}" alt="${landmark.name}" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span class="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                  ${landmark.category}
                </span>
              </div>
              <div class="p-3">
                <h4 class="font-bold text-xs text-pine-950 mb-1 leading-tight">${landmark.name}</h4>
                <p class="text-[11px] text-slate-600 mb-2.5 leading-snug">${landmark.description}</p>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=${landmark.coordinates[1]},${landmark.coordinates[0]}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="inline-flex items-center justify-center gap-1.5 w-full text-[11px] font-semibold text-white bg-pine-900 hover:bg-pine-950 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                >
                  <span>Get Directions</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </div>
          `;

          const lPopup = new mapboxgl.Popup({ offset: 15, closeButton: false })
            .setHTML(landmarkPopupHtml);

          const lMarker = new mapboxgl.Marker({ element: lEl, anchor: 'center' })
            .setLngLat(landmark.coordinates)
            .setPopup(lPopup)
            .addTo(map);

          lEl.addEventListener('click', () => {
            if (onSelectLandmark) onSelectLandmark(landmark);
          });

          markersRef.current.push(lMarker);
        });
      });

      map.on('error', (e: any) => {
        if (e.error?.message?.includes('Forbidden') || e.error?.message?.includes('Unauthorized') || e.status === 401) {
          setMapError('Invalid Mapbox token or unauthorized access. Please verify the token.');
        }
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (err: any) {
      console.warn('Mapbox initialization notice:', err);
      setMapError(err?.message || 'Failed to initialize Mapbox.');
    }
  }, [token, currentStyle]);

  // Style change handler
  const handleStyleChange = (newStyle: 'streets' | 'outdoors' | 'satellite') => {
    setCurrentStyle(newStyle);
    if (mapRef.current) {
      const styleUrls = {
        streets: MAP_CONFIG.defaultStyle,
        outdoors: MAP_CONFIG.outdoorsStyle,
        satellite: MAP_CONFIG.satelliteStyle
      };
      mapRef.current.setStyle(styleUrls[newStyle]);
    }
  };

  // Reset to property location
  const handleResetCenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: MAP_CONFIG.propertyCoordinates,
        zoom: MAP_CONFIG.defaultZoom,
        essential: true,
        duration: 1200
      });
    }
  };

  // Fly to landmark
  const handleFlyToLandmark = (landmark: LandmarkLocation) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: landmark.coordinates,
        zoom: 15,
        essential: true,
        duration: 1400
      });
    }
  };

  // Immediate runtime token test
  const handleApplyRuntimeToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim().startsWith('pk.')) {
      setToken(inputToken.trim());
      setMapError(null);
    } else {
      setMapError('Mapbox public tokens usually begin with "pk." — please check your token.');
    }
  };

  return (
    <div className="relative w-full h-[420px] sm:h-[490px] rounded-3xl overflow-hidden border border-stone-200/90 shadow-luxury bg-stone-100 flex flex-col">
      {/* Active Interactive Mapbox Container */}
      {isTokenConfigured && !mapError ? (
        <>
          <div ref={mapContainerRef} className="w-full h-full relative" />

          {/* Top Floating Map Controls Toolbar */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-elevated border border-stone-200/90 text-xs">
            <button
              onClick={handleResetCenter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-pine-950 hover:bg-stone-100 transition-colors font-semibold"
              title="Center on Dragon Treasure"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
              <span>Center Property</span>
            </button>

            <div className="w-px h-4 bg-stone-200" />

            {/* Style Switcher */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => handleStyleChange('streets')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  currentStyle === 'streets' 
                    ? 'bg-pine-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                }`}
              >
                Streets
              </button>
              <button
                onClick={() => handleStyleChange('outdoors')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  currentStyle === 'outdoors' 
                    ? 'bg-pine-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                }`}
              >
                Terrain
              </button>
              <button
                onClick={() => handleStyleChange('satellite')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  currentStyle === 'satellite' 
                    ? 'bg-pine-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          {/* Top-Right Coordinates Pill (Clean, avoids crowding bottom) */}
          <div className="absolute top-3.5 right-14 z-10 hidden md:flex items-center gap-1.5 bg-pine-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl border border-gold-500/30 text-[11px] shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-gold-300">Baguio City:</span>
            <span>16.4023° N, 120.5960° E</span>
          </div>

          {/* Bottom Floating Jump-To Bar (Clean flex-wrap, NO horizontal scroll) */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-stone-200/90 shadow-lg">
            <div className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold text-pine-950 flex-shrink-0">
              <Navigation className="w-3.5 h-3.5 text-gold-600" strokeWidth={2} />
              <span>Explore:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {MAP_CONFIG.landmarks.map((landmark) => (
                <button
                  key={landmark.name}
                  onClick={() => handleFlyToLandmark(landmark)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-stone-100 hover:bg-pine-900 hover:text-white text-slate-700 transition-colors shadow-2xs"
                >
                  {landmark.name.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Standby Interface */
        <div className="relative w-full h-full bg-gradient-to-br from-stone-100 via-pine-50/50 to-stone-200 p-6 sm:p-8 flex flex-col justify-between items-center text-center">
          {/* Subtle Radial Grid Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14392e_1px,transparent_1px)] [background-size:18px_18px]" />

          {/* Top Bar Preview */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="text-xs font-semibold text-pine-950 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs border border-stone-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
              Baguio City Map Integration Ready
            </span>
            <span className="text-[11px] font-bold text-gold-900 bg-gold-100/90 px-3 py-1 rounded-full border border-gold-300/80 shadow-xs">
              Mapbox Integration
            </span>
          </div>

          {/* Central Property Crest & Instructions */}
          <div className="relative z-10 my-auto max-w-md w-full bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-luxury space-y-4">
            <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-gold-500 bg-pine-950 shadow-glow-gold">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure"
                className="w-full h-full object-cover scale-[1.10]"
              />
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-pine-950">
                Interactive Map Ready
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Add your token to <code className="px-1.5 py-0.5 rounded bg-stone-100 text-pine-900 font-mono text-[11px] font-bold border border-stone-200">.env</code> as <code className="px-1.5 py-0.5 rounded bg-stone-100 text-pine-900 font-mono text-[11px] font-bold border border-stone-200">MAPBOX_TOKEN=pk...</code> or activate below:
              </p>
            </div>

            {/* Quick Test Paste Input */}
            <form onSubmit={handleApplyRuntimeToken} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste Mapbox token (pk.eyJ1...)"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  className="flex-1 text-xs bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 font-mono"
                />
                <button
                  type="submit"
                  className="shimmer-btn px-4 py-2.5 bg-pine-900 hover:bg-pine-950 active:scale-95 text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 text-gold-300" strokeWidth={2} />
                  <span>Activate</span>
                </button>
              </div>

              {mapError && (
                <p className="text-[11px] text-red-600 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{mapError}</span>
                </p>
              )}
            </form>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
                Baguio Coordinates Linked
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
                Landmark Images & Directions
              </span>
            </div>
          </div>

          {/* Bottom Landmark Badges */}
          <div className="relative z-10 w-full flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-600">
            <span className="font-bold text-pine-950">Featured Destinations:</span>
            <span className="bg-white/90 px-2.5 py-1 rounded-full border border-stone-200 shadow-xs font-medium">Burnham Park</span>
            <span className="bg-white/90 px-2.5 py-1 rounded-full border border-stone-200 shadow-xs font-medium">Session Road</span>
            <span className="bg-white/90 px-2.5 py-1 rounded-full border border-stone-200 shadow-xs font-medium">Camp John Hay</span>
            <span className="bg-white/90 px-2.5 py-1 rounded-full border border-stone-200 shadow-xs font-medium">Mines View</span>
          </div>
        </div>
      )}
    </div>
  );
};
