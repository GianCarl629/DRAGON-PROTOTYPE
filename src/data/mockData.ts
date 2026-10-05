/**
 * MOCK DATA ONLY - Dragon Treasure Transient & Condotel
 * 
 * IMPORTANT:
 * All room prices, contact details, amenities, policies, and room counts
 * in this file are temporary demonstration data for the frontend prototype.
 * Structure has been designed so that it can easily be swapped with 
 * database queries (e.g. Supabase, Prisma, REST API) in future milestones.
 */

import { Room, Amenity, FAQItem, ContactInfo } from '../types';

export const PROPERTY_INFO = {
  name: "Dragon Treasure Transient & Condotel",
  shortName: "Dragon Treasure",
  tagline: "Comfortable Mountain Lodging & Student Accommodations in the Summer Capital",
  location: "Baguio City, Benguet",
  description: "Dragon Treasure Transient & Condotel is a lodging property in Baguio City that offers short-term accommodations and monthly dormitory rentals.",
  aboutStory: "Nestled in the cool heights of Baguio City, Dragon Treasure Transient & Condotel serves both vacationers seeking a peaceful mountain getaway and students or reviewees needing long-term dormitory living. Combining home-style warmth with condotel conveniences, we provide an accessible, secure, and relaxing haven in the City of Pines.",
  isPrototype: true
};

/**
 * SAMPLE ROOM INVENTORY (DEMO DATA ONLY)
 * Replace with API / Database endpoint: GET /api/rooms
 */
/**
 * SAMPLE ROOM INVENTORY (DEMO DATA ONLY - Updated Units)
 * 
 * Vibe: Premium, modern minimalist, cozy Baguio feels.
 * White walls, white square floor tiles, dark wood accents, matte black industrial fixtures, and red accents.
 */
