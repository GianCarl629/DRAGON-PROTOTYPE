// TypeScript Definitions for Dragon Treasure Frontend Prototype

export type RoomCategory = 'all' | 'transient' | 'dormitory';

export interface Room {
  id: string;
  name: string;
  category: 'transient' | 'dormitory';
  capacity: number;
  capacityLabel: string;
  rate: number;
  ratePeriod: 'night' | 'month/person';
  formattedRate: string;
  sampleQuantity: number; // Demo quantity for prototype
  description: string;
  image: string;
  features: string[];
  popular?: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Comfort' | 'Convenience' | 'Safety & Facilities';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  facebook: string;
  facebookUrl: string;
  hours: string;
  address: string;
  city: string;
  province: string;
}

export interface BookingFormData {
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  fullName: string;
  contactNumber: string;
  email: string;
  specialRequests?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
