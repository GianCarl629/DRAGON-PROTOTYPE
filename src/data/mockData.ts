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
export const SAMPLE_ROOMS: Room[] = [
  {
    id: "std-01",
    name: "Standard Room",
    category: "transient",
    capacity: 2,
    capacityLabel: "2 guests",
    rate: 1500,
    ratePeriod: "night",
    formattedRate: "₱1,500 / night",
    sampleQuantity: 60,
    description: "A cozy and practical room ideal for solo travelers or couples looking for a refreshing Baguio stay.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    features: [
      "1 Queen or 2 Single Beds",
      "Hot & Cold Shower",
      "High-speed Free Wi-Fi",
      "Cable Television",
      "Clean Towels & Linen"
    ],
    popular: false
  },
  {
    id: "dlx-02",
    name: "Deluxe Room",
    category: "transient",
    capacity: 3,
    capacityLabel: "3 guests",
    rate: 2000,
    ratePeriod: "night",
    formattedRate: "₱2,000 / night",
    sampleQuantity: 40,
    description: "More spacious accommodations featuring enhanced comfort, ideal for small groups of friends or small families.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    features: [
      "1 Double Bed + 1 Single Bed",
      "Hot & Cold Shower",
      "High-speed Free Wi-Fi",
      "Smart TV & Seating Area",
      "Air Conditioning",
      "Complimentary Toiletries"
    ],
    popular: true
  },
  {
    id: "fam-03",
    name: "Family Room",
    category: "transient",
    capacity: 4,
    capacityLabel: "4 guests",
    rate: 2800,
    ratePeriod: "night",
    formattedRate: "₱2,800 / night",
    sampleQuantity: 30,
    description: "Designed for family vacationers with ample room to unwind together after exploring Baguio's sights.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    features: [
      "2 Double Beds",
      "Private Bathroom with Hot Shower",
      "High-speed Free Wi-Fi",
      "Television & Work Table",
      "Wardrobe & Luggage Rack",
      "Access to Common Kitchen"
    ],
    popular: true
  },
  {
    id: "ste-04",
    name: "Family Suite",
    category: "transient",
    capacity: 6,
    capacityLabel: "6 guests",
    rate: 3500,
    ratePeriod: "night",
    formattedRate: "₱3,500 / night",
    sampleQuantity: 15,
    description: "Our premier short-term lodging space offering generous space, multiple bed arrangements, and dining comfort.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    features: [
      "Multiple Bed Configurations (Up to 6 guests)",
      "Spacious Living / Lounge Corner",
      "Hot & Cold Shower",
      "High-speed Wi-Fi & Large TV",
      "Dining Nook & Refrigerator Access",
      "Dedicated Clothes Storage"
    ],
    popular: false
  },
  {
    id: "dor-05",
    name: "Dormitory Room",
    category: "dormitory",
    capacity: 6,
    capacityLabel: "4–6 guests",
    rate: 8000,
    ratePeriod: "month/person",
    formattedRate: "₱8,000 / month / person",
    sampleQuantity: 5,
    description: "Cost-effective, secure monthly rental option tailored for Baguio students, board examinees, and working professionals.",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    features: [
      "Bunk Beds with Sturdy Lockers",
      "Study Desk & Reading Lamps",
      "Shared Hot & Cold Shower",
      "High-speed Free Wi-Fi",
      "Full Common Kitchen Access",
      "Laundry Area Access",
      "24/7 Security & CCTV Monitoring"
    ],
    popular: false
  }
];

/**
 * SAMPLE AMENITIES (DEMO DATA ONLY - 11 Specified Amenities)
 * Replace with API endpoint: GET /api/amenities
 */
