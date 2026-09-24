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
  propertyCoordinates: [120.5960, 16.4023] as [number, number],
  propertyAddress: "Baguio City, Benguet, Philippines",
  propertyName: "Dragon Treasure Transient & Condotel",
  defaultZoom: 14.2,
  minZoom: 11,
  maxZoom: 18,
  defaultStyle: 'mapbox://styles/mapbox/streets-v12',
  outdoorsStyle: 'mapbox://styles/mapbox/outdoors-v12',
  satelliteStyle: 'mapbox://styles/mapbox/satellite-streets-v12',

  // Surrounding prominent Baguio landmarks with photography and coordinates
  landmarks: [
    {
      name: "Burnham Park",
      category: "Park & Recreation",
      coordinates: [120.5931, 16.4116],
      description: "10-15 mins drive • Historic lake lagoon, rose gardens, skating rink, and picnic areas.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Session Road & SM Baguio",
      category: "Commercial & Dining Hub",
      coordinates: [120.5995, 16.4095],
      description: "12 mins drive • Baguio's vibrant main commercial street, iconic cafes, restaurants, and retail.",
      image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Camp John Hay",
      category: "Scenic Pine Forest Reserve",
      coordinates: [120.6152, 16.3980],
      description: "18 mins drive • Famous walking trails, towering pine trees, outdoor cafes, and golf club.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Mines View Park",
      category: "Panoramic Mountain Overlook",
      coordinates: [120.6272, 16.4178],
      description: "20 mins drive • Breathtaking ridge overlook of Benguet mountains and traditional souvenir shops.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    }
  ] as LandmarkLocation[]
};
