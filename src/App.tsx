import React, { useState } from 'react';
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
import { BookingFormData } from './types';

export function App() {
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

  const handleOpenBooking = (
    roomType?: string,
    checkIn?: string,
    checkOut?: string,
    guests?: number
  ) => {
    setBookingRoomType(roomType);
    setBookingCheckIn(checkIn);
    setBookingCheckOut(checkOut);
    setBookingGuests(guests);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (data: BookingFormData) => {
    setIsBookingOpen(false);
    setSubmittedBooking(data);
    setIsSuccessOpen(true);
  };

  const handleOpenChat = () => {
    setChatTrigger(true);
    // Reset trigger after tick so it can trigger again
    setTimeout(() => setChatTrigger(false), 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-slate-800 font-sans selection:bg-pine-200 selection:text-pine-900 relative">
      {/* Top Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Page Content */}
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

      {/* Booking Confirmation / Prototype Disclaimer Modal */}
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

export default App;
