// Mock Authentication Service for Dragon Treasure Prototype
import { AuthUser, UserReservation } from '../types/auth';
import { SAMPLE_ROOMS } from '../data/mockData';

const AUTH_USER_KEY = 'dragon_treasure_mock_user';
const RESERVATIONS_KEY = 'dragon_treasure_mock_reservations';

// Sample demo reservations if user has none yet
const DEFAULT_DEMO_RESERVATIONS: UserReservation[] = [
  {
    id: 'res-demo-1',
    reservationCode: 'DT-2026-8492',
    roomName: 'Deluxe Queen Studio',
    roomCategory: 'transient',
    roomImage: SAMPLE_ROOMS[0].image,
    rate: SAMPLE_ROOMS[0].rate,
    ratePeriod: SAMPLE_ROOMS[0].ratePeriod,
    checkInDate: '2026-10-15',
    checkOutDate: '2026-10-18',
    numberOfGuests: 2,
    fullName: 'Guest User',
    email: 'guest@example.com',
    contactNumber: '0917-555-0199',
    specialRequests: 'Quiet room on upper floor with sunrise view.',
    status: 'Confirmed',
    bookedAt: '2026-09-20'
  }
];

export const MockAuthService = {
  // Retrieve currently stored demo user
  getStoredUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Save or clear demo user
  setStoredUser(user: AuthUser | null): void {
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (e) {
      console.warn('Unable to persist auth state to localStorage', e);
    }
  },

  // Retrieve user's reservation history
  getStoredReservations(): UserReservation[] {
    try {
      const data = localStorage.getItem(RESERVATIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with realistic sample reservation
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(DEFAULT_DEMO_RESERVATIONS));
      return DEFAULT_DEMO_RESERVATIONS;
    } catch {
      return DEFAULT_DEMO_RESERVATIONS;
    }
  },

  // Append a newly completed reservation
  addReservation(reservation: UserReservation): void {
    try {
      const current = this.getStoredReservations();
      const updated = [reservation, ...current];
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Unable to persist reservation to localStorage', e);
    }
  },

  // Demo Login: Validates non-empty fields and instantly authenticates
  async login(email: string, password: string): Promise<AuthUser> {
    // Artificial brief network delay (200ms) for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!email.trim() || !password.trim()) {
      throw new Error('Please fill in both email and password.');
    }

    // Derive a clean display name from email if not provided
    const localPart = email.split('@')[0] || 'Guest';
    const capitalizedName = localPart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name: capitalizedName.length > 2 ? capitalizedName : 'Guest Traveler',
      email: email.trim().toLowerCase(),
      phone: '0917-123-4567',
      tier: 'Guest Member',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    this.setStoredUser(user);
    return user;
  },

  // Demo Registration: Validates fields, checks password match, and creates account
  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (!data.name.trim()) throw new Error('Please enter your full name.');
    if (!data.email.trim()) throw new Error('Please enter your email address.');
    if (!data.phone.trim()) throw new Error('Please enter your contact phone number.');
    if (!data.password) throw new Error('Please enter a password.');
    if (data.password.length < 4) throw new Error('Password should be at least 4 characters for this demo.');
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      tier: 'Guest Member',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    this.setStoredUser(user);
    return user;
  },

  // Logout: clears persisted mock state
  logout(): void {
    this.setStoredUser(null);
  }
};