export const SAMPLE_AMENITIES: Amenity[] = [
  {
    id: "am-wifi",
    name: "Free Wi-Fi",
    description: "High-speed internet throughout the property for leisure, remote work, or academic study.",
    icon: "Wifi",
    category: "Convenience"
  },
  {
    id: "am-frontdesk",
    name: "24-Hour Front Desk / Caretaker",
    description: "Friendly on-site caretaker assistance available around the clock to support your stay.",
    icon: "Clock",
    category: "Safety & Facilities"
  },
  {
    id: "am-parking",
    name: "Parking Area",
    description: "Designated on-site parking spaces for staying guests' vehicles.",
    icon: "Car",
    category: "Convenience"
  },
  {
    id: "am-shower",
    name: "Hot and Cold Shower",
    description: "Essential hot water heaters installed in every bathroom for Baguio's cool mornings.",
    icon: "Droplets",
    category: "Comfort"
  },
  {
    id: "am-tv",
    name: "Television",
    description: "Flat-screen TVs provided for entertainment after a full day of Baguio adventures.",
    icon: "Tv",
    category: "Comfort"
  },
  {
    id: "am-ac",
    name: "Air Conditioning",
    description: "Climate-controlled rooms available for customized personal comfort.",
    icon: "Wind",
    category: "Comfort"
  },
  {
    id: "am-kitchen",
    name: "Common Kitchen",
    description: "Shared cooking facilities equipped for guests and monthly dormitory tenants.",
    icon: "UtensilsCrossed",
    category: "Convenience"
  },
  {
    id: "am-laundry",
    name: "Laundry Area",
    description: "Dedicated laundry and drying zone convenient for extended and dormitory stays.",
    icon: "Shirt",
    category: "Convenience"
  },
  {
    id: "am-security",
    name: "CCTV / Security",
    description: "24/7 surveillance cameras in common areas ensuring peace of mind.",
    icon: "ShieldCheck",
    category: "Safety & Facilities"
  },
  {
    id: "am-elevator",
    name: "Elevator",
    description: "Easy elevator access across multiple floors for luggage and guests.",
    icon: "ArrowUpDown",
    category: "Safety & Facilities"
  },
  {
    id: "am-water",
    name: "Drinking-Water Station",
    description: "Complimentary purified hot and cold drinking water dispensers on floor stations.",
    icon: "GlassWater",
    category: "Convenience"
  }
];

/**
 * SAMPLE FAQ & POLICIES (DEMO DATA ONLY)
 * Replace with API endpoint: GET /api/faq
 */
export const SAMPLE_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How much is a room?",
    answer: "Our room rates start at ₱1,500/night for a Standard Room (2 guests), ₱2,000/night for a Deluxe Room (3 guests), ₱2,800/night for a Family Room (4 guests), and ₱3,500/night for a Family Suite (6 guests). Monthly dormitory rentals start at ₱8,000/month/person."
  },
  {
    id: "faq-2",
    question: "What time is check-in and check-out?",
    answer: "Standard check-in time is 2:00 PM and check-out time is 12:00 PM (noon). If you require early check-in or late check-out, please coordinate with our 24-hour caretaker assistance in advance, subject to room availability."
  },
  {
    id: "faq-3",
    question: "Do you have parking?",
    answer: "Yes, Dragon Treasure provides an on-site parking area for guests traveling with private vehicles. Parking slots are allotted on a first-come, first-served basis, so please let us know during your booking request."
  },
  {
    id: "faq-4",
    question: "How many people can stay in a family room?",
    answer: "Our Family Room accommodates up to 4 guests comfortably with 2 double beds. If you have a larger group of up to 6 guests, we recommend our Family Suite or reserving multiple adjacent rooms."
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
  { name: "SM City Baguio & Session Road", distance: "5-8 mins walk", desc: "Premier shopping, dining hub, and vibrant Session Road" },
  { name: "Victory Liner Bus Terminal", distance: "3-5 mins walk", desc: "Key transit terminal for effortless arrival and departure" },
  { name: "Burnham Park", distance: "8-10 mins drive", desc: "Historic swan boat lake, cycling lanes, and garden walks" },
  { name: "Camp John Hay", distance: "10-12 mins drive", desc: "Towering pine forest trails, Bell Amphitheater, and cafes" },
  { name: "Mines View Park & The Mansion", distance: "15 mins drive", desc: "Panoramic mountain outlook, Cordillera crafts, and souvenirs" }
];
