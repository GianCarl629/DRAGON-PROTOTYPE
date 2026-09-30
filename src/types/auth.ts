// Authentication TypeScript Definitions for Dragon Treasure Prototype

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedDate?: string;
  tier?: 'Guest Member' | 'Silver Explorer' | 'Gold VIP';
}

export type AuthModalMode = 'prompt' | 'login' | 'register' | 'forgot';

export interface PendingBookingIntent {
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface UserReservation {
  id: string;
  reservationCode: string;
  roomName: string;
  roomCategory: 'transient' | 'dormitory';
  roomImage: string;
  rate: number;
  ratePeriod: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  fullName: string;
  email: string;
  contactNumber: string;
  specialRequests?: string;
  status: 'Confirmed' | 'Pending Review' | 'Completed' | 'Cancelled';
  cancellationReason?: string;
  cancelledAt?: string;
  bookedAt: string;
}
