import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthModalMode, PendingBookingIntent, UserReservation } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => Promise<AuthUser>;
  logout: () => void;
  updateUser: (updated: AuthUser) => void;
  reservations: UserReservation[];
  addReservation: (reservation: UserReservation) => void;
  cancelReservation: (id: string, reason?: string) => void;
  deleteReservation: (id: string) => void;

  // Auth Modal State & Controls
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;

  // Booking Intent Preservation
  pendingBookingIntent: PendingBookingIntent | null;
  setPendingBookingIntent: (intent: PendingBookingIntent | null) => void;
  clearPendingBookingIntent: () => void;

  // User Dashboard Modals
  isReservationsModalOpen: boolean;
  reservationsModalTab: 'bookings' | 'billing' | 'payment' | 'inquiries';
  openReservationsModal: (tab?: 'bookings' | 'billing' | 'payment' | 'inquiries') => void;
  closeReservationsModal: () => void;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user from active session if present
  const [user, setUser] = useState<AuthUser | null>(() => AuthService.getStoredUser());
  const [reservations, setReservations] = useState<UserReservation[]>(() => AuthService.getStoredReservations());

  // Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('prompt');
  const [pendingBookingIntent, setPendingBookingIntent] = useState<PendingBookingIntent | null>(null);

  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [reservationsModalTab, setReservationsModalTab] = useState<'bookings' | 'billing' | 'payment' | 'inquiries'>('bookings');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync auth state if URL has #login or #register on load
  useEffect(() => {
    const handleUrlHash = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#login' || path === '/login') {
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      } else if (hash === '#register' || path === '/register') {
        setAuthModalMode('register');
        setIsAuthModalOpen(true);
      }
    };

    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
    return () => window.removeEventListener('hashchange', handleUrlHash);
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const loggedInUser = await AuthService.login(email, password);
    setUser(loggedInUser);
    setReservations(AuthService.getStoredReservations());
    return loggedInUser;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthUser> => {
    const newUser = await AuthService.register(data);
    setUser(newUser);
    setReservations([]);
    return newUser;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setReservations([]);
    setPendingBookingIntent(null);
    setIsReservationsModalOpen(false);
    setIsProfileModalOpen(false);
  };

  const updateUser = (updated: AuthUser) => {
    AuthService.setStoredUser(updated);
    setUser(updated);
  };

  const addReservation = (reservation: UserReservation) => {
    AuthService.addReservation(reservation);
    setReservations((prev) => [reservation, ...prev]);
  };

  const cancelReservation = (id: string, reason?: string) => {
    AuthService.cancelReservation(id, reason);
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Cancelled',
              cancellationReason: reason || 'Customer request',
              cancelledAt: today
            }
          : r
      )
    );
  };

  const deleteReservation = (id: string) => {
    AuthService.deleteReservation(id);
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const openAuthModal = (mode: AuthModalMode = 'prompt') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    // If URL had #login or #register, clean it up gracefully
    if (window.location.hash === '#login' || window.location.hash === '#register') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const clearPendingBookingIntent = () => {
    setPendingBookingIntent(null);
  };

  const openReservationsModal = (tab?: 'bookings' | 'billing' | 'payment' | 'inquiries') => {
    if (tab) {
      setReservationsModalTab(tab);
    }
    setIsReservationsModalOpen(true);
  };
  const closeReservationsModal = () => setIsReservationsModalOpen(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateUser,
        reservations,
        addReservation,
        cancelReservation,
        deleteReservation,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        pendingBookingIntent,
        setPendingBookingIntent,
        clearPendingBookingIntent,
        isReservationsModalOpen,
        reservationsModalTab,
        openReservationsModal,
        closeReservationsModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