export const SAMPLE_ROOMS: Room[] = [
  {
    id: "room-a-twin",
    name: "Premium Twin Room",
    category: "transient",
    capacity: 4,
    capacityLabel: "4 Pax",
    rate: 2000,
    ratePeriod: "night",
    formattedRate: "₱2,000 / night",
    sampleQuantity: 4,
    vibe: "Premium, modern minimalist, cozy Baguio feels with white walls, dark wood accents, matte black industrial fixtures, and red accents.",
    description: "Spacious and cozy Baguio retreat equipped with two single beds, crisp white sheets, and warm red blankets. Features wooden vanity desk, closed wardrobe, and scenic mountain views.",
    image: "/premium-twin-room.jpg",
    features: [
      "Two (2) single beds with solid white box base & crisp white sheets",
      "Thick warm red blankets",
      "Wooden vanity desk with chair and mirror",
      "Closed wooden wardrobe cabinet",
      "Warm bedside lamp",
      "Matte black electric stand fan",
      "Glass sliding window with red pull-cord roller blinds",
      "Scenic panoramic view of Baguio"
    ],
    sharedAmenities: [
      "Lounge Area with black leather armchairs & warm lighting",
      "Dining Area with rectangular table & red mantel",
      "Kitchenette with white mini-fridge, electric kettle, plates & cups",
      "Wall-mounted flat-screen TV in unit common area",
      "Clean comfort room with steady water supply & water heater",
      "Solid white paneled doors & 24/7 CCTV surveillance"
    ],
    popular: true
  },
  {
    id: "room-b-large",
    name: "Premium Large Room",
    category: "transient",
    capacity: 2,
    capacityLabel: "2 Pax",
    rate: 1500,
    ratePeriod: "night",
    formattedRate: "₱1,500 / night",
    sampleQuantity: 6,
    vibe: "Cozy modern minimalist with dark wood accents and Baguio city views.",
    description: "Ideal for couples or solo travelers looking for refined comfort. Features one queen size bed with solid white box base, dedicated vanity desk, closed wardrobe, and red roller blinds.",
    image: "/premium-large-room.jpg",
    features: [
      "One (1) queen size bed with solid white box base & crisp white sheets",
      "Thick warm red blanket",
      "Wooden vanity desk with chair and mirror",
      "Closed wooden wardrobe cabinet",
      "Warm bedside lamp",
      "Matte black electric stand fan",
      "Glass sliding window with red pull-cord roller blinds",
      "Scenic view of Baguio"
    ],
    sharedAmenities: [
      "Lounge Area with black leather armchairs & warm lighting",
      "Dining Area with rectangular table & red mantel",
      "Kitchenette with white mini-fridge, electric kettle, plates & cups",
      "Wall-mounted flat-screen TV in unit common area",
      "Clean comfort room with steady water supply & water heater",
      "Solid white paneled doors & 24/7 CCTV surveillance"
    ],
    popular: true
  },
  {
    id: "room-c-solo",
    name: "Compact Solo Room",
    category: "transient",
    capacity: 2,
    capacityLabel: "1 - 2 Pax",
    rate: 800,
    ratePeriod: "night",
    formattedRate: "₱800 / night",
    sampleQuantity: 5,
    vibe: "Modern minimalist, compact, budget-friendly and cozy Baguio stay.",
    description: "An affordable, private solo or couple lodging space with solid white box base, compact wooden desk, narrow closed wardrobe, and mountain view window with red blinds.",
    image: "/compact-solo-room.jpg",
    features: [
      "One (1) small bed with solid white box base & crisp white sheets",
      "Thick warm red blanket",
      "Compact wooden vanity desk and chair",
      "Narrow closed wooden wardrobe cabinet",
      "Matte black electric stand fan",
      "Glass sliding window with red pull-cord roller blinds",
      "Scenic view of Baguio"
    ],
    sharedAmenities: [
      "Lounge Area with black leather armchairs & warm lighting",
      "Dining Area with rectangular table & red mantel",
      "Kitchenette with white mini-fridge, electric kettle, plates & cups",
      "Wall-mounted flat-screen TV in unit common area",
      "Clean comfort room with steady water supply & water heater",
      "Solid white paneled doors & 24/7 CCTV surveillance"
    ],
    popular: false
  },
  {
    id: "dor-shared",
    name: "Dormitory Room (Shared Bedspace)",
    category: "dormitory",
    capacity: 4,
    capacityLabel: "4 Pax per room",
    rate: 3000,
    ratePeriod: "month/person",
    formattedRate: "₱3,000 / month / person",
    sampleQuantity: 8,
    vibe: "Clean, peaceful, and conducive for students and board examinees.",
    description: "Peaceful and conducive monthly dormitory bedspaces designed for SLU, UB, and UP Baguio students and board examinees. Features sturdy wooden double-deck bunk beds and study desks.",
    image: "/dormitory-room.jpg",
    features: [
      "Sturdy wooden double-deck (bunk) beds with white sheets & red blankets",
      "Two (2) minimalist wooden study desks with chair",
      "Closed wooden cabinets for dormers' belongings",
      "Matte black electric stand fan",
      "High-speed Free Wi-Fi for academic research",
      "Quiet, peaceful study environment"
    ],
    sharedAmenities: [
      "Shared Lounge Area with black leather armchairs",
      "Dining Area with rectangular dining table",
      "Pantry with white mini-refrigerator, kettle, plates & cups",
      "Comfort room with steady water supply & water heater",
      "Solid white paneled doors & 24/7 CCTV security"
    ],
    popular: false
  }
];

export interface SharedUnitAmenity {
  id: string;
  title: string;
  description: string;
  details?: string[];
  icon: string;
  category: 'Lounge' | 'Dining & Kitchen' | 'Comfort' | 'Security';
}

/**
 * SHARED AMENITIES (Common Area per Unit)
 */
