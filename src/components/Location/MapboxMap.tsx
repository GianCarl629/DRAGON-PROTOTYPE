import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  MAPBOX_ACCESS_TOKEN, 
  MAP_CONFIG, 
  LandmarkLocation 
} from '../../config/mapConfig';
import { 
  RotateCcw, 
  ExternalLink, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Navigation,
  Car,
  Sparkles,
  Mountain,
  Maximize2,
  Minimize2,
  Footprints,
  Camera,
  Compass
} from 'lucide-react';

interface MapboxMapProps {
  selectedLandmarkId?: string | null;
  onSelectLandmark?: (landmark: LandmarkLocation | null) => void;
  onOpenPhotoModal?: (landmark: LandmarkLocation) => void;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({ 
  selectedLandmarkId, 
  onSelectLandmark,
  onOpenPhotoModal
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<{ [id: string]: mapboxgl.Popup }>({});

  const [token, setToken] = useState<string>(MAPBOX_ACCESS_TOKEN);
  const [inputToken, setInputToken] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<'streets' | 'outdoors' | 'satellite'>('streets');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const isTokenConfigured = Boolean(token && token.trim().startsWith('pk.'));

  // Expose photo modal trigger to window for marker popups
  useEffect(() => {
    (window as any).__openDragonLandmarkPhoto = (landmarkId: string) => {
      const found = MAP_CONFIG.landmarks.find(l => l.id === landmarkId);
      if (found && onOpenPhotoModal) {
        onOpenPhotoModal(found);
      }
    };
    return () => {
      delete (window as any).__openDragonLandmarkPhoto;
    };
  }, [onOpenPhotoModal]);

  // Initialize Mapbox map
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
        pitch: is3DMode ? 52 : 0,
        bearing: is3DMode ? -18 : 0,
        attributionControl: true,
        cooperativeGestures: true
      });

