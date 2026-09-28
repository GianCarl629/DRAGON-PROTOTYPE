import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthModalMode, PendingBookingIntent, UserReservation } from '../types/auth';
import { MockAuthService } from '../services/mockAuth';

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
  reservations: UserReservation[];
  addReservation: (reservation: UserReservation) => void;

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
  openReservationsModal: () => void;
  closeReservationsModal: () => void;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => MockAuthService.getStoredUser());
  const [reservations, setReservations] = useState<UserReservation[]>(() => MockAuthService.getStoredReservations());

  // Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('prompt');
  const [pendingBookingIntent, setPendingBookingIntent] = useState<PendingBookingIntent | null>(null);

  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
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
    const loggedInUser = await MockAuthService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthUser> => {
    const newUser = await MockAuthService.register(data);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    MockAuthService.logout();
    setUser(null);
    setPendingBookingIntent(null);
    setIsReservationsModalOpen(false);
    setIsProfileModalOpen(false);
  };

  const addReservation = (reservation: UserReservation) => {
    MockAuthService.addReservation(reservation);
    setReservations(MockAuthService.getStoredReservations());
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

  const openReservationsModal = () => setIsReservationsModalOpen(true);
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
        reservations,
        addReservation,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        pendingBookingIntent,
        setPendingBookingIntent,
        clearPendingBookingIntent,
        isReservationsModalOpen,
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