export const SHARED_UNIT_AMENITIES: SharedUnitAmenity[] = [
  {
    id: "sh-lounge",
    title: "Lounge Area",
    description: "Black leather armchairs and warm ambient lighting designed for restful conversations.",
    icon: "Armchair",
    category: "Lounge"
  },
  {
    id: "sh-dining",
    title: "Dining Area",
    description: "Rectangular dining table with red mantel cover and comfortable metal chairs.",
    icon: "Utensils",
    category: "Dining & Kitchen"
  },
  {
    id: "sh-pantry",
    title: "Pantry / Kitchenette",
    description: "Equipped with white mini-refrigerator, electric kettle, and basic plates & cups.",
    details: ["White mini-refrigerator", "Electric kettle", "Basic dining plates & cups"],
    icon: "Coffee",
    category: "Dining & Kitchen"
  },
  {
    id: "sh-entertainment",
    title: "Entertainment TV",
    description: "Wall-mounted flat-screen TV located in the common unit lounge for leisure viewing.",
    icon: "Tv",
    category: "Lounge"
  },
  {
    id: "sh-bathroom",
    title: "Bathroom / Comfort Room",
    description: "Clean and well-maintained comfort room featuring steady water supply and water heater.",
    icon: "Droplets",
    category: "Comfort"
  },
  {
    id: "sh-security",
    title: "Security & Private Entry",
    description: "Solid white paneled doors for every room with 24/7 CCTV surveillance in common areas.",
    icon: "ShieldCheck",
    category: "Security"
  }
];

/**
 * SAMPLE AMENITIES (DEMO DATA ONLY - Core Property Inclusions)
 */
export const SAMPLE_AMENITIES: Amenity[] = [
  {
    id: "am-wifi",
    name: "High-Speed Free Wi-Fi",
    description: "Reliable internet throughout the unit for leisure, remote work, or academic study.",
    icon: "Wifi",
    category: "Convenience"
  },
  {
    id: "am-tv",
    name: "Wall-Mounted Flat-Screen TV",
    description: "High-definition entertainment in the common unit lounge for leisure viewing, news, and streaming.",
    icon: "Tv",
    category: "Comfort"
  },
  {
    id: "am-frontdesk",
    name: "24-Hour Front Desk / Caretaker",
    description: "On-site caretaker assistance available around the clock to assist guests and tenants.",
    icon: "Clock",
    category: "Safety & Facilities"
  },
  {
    id: "am-parking",
    name: "On-Site Parking Area",
    description: "Designated parking spaces for staying guests traveling with private vehicles.",
    icon: "Car",
    category: "Convenience"
  },
  {
    id: "am-shower",
    name: "Hot & Cold Shower",
    description: "Steady water supply and instant water heater installed in every comfort room.",
    icon: "Droplets",
    category: "Comfort"
  },
  {
    id: "am-fan",
    name: "Matte Black Stand Fans",
    description: "Electric stand fans in every room for crisp, adjustable mountain ventilation.",
    icon: "Wind",
    category: "Comfort"
  },
  {
    id: "am-security",
    name: "24/7 CCTV & Solid Doors",
    description: "Solid white paneled doors for every room and continuous 24/7 CCTV security monitoring.",
    icon: "ShieldCheck",
    category: "Safety & Facilities"
  }
];

/**
 * SAMPLE FAQ & POLICIES (DEMO DATA ONLY)
 */
export const SAMPLE_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How much are the transient and dormitory rates?",
    answer: "Our short-term transient room rates are: ₱800/night for Compact Solo Room (1-2 Pax), ₱1,500/night for Premium Large Room (2 Pax), and ₱2,000/night for Premium Twin Room (4 Pax). For long-term students and board examinees, our peaceful Dormitory Room (Shared Bedspace) is ₱3,000/month per head/bedspace (4 Pax per room)."
  },
  {
    id: "faq-2",
    question: "What time is check-in and check-out?",
    answer: "Standard check-in time is 2:00 PM and check-out time is 12:00 PM (noon). Early check-in or late check-out can be requested in advance through our 24-hour caretaker assistance, subject to room availability."
  },
  {
    id: "faq-3",
    question: "What shared amenities are included in each unit?",
    answer: "Each unit features a cozy common area with a Lounge Area (black leather armchairs and warm lighting), a Dining Area with a rectangular table and red mantel, a Pantry/Kitchenette with a white mini-refrigerator, electric kettle, and basic plates & cups, a wall-mounted flat-screen TV, a clean comfort room with water heater, and 24/7 CCTV monitoring."
  },
  {
    id: "faq-4",
    question: "What is the bed setup and capacity for each room?",
    answer: "Premium Twin Room features two (2) single beds with solid white box base, crisp white sheets, and thick red blankets for up to 4 guests. Premium Large Room has one (1) queen bed for 2 guests. Compact Solo Room has one (1) small bed for 1-2 guests. The Dormitory room features sturdy wooden double-deck bunk beds with dedicated study desks and closed cabinets for 4 dormers per room."
  },
  {
    id: "faq-5",
    question: "What payment methods do you accept?",
    answer: "We accept GCash, bank transfer, and direct cash payment at the property. For reservations, payment instructions are communicated once your booking request is reviewed and approved."
  }
];

