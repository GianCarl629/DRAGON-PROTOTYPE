import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { RoomSection } from './components/Rooms/RoomSection';
import { AmenitiesSection } from './components/Amenities/AmenitiesSection';
import { WhyChooseUs } from './components/WhyChooseUs/WhyChooseUs';
import { AboutSection } from './components/About/AboutSection';
import { LocationSection } from './components/Location/LocationSection';
import { FAQSection } from './components/FAQ/FAQSection';
import { Footer } from './components/Footer/Footer';
import { BookingModal } from './components/Booking/BookingModal';
import { BookingSuccessModal } from './components/Booking/BookingSuccessModal';
import { ChatbotWidget } from './components/Chatbot/ChatbotWidget';
import { AuthModal } from './components/Auth/AuthModal';
import { MyReservationsModal } from './components/Auth/MyReservationsModal';
import { MyProfileModal } from './components/Auth/MyProfileModal';
import { BookingFormData } from './types';

function AppContent() {
  const {
    isLoggedIn,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    pendingBookingIntent,
    setPendingBookingIntent,
    clearPendingBookingIntent,
    isReservationsModalOpen,
    reservationsModalTab,
    closeReservationsModal,
    isProfileModalOpen,
    closeProfileModal
  } = useAuth();

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRoomType, setBookingRoomType] = useState<string | undefined>(undefined);
  const [bookingCheckIn, setBookingCheckIn] = useState<string | undefined>(undefined);
  const [bookingCheckOut, setBookingCheckOut] = useState<string | undefined>(undefined);
  const [bookingGuests, setBookingGuests] = useState<number | undefined>(undefined);

  // Success modal state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingFormData | null>(null);

  // Chatbot trigger state
  const [chatTrigger, setChatTrigger] = useState(false);

  // Core Booking Guard:
  // If user is guest: preserve booking intent and show professional Auth prompt!
  // If user is logged in: directly open booking modal with preserved details!
  const handleOpenBooking = (
    roomType?: string,
    checkIn?: string,
    checkOut?: string,
    guests?: number
  ) => {
    if (!isLoggedIn) {
      // Store user's booking intent so they don't have to restart after login
      setPendingBookingIntent({
        roomType,
        checkIn,
        checkOut,
        guests
      });
      openAuthModal('prompt');
      return;
    }

    // Already authenticated: proceed directly to booking form
    setBookingRoomType(roomType);
    setBookingCheckIn(checkIn);
    setBookingCheckOut(checkOut);
    setBookingGuests(guests);
    setIsBookingOpen(true);
  };

  // Called immediately after user logs in or registers
  const handleAuthSuccess = () => {
    // If user attempted to book beforehand, automatically resume their reservation
    if (pendingBookingIntent) {
      setBookingRoomType(pendingBookingIntent.roomType);
      setBookingCheckIn(pendingBookingIntent.checkIn);
      setBookingCheckOut(pendingBookingIntent.checkOut);
      setBookingGuests(pendingBookingIntent.guests);
      setIsBookingOpen(true);
      clearPendingBookingIntent();
    }
  };

  const handleBookingSuccess = (data: BookingFormData) => {
    setIsBookingOpen(false);
    setSubmittedBooking(data);
    setIsSuccessOpen(true);
  };

  const handleOpenChat = () => {
    setChatTrigger(true);
    setTimeout(() => setChatTrigger(false), 300);
  };

  const handleScrollToRooms = () => {
    const el = document.getElementById('rooms');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-slate-800 font-sans selection:bg-pine-200 selection:text-pine-900 relative">
      {/* Top Navigation with Auth state and user menu */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Page Content - Publicly accessible without restrictions */}
      <main className="flex-1">
        <Hero
          onOpenBooking={handleOpenBooking}
          onOpenChat={handleOpenChat}
        />
        <RoomSection onOpenBooking={handleOpenBooking} />
        <AmenitiesSection />
        <WhyChooseUs />
        <AboutSection />
        <LocationSection />
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal (Prompt, Login, Register, Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        onSuccessAuth={handleAuthSuccess}
      />

      {/* My Reservations Modal */}
      <MyReservationsModal
        isOpen={isReservationsModalOpen}
        initialTab={reservationsModalTab}
        onClose={closeReservationsModal}
        onBrowseRooms={handleScrollToRooms}
      />

      {/* My Profile Modal */}
      <MyProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedRoomType={bookingRoomType}
        preCheckIn={bookingCheckIn}
        preCheckOut={bookingCheckOut}
        preGuests={bookingGuests}
        onSubmitSuccess={handleBookingSuccess}
      />

      {/* Booking Confirmation Modal */}
      <BookingSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        bookingData={submittedBooking}
      />

      {/* Floating Chatbot Widget (Independent & Abstracted) */}
      <ChatbotWidget externalOpenTrigger={chatTrigger} />
    </div>
  );
}

export function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
