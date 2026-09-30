// Mock Authentication Service for Dragon Treasure Prototype (Demo Only)
import { AuthUser, UserReservation } from '../types/auth';

const AUTH_USER_KEY = 'dragon_treasure_mock_user';
const RESERVATIONS_KEY = 'dragon_treasure_mock_reservations';

export const MockAuthService = {
  // In-memory active session records (temporary for current demo session)
  currentUser: null as AuthUser | null,
  currentReservations: [] as UserReservation[],

  // Completely purge any legacy stored items from browser storage
  clearLegacyStorage(): void {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(RESERVATIONS_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(RESERVATIONS_KEY);
    } catch {
      // ignore in environments without storage access
    }
  },

  // Retrieve stored user: Always returns null on page load/refresh
  // so temporary demo accounts are deleted whenever the page is refreshed
  getStoredUser(): AuthUser | null {
    return this.currentUser;
  },

  // Save or clear in-memory user
  setStoredUser(user: AuthUser | null): void {
    this.currentUser = user;
    this.clearLegacyStorage();
  },

  // Retrieve user's reservation history for the active session (starts empty)
  getStoredReservations(): UserReservation[] {
    return this.currentReservations;
  },

  // Append a newly completed reservation to the active session
  addReservation(reservation: UserReservation): void {
    this.currentReservations = [reservation, ...this.currentReservations];
  },

  // Cancel an active reservation request with a documented reason
  cancelReservation(id: string, reason?: string): void {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    this.currentReservations = this.currentReservations.map((r) =>
      r.id === id
        ? {
            ...r,
            status: 'Cancelled' as const,
            cancellationReason: reason || 'Change in plans',
            cancelledAt: today
          }
        : r
    );
  },

  // Delete/dismiss a reservation from user history
  deleteReservation(id: string): void {
    this.currentReservations = this.currentReservations.filter((r) => r.id !== id);
  },

  // Demo Login: Validates non-empty fields and creates a fresh session
  async login(email: string, password: string): Promise<AuthUser> {
    // Artificial brief network delay (200ms) for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!email.trim() || !password.trim()) {
      throw new Error('Please fill in both email and password.');
    }

    // Reset any previous temporary account's data
    this.currentReservations = [];
    this.clearLegacyStorage();

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

    this.currentUser = user;
    return user;
  },

  // Demo Registration: Validates fields, checks password match, and creates a fresh account
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

    // Clear any previous temporary account's data completely!
    this.currentReservations = [];
    this.clearLegacyStorage();

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      tier: 'Guest Member',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    this.currentUser = user;
    return user;
  },

  // Logout: cleans up temporary account and all session data
  logout(): void {
    this.currentUser = null;
    this.currentReservations = [];
    this.clearLegacyStorage();
  }
};

// Purge any lingering legacy storage immediately on load
MockAuthService.clearLegacyStorage();