/**
 * SAMPLE PROPERTY POLICIES (DEMO DATA ONLY)
 */
export const PROPERTY_POLICIES = {
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",
  paymentMethods: ["GCash", "Bank Transfer", "Cash payment at the property"],
  cancellation: {
    freeCancellation: "Up to 24 hours before check-in: no cancellation fee.",
    lateCancellation: "Less than 24 hours before check-in: may be subject to a cancellation fee."
  },
  bookingProcess: "Guests select a room, choose check-in/check-out dates, enter their name and contact information, and submit a reservation request. The booking is confirmed after approval."
};

/**
 * DEMO CONTACT INFORMATION (DEMO DATA ONLY)
 * In accordance with PROJECT_RULES.md, these are placeholder demo details.
 */
export const DEMO_CONTACT: ContactInfo = {
  phone: "0907 861 4267",
  email: "sannycariaso24@gmail.com",
  facebook: "facebook.com/profile.php?id=100063892871886",
  facebookUrl: "https://www.facebook.com/profile.php?id=100063892871886",
  hours: "8:00 AM – 10:00 PM",
  address: "95-B Vergara 2 Alley, Engineers' Hill",
  city: "Baguio City",
  province: "Benguet, Philippines, 2600"
};

/**
 * NEARBY BAGUIO LANDMARKS (FROM ENGINEERS' HILL)
 */
export const BAGUIO_LANDMARKS = [
  { 
    id: "sm-baguio",
    name: "SM City Baguio & Session Road", 
    category: "Shopping & Dining",
    distance: "5-8 mins walk", 
    travelTime: "5-8 mins",
    travelMode: "walk" as const,
    desc: "Premier shopping, dining terraces, and the vibrant Session Road promenade.",
    image: "/sm-city-baguio.jpg",
    coordinates: [120.5995, 16.4095] as [number, number]
  },
  { 
    id: "victory-liner",
    name: "Victory Liner Passenger Terminal", 
    category: "Major Transit Hub",
    distance: "3-5 mins walk", 
    travelTime: "3-5 mins",
    travelMode: "walk" as const,
    desc: "Key transit terminal for effortless arrival and departure from Metro Manila.",
    image: "/victory-liner-passengers-line.jpg",
    coordinates: [120.6030, 16.4055] as [number, number]
  },
  { 
    id: "burnham-park",
    name: "Burnham Park", 
    category: "Park & Recreation",
    distance: "8-10 mins drive", 
    travelTime: "8-10 mins",
    travelMode: "drive" as const,
    desc: "Historic swan boat lake, rose gardens, bicycle tracks, and picnic grounds.",
    image: "/burnham-park.avif",
    coordinates: [120.5931, 16.4116] as [number, number]
  },
  { 
    id: "camp-john-hay",
    name: "Camp John Hay", 
    category: "Scenic Pine Forest",
    distance: "10-12 mins drive", 
    travelTime: "10-12 mins",
    travelMode: "drive" as const,
    desc: "Towering pine forest trails, Bell Amphitheater, and artisan mountain cafes.",
    image: "/camp-john-hay.jpg",
    coordinates: [120.6152, 16.3980] as [number, number]
  },
  { 
    id: "mines-view",
    name: "Mines View Park", 
    category: "Mountain Overlook",
    distance: "15 mins drive", 
    travelTime: "15 mins",
    travelMode: "drive" as const,
    desc: "Panoramic mountain outlook, Cordillera cultural attire, and artisan souvenirs.",
    image: "/mines-view-park.jpg",
    coordinates: [120.6272, 16.4178] as [number, number]
  }
];
