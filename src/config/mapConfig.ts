/**
 * Mapbox Configuration for Dragon Treasure Transient & Condotel
 * 
 * Instructions:
 * 1. Primary location: Paste your Mapbox Default Public Token into the .env file:
 *    MAPBOX_TOKEN=pk.eyJ1...
 * 
 * 2. Optional direct fallback: You can also paste it directly into DIRECT_MAPBOX_TOKEN below.
 */

// Optional fallback if not using .env
export const DIRECT_MAPBOX_TOKEN = '';

// Resolves token from .env (supports MAPBOX_TOKEN for Vercel, and VITE_MAPBOX_TOKEN) or direct fallback
export const MAPBOX_ACCESS_TOKEN = (
  (import.meta.env.MAPBOX_TOKEN as string | undefined) ||
  (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ||
  DIRECT_MAPBOX_TOKEN ||
  ''
).trim();

export interface LandmarkLocation {
  name: string;
  category: string;
  coordinates: [number, number]; // [lng, lat]
  description: string;
  image: string;
}

export const MAP_CONFIG = {
  // Baguio City property location: [Longitude, Latitude]
  propertyCoordinates: [120.60225, 16.40803] as [number, number],
  propertyAddress: "95-B Vergara 2 Alley, Engineers' Hill, Baguio City, Philippines, 2600",
  propertyName: "Dragon Treasure Transient & Condotel",
  defaultZoom: 15.2,
  minZoom: 11,
  maxZoom: 18,
  defaultStyle: 'mapbox://styles/mapbox/streets-v12',
  outdoorsStyle: 'mapbox://styles/mapbox/outdoors-v12',
  satelliteStyle: 'mapbox://styles/mapbox/satellite-streets-v12',

  // Surrounding prominent Baguio landmarks with photography and coordinates from Engineers' Hill
  landmarks: [
    {
      name: "SM City Baguio & Session Road",
      category: "Shopping & Dining Hub",
      coordinates: [120.5995, 16.4095],
      description: "5-8 mins walk • Premier shopping mall, dining terraces, and vibrant Session Road.",
      image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Victory Liner Passenger Terminal",
      category: "Major Transit Hub",
      coordinates: [120.6030, 16.4055],
      description: "3-5 mins walk • Intercity bus terminal providing direct transit from Metro Manila.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Burnham Park",
      category: "Park & Recreation",
      coordinates: [120.5931, 16.4116],
      description: "8-10 mins drive • Historic lake lagoon, rose gardens, skating rink, and open grounds.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Camp John Hay",
      category: "Scenic Pine Forest Reserve",
      coordinates: [120.6152, 16.3980],
      description: "10-12 mins drive • Towering pine forest trails, Bell Amphitheater, and artisan cafes.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Mines View Park",
      category: "Panoramic Mountain Overlook",
      coordinates: [120.6272, 16.4178],
      description: "15 mins drive • Breathtaking ridge overlook of Benguet mountains and local crafts.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    }
  ] as LandmarkLocation[]
};