      // Navigation Control
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);

        // Clear existing markers & popups
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        popupsRef.current = {};

        // 1. Dragon Treasure Property Custom Marker
        const mainEl = document.createElement('div');
        mainEl.className = 'group cursor-pointer relative z-30';
        mainEl.innerHTML = `
          <div class="relative flex items-center justify-center">
            <!-- Pulsing outer halo -->
            <span class="absolute w-14 h-14 rounded-full bg-gold-400/40 animate-ping pointer-events-none"></span>
            <div class="relative w-12 h-12 rounded-full bg-pine-950 border-2 border-gold-400 shadow-luxury overflow-hidden flex items-center justify-center transition-all transform group-hover:scale-110 duration-300 ring-4 ring-pine-950/30">
              <img src="/dragon-treasure-logo.jpg" alt="Dragon Treasure" class="w-full h-full object-cover scale-[1.08]" />
            </div>
            <!-- Pointer pin -->
            <div class="absolute -bottom-2 w-3.5 h-3.5 bg-gold-500 rotate-45 border-r-2 border-b-2 border-pine-950"></div>
          </div>
        `;

        const propertyPopupContent = `
          <div class="text-slate-800 font-sans max-w-[270px] overflow-hidden rounded-2xl shadow-xl">
            <div class="bg-gradient-to-br from-pine-950 to-pine-900 text-white p-3.5">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full overflow-hidden border-2 border-gold-400 flex-shrink-0 bg-pine-950">
                  <img src="/dragon-treasure-logo.jpg" alt="Dragon Treasure Logo" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 class="font-bold text-xs text-white leading-tight font-serif">Dragon Treasure</h4>
                  <span class="text-[10px] text-gold-300 font-semibold uppercase tracking-wider">Transient & Condotel</span>
                </div>
              </div>
            </div>
            <div class="p-3.5 bg-white space-y-2.5">
              <p class="text-[11px] text-slate-600 leading-relaxed font-medium">
                📍 95-B Vergara 2 Alley, Engineers' Hill, Baguio City
              </p>
              <div class="text-[10px] text-slate-500 bg-stone-50 p-2 rounded-xl border border-stone-200">
                ✨ Central location: 3-5 mins to Victory Liner, 5-8 mins walk to Session Road & SM Baguio.
              </div>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${MAP_CONFIG.propertyCoordinates[1]},${MAP_CONFIG.propertyCoordinates[0]}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center justify-center gap-1.5 w-full text-xs font-bold text-white bg-gradient-to-r from-pine-900 to-pine-950 hover:from-pine-950 hover:to-black px-3 py-2 rounded-xl transition-all shadow-md"
              >
                <span>Navigate to Property</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>
        `;

        const mainPopup = new mapboxgl.Popup({ 
          offset: 28, 
          closeButton: false,
          focusAfterOpen: false 
        }).setHTML(propertyPopupContent);

        const propertyMarker = new mapboxgl.Marker({ element: mainEl, anchor: 'bottom' })
          .setLngLat(MAP_CONFIG.propertyCoordinates)
          .setPopup(mainPopup)
          .addTo(map);

        markersRef.current.push(propertyMarker);
        popupsRef.current['property'] = mainPopup;

        // Open popup by default
        propertyMarker.togglePopup();

        // 2. Add Surrounding Landmark Markers
        MAP_CONFIG.landmarks.forEach((landmark) => {
          const lEl = document.createElement('div');
          lEl.id = `map-marker-${landmark.id}`;
          lEl.className = 'cursor-pointer group flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-stone-300/90 text-pine-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md hover:bg-pine-900 hover:text-white hover:border-pine-900 transition-all transform hover:scale-108';
          
          const iconSymbol = landmark.travelMode === 'walk' ? '🚶' : '🚖';
          lEl.innerHTML = `
            <span class="w-2 h-2 rounded-full bg-gold-500 group-hover:bg-gold-400"></span>
            <span>${landmark.name.split('&')[0].trim()}</span>
            <span class="text-[9px] font-mono text-slate-500 group-hover:text-gold-200">(${landmark.travelTime})</span>
          `;

          const landmarkPopupHtml = `
            <div class="text-slate-800 font-sans max-w-[270px] overflow-hidden rounded-2xl shadow-xl">
              <!-- Photo Container with fitted aspect ratio -->
              <div class="aspect-[16/10] w-full overflow-hidden bg-stone-900 relative group/photo">
                <img 
                  src="${landmark.image}" 
                  alt="${landmark.name}" 
                  class="w-full h-full object-cover object-center" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <span class="absolute top-2 left-2 text-[9px] font-bold text-white uppercase tracking-wider bg-pine-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/20">
                  ${landmark.category}
                </span>

                <span class="absolute bottom-2 left-2 text-[10px] font-bold text-gold-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  ${iconSymbol} ${landmark.travelTime} (${landmark.distance})
                </span>

                <!-- Full Photo Lightbox Trigger Button -->
                <button 
                  type="button"
                  onclick="window.__openDragonLandmarkPhoto && window.__openDragonLandmarkPhoto('${landmark.id}')"
                  class="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-white/90 hover:bg-gold-500 text-pine-950 text-[10px] font-bold shadow transition-all cursor-pointer inline-flex items-center gap-1"
                  title="View full uncut photo"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                  <span>Full Photo</span>
                </button>
              </div>

              <!-- Content Body -->
              <div class="p-3.5 space-y-2 bg-white">
                <h4 class="font-bold text-xs text-pine-950 leading-tight font-serif">${landmark.name}</h4>
                <p class="text-[11px] text-slate-600 leading-relaxed font-normal">${landmark.description}</p>
                
                <div class="pt-1 flex gap-1.5">
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&origin=${MAP_CONFIG.propertyCoordinates[1]},${MAP_CONFIG.propertyCoordinates[0]}&destination=${landmark.coordinates[1]},${landmark.coordinates[0]}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="flex-1 inline-flex items-center justify-center gap-1 text-[11px] font-bold text-white bg-pine-900 hover:bg-pine-950 px-2.5 py-1.5 rounded-xl transition-all shadow-xs"
                  >
                    <span>Directions</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </a>
                </div>
              </div>
            </div>
          `;

          const lPopup = new mapboxgl.Popup({ 
            offset: 18, 
            closeButton: false,
            focusAfterOpen: false 
          }).setHTML(landmarkPopupHtml);

          const lMarker = new mapboxgl.Marker({ element: lEl, anchor: 'center' })
            .setLngLat(landmark.coordinates)
            .setPopup(lPopup)
            .addTo(map);

          lEl.addEventListener('click', () => {
            if (onSelectLandmark) onSelectLandmark(landmark);
          });

          markersRef.current.push(lMarker);
          popupsRef.current[landmark.id] = lPopup;
        });

        // 3. Draw route lines layer from Dragon Treasure to Landmarks
        try {
          const routeFeatures = MAP_CONFIG.landmarks.map((l) => ({
            type: 'Feature',
            properties: { id: l.id, name: l.name },
            geometry: {
              type: 'LineString',
              coordinates: [MAP_CONFIG.propertyCoordinates, l.coordinates]
            }
          }));

          map.addSource('route-lines', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: routeFeatures as any
            }
          });

          map.addLayer({
            id: 'route-lines-glow',
            type: 'line',
            source: 'route-lines',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#d4af37',
              'line-width': 3,
              'line-opacity': 0.35,
              'line-dasharray': [2, 2]
            }
          });
        } catch (routeErr) {
          console.debug('Route line layer note:', routeErr);
        }
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

  // Handle selected landmark changes
  useEffect(() => {
    if (!mapRef.current || !selectedLandmarkId) return;

    const landmark = MAP_CONFIG.landmarks.find(l => l.id === selectedLandmarkId);
    if (!landmark) return;

    // Fly camera smoothly to landmark
    mapRef.current.flyTo({
      center: landmark.coordinates,
      zoom: 15.5,
      essential: true,
      duration: 1200
    });

    // Open popup
    const popup = popupsRef.current[landmark.id];
    if (popup && !popup.isOpen()) {
      // Close other popups
      Object.values(popupsRef.current).forEach(p => {
        if (p.isOpen()) p.remove();
      });
      popup.addTo(mapRef.current);
    }
  }, [selectedLandmarkId]);

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
      // Close landmark popups and open property popup
      Object.entries(popupsRef.current).forEach(([k, p]) => {
        if (k !== 'property' && p.isOpen()) p.remove();
      });
      if (popupsRef.current['property'] && !popupsRef.current['property'].isOpen()) {
        popupsRef.current['property'].addTo(mapRef.current);
      }

      mapRef.current.flyTo({
        center: MAP_CONFIG.propertyCoordinates,
        zoom: MAP_CONFIG.defaultZoom,
        pitch: is3DMode ? 52 : 0,
        bearing: is3DMode ? -18 : 0,
        essential: true,
        duration: 1200
      });

      if (onSelectLandmark) onSelectLandmark(null);
    }
  };

  // Toggle 3D mountain perspective
  const handleToggle3D = () => {
    const next3D = !is3DMode;
    setIs3DMode(next3D);
    if (mapRef.current) {
      mapRef.current.easeTo({
        pitch: next3D ? 52 : 0,
        bearing: next3D ? -18 : 0,
        duration: 1000
      });
    }
  };

  // Fly to landmark
  const handleFlyToLandmark = (landmark: LandmarkLocation) => {
    if (onSelectLandmark) onSelectLandmark(landmark);
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
    <div className={`relative w-full rounded-3xl overflow-hidden border border-stone-200/90 shadow-luxury bg-stone-900 flex flex-col transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-4 sm:inset-8 z-50 h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] max-w-none shadow-2xl' 
        : 'h-[440px] sm:h-[530px]'
    }`}>
      {/* Active Interactive Mapbox Container */}
      {isTokenConfigured && !mapError ? (
        <>
          <div ref={mapContainerRef} className="w-full h-full relative" />

          {/* Top Floating Map Controls Toolbar */}
          <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            
            {/* Left Controls: Center & 3D Tilt */}
            <div 
              className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-2xl shadow-elevated border border-stone-300 text-xs pointer-events-auto"
              style={{ backgroundColor: '#ffffff' }}
            >
              <button
                type="button"
                onClick={handleResetCenter}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-pine-950 hover:bg-stone-100 transition-colors font-semibold cursor-pointer"
                title="Center on Dragon Treasure"
              >
                <RotateCcw className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                <span className="hidden sm:inline">Center Property</span>
              </button>

              <div className="w-px h-4 bg-stone-200" />

              <button
                type="button"
                onClick={handleToggle3D}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all font-semibold cursor-pointer ${
                  is3DMode 
                    ? 'bg-pine-900 text-gold-300 shadow-xs' 
                    : 'text-slate-700 hover:text-pine-950 hover:bg-stone-100'
                }`}
                title="Toggle 3D Mountain Perspective"
              >
                <Mountain className="w-3.5 h-3.5 text-gold-500" strokeWidth={2} />
                <span>3D Terrain</span>
              </button>
            </div>

            {/* Right Controls: Style Switcher & Fullscreen */}
            <div 
              className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-2xl shadow-elevated border border-stone-300 text-xs pointer-events-auto"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="flex items-center gap-0.5">
                {(['streets', 'outdoors', 'satellite'] as const).map((styleKey) => {
                  const label = styleKey === 'streets' ? 'Streets' : styleKey === 'outdoors' ? 'Terrain' : 'Satellite';
                  return (
                    <button
                      key={styleKey}
                      type="button"
                      onClick={() => handleStyleChange(styleKey)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        currentStyle === styleKey 
                          ? 'bg-pine-900 text-white shadow-xs font-bold' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-4 bg-stone-200" />

              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-slate-700 hover:text-pine-950 hover:bg-stone-100 transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Centered Floating Dock (100% Solid White Non-Transparent Background) */}
          <div className="absolute bottom-3.5 left-2 right-2 sm:left-4 sm:right-4 z-20 pointer-events-auto flex justify-center">
            <div 
              className="bg-white border-2 border-stone-300 text-slate-900 p-1.5 sm:p-2 rounded-2xl shadow-2xl flex items-center gap-1.5 max-w-full overflow-x-auto scrollbar-none ring-1 ring-black/10"
              style={{ backgroundColor: '#ffffff' }}
            >
              
              {/* Quick Jump Anchor Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gold-100 border border-gold-300 text-pine-950 text-xs font-bold whitespace-nowrap flex-shrink-0 select-none">
                <Navigation className="w-3.5 h-3.5 text-gold-700" strokeWidth={2.2} />
                <span className="hidden sm:inline tracking-wide">Jump to:</span>
              </div>

              {/* Dragon Treasure Property Chip */}
              <button
                type="button"
                onClick={handleResetCenter}
                className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex-shrink-0 text-xs font-semibold ${
                  !selectedLandmarkId
                    ? 'bg-pine-900 text-white font-bold shadow-md ring-2 ring-gold-400'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200'
                }`}
                title="Center on Dragon Treasure property"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden border border-gold-400 bg-pine-950 flex-shrink-0">
                  <img src="/dragon-treasure-logo.jpg" alt="Dragon Treasure" className="w-full h-full object-cover scale-110" />
                </div>
                <span className="whitespace-nowrap font-serif">Dragon Treasure</span>
              </button>

              {/* Vertical divider */}
              <div className="w-px h-5 bg-stone-300 flex-shrink-0 my-auto mx-0.5" />

              {/* Landmark Destination Chips with Micro-Photos */}
              {MAP_CONFIG.landmarks.map((landmark) => {
                const isSelected = selectedLandmarkId === landmark.id;
                const isWalk = landmark.travelMode === 'walk';
                const shortName = landmark.name
                  .replace(' & Session Road', '')
                  .replace(' Passenger Terminal', '')
                  .trim();

                return (
                  <button
                    key={landmark.id}
                    type="button"
                    onClick={() => handleFlyToLandmark(landmark)}
                    className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex-shrink-0 text-xs ${
                      isSelected
                        ? 'bg-pine-900 text-white font-bold shadow-md ring-2 ring-gold-400 transform scale-[1.02]'
                        : 'bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 hover:border-gold-400'
                    }`}
                    title={`Fly to ${landmark.name} (${landmark.travelTime})`}
                  >
                    {/* Micro Thumbnail Photo */}
                    <div className={`w-5 h-5 rounded-md overflow-hidden flex-shrink-0 border transition-transform group-hover:scale-105 ${
                      isSelected ? 'border-gold-400 shadow-xs' : 'border-stone-300'
                    }`}>
                      <img 
                        src={landmark.image} 
                        alt={landmark.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                    </div>

                    <span className="whitespace-nowrap font-medium">{shortName}</span>

                    {/* Mode & Travel Time Badge */}
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                      isSelected 
                        ? 'bg-pine-950 text-gold-300 font-bold' 
                        : 'bg-white text-slate-700 border border-stone-200 shadow-2xs'
                    }`}>
                      {isWalk ? <Footprints className="w-2.5 h-2.5 text-pine-700" /> : <Car className="w-2.5 h-2.5 text-pine-700" />}
                      <span>{landmark.travelTime.replace(' mins', 'm').replace(' min', 'm')}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Standby Interface if Token Fails */
        <div className="relative w-full h-full bg-gradient-to-br from-stone-100 via-pine-50/50 to-stone-200 p-6 sm:p-8 flex flex-col justify-between items-center text-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14392e_1px,transparent_1px)] [background-size:18px_18px]" />

          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="text-xs font-semibold text-pine-950 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs border border-stone-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
              Baguio City Map
            </span>
            <span className="text-[11px] font-bold text-gold-900 bg-gold-100/90 px-3 py-1 rounded-full border border-gold-300/80 shadow-xs">
              Interactive Map
            </span>
          </div>

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
                Interactive Map Loading
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Connect your Mapbox public token or enter below to activate live 3D terrain:
              </p>
            </div>

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
                  className="px-4 py-2.5 bg-pine-900 hover:bg-pine-950 active:scale-95 text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
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
          </div>

          <div className="relative z-10 w-full flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-600">
            <span className="font-bold text-pine-950">Landmarks:</span>
            {MAP_CONFIG.landmarks.map(l => (
              <span key={l.id} className="bg-white/90 px-2.5 py-1 rounded-full border border-stone-200 shadow-xs font-medium">
                {l.name.split('&')[0].trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
