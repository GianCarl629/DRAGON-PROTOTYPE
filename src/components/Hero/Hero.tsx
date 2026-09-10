import React, { useState } from 'react';
import { Calendar, Users, Home, ArrowRight, ShieldCheck, Wifi, Flame, Sparkles, MapPin } from 'lucide-react';
import { PROPERTY_INFO, SAMPLE_ROOMS } from '../../data/mockData';

interface HeroProps {
  onOpenBooking: (roomType?: string, checkIn?: string, checkOut?: string, guests?: number) => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenChat }) => {
  const [selectedRoom, setSelectedRoom] = useState(SAMPLE_ROOMS[0].name);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(selectedRoom, checkIn, checkOut, guests);
  };

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Decorative Mountain & Forest Gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pine-100/60 via-cream-50 to-cream-50" />
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-pine-200/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-0 -z-10 w-80 h-80 bg-cedar-200/30 rounded-full blur-3xl transform -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text & Call to Action (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Mountain Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pine-100 border border-pine-200 text-pine-800 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-pine-600" />
              <span>{PROPERTY_INFO.location}</span>
              <span className="w-1 h-1 rounded-full bg-pine-400" />
              <span className="text-cedar-700">Cool Pines • Affordable Lodging</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-pine-950 tracking-tight leading-[1.15]">
              {PROPERTY_INFO.name}
            </h1>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {PROPERTY_INFO.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#rooms"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow-md hover:shadow-lg transition-all"
              >
                <span>View Accommodations</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-pine-900 bg-white border border-slate-200 hover:bg-pine-50 hover:border-pine-300 active:scale-95 shadow-sm transition-all"
              >
                <Calendar className="w-4 h-4 text-pine-700" />
                <span>Book Request</span>
              </button>

              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-cedar-100/70 border border-cedar-200 hover:bg-cedar-100 hover:text-slate-900 transition-all"
              >
                <Sparkles className="w-4 h-4 text-cedar-700" />
                <span>Ask AI Assistant</span>
              </button>
            </div>

            {/* Highlights Strip */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <ShieldCheck className="w-4 h-4 text-pine-700 flex-shrink-0" />
                <span>24/7 Caretaker</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <Wifi className="w-4 h-4 text-pine-700 flex-shrink-0" />
                <span>Free Fast Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <Flame className="w-4 h-4 text-pine-700 flex-shrink-0" />
                <span>Hot & Cold Showers</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image & Quick Reservation Search Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Featured Visual Image with Baguio Mountain Vibe */}
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
                alt="Dragon Treasure Transient & Condotel Baguio"
                className="w-full h-64 sm:h-72 object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-cedar-200 font-semibold">City of Pines</p>
                    <p className="font-serif font-bold text-lg">Short-Term Lodging & Dorms</p>
                  </div>
                  <div className="bg-pine-800/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-cedar-200 border border-pine-600">
                    From ₱1,500/night
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Availability Reservation Bar */}
            <form
              onSubmit={handleQuickSearch}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-slate-100 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-pine-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-pine-600" />
                  Quick Reservation Inquiry
                </span>
                <span className="text-[10px] text-slate-600 font-medium">Demo Preview</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Room Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    Room Type
                  </label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
                  >
                    {SAMPLE_ROOMS.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} ({r.formattedRate})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guests */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Users className="w-3 h-3 text-pine-600" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={6}>5-6 Guests</option>
                  </select>
                </div>

                {/* Check-In */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-pine-600" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
                  />
                </div>

                {/* Check-Out */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-pine-600" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-[0.98] shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Check Availability & Book</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};
