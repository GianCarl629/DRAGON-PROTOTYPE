/**
 * Mapbox Configuration for Dragon Treasure Transient & Condotel
 */

// Direct token fallback (keep empty in git, configure via .env or Vercel environment variables)
export const DIRECT_MAPBOX_TOKEN = '';

// Resolves token from .env (supports MAPBOX_TOKEN for Vercel, and VITE_MAPBOX_TOKEN) or direct fallback
export const MAPBOX_ACCESS_TOKEN = (
  (import.meta.env.MAPBOX_TOKEN as string | undefined) ||
  (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ||
  DIRECT_MAPBOX_TOKEN ||
  ''
).trim();

export interface LandmarkLocation {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number]; // [lng, lat]
  description: string;
  image: string;
  travelTime: string;
  travelMode: 'walk' | 'drive';
  distance: string;
}

export const MAP_CONFIG = {
  // Baguio City property location: [Longitude, Latitude]
  propertyCoordinates: [120.60225, 16.40803] as [number, number],
  propertyAddress: "95-B Vergara 2 Alley, Engineers' Hill, Baguio City, Philippines, 2600",
  propertyName: "Dragon Treasure Transient & Condotel",
  defaultZoom: 15.0,
  minZoom: 11,
  maxZoom: 18,
  defaultStyle: 'mapbox://styles/mapbox/streets-v12',
  outdoorsStyle: 'mapbox://styles/mapbox/outdoors-v12',
  satelliteStyle: 'mapbox://styles/mapbox/satellite-streets-v12',

  // Surrounding prominent Baguio landmarks with photography and coordinates from Engineers' Hill
  landmarks: [
    {
      id: "sm-baguio",
      name: "SM City Baguio & Session Road",
      category: "Shopping & Dining Hub",
      coordinates: [120.5995, 16.4095],
      description: "Premier shopping mall, skyline dining terraces, and vibrant historic Session Road promenade.",
      image: "/sm-city-baguio.jpg",
      travelTime: "5-8 mins",
      travelMode: "walk",
      distance: "650 m"
    },
    {
      id: "victory-liner",
      name: "Victory Liner Passenger Terminal",
      category: "Major Transit Hub",
      coordinates: [120.6030, 16.4055],
      description: "Direct provincial terminal connecting Baguio to Metro Manila, Clark, and northern Luzon.",
      image: "/victory-liner-passengers-line.jpg",
      travelTime: "3-5 mins",
      travelMode: "walk",
      distance: "400 m"
    },
    {
      id: "burnham-park",
      name: "Burnham Park",
      category: "Park & Recreation",
      coordinates: [120.5931, 16.4116],
      description: "Historic lake lagoon with swan boats, orchidarium, rose gardens, bicycle tracks, and picnic grounds.",
      image: "/burnham-park.avif",
      travelTime: "8-10 mins",
      travelMode: "drive",
      distance: "1.8 km"
    },
    {
      id: "camp-john-hay",
      name: "Camp John Hay",
      category: "Scenic Pine Forest Reserve",
      coordinates: [120.6152, 16.3980],
      description: "Pristine pine ridge forest trails, historical Bell Amphitheater, golf course, and artisan pine cafes.",
      image: "/camp-john-hay.jpg",
      travelTime: "10-12 mins",
      travelMode: "drive",
      distance: "3.2 km"
    },
    {
      id: "mines-view",
      name: "Mines View Park",
      category: "Panoramic Mountain Overlook",
      coordinates: [120.6272, 16.4178],
      description: "Spectacular ridge overlook of Benguet gold & copper mines, Cordillera cultural attire, and artisan silver crafts.",
      image: "/mines-view-park.jpg",
      travelTime: "15 mins",
      travelMode: "drive",
      distance: "4.5 km"
    }
  ] as LandmarkLocation[]
};
