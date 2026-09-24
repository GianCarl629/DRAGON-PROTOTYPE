import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  BedDouble, 
  ArrowRight, 
  ShieldCheck, 
  Wifi, 
  Flame, 
  Sparkles, 
  MapPin, 
  Star,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { PROPERTY_INFO, SAMPLE_ROOMS } from '../../data/mockData';

interface HeroProps {
  onOpenBooking: (roomType?: string, checkIn?: string, checkOut?: string, guests?: number) => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<'transient' | 'dormitory'>('transient');
  const [selectedRoom, setSelectedRoom] = useState(SAMPLE_ROOMS[0].name);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const filteredRoomOptions = SAMPLE_ROOMS.filter(r => 
    activeTab === 'transient' ? r.category === 'transient' : r.category === 'dormitory'
  );

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(selectedRoom, checkIn, checkOut, guests);
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-luxury">
      {/* Background Atmospheric Glows */}
      <div className="absolute top-0 right-0 -z-10 w-[550px] h-[550px] bg-gradient-to-br from-pine-200/50 via-gold-200/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute top-1/3 left-0 -z-10 w-[500px] h-[500px] bg-gradient-to-tr from-cedar-200/40 via-pine-100/30 to-transparent rounded-full blur-3xl transform -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Text & Call to Action (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Top Eyebrow Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-gold-400/50 text-pine-950 text-xs sm:text-sm font-semibold tracking-wide shadow-sm backdrop-blur-md">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-gold-600/80 flex-shrink-0 bg-pine-950 shadow-xs">
                  <img
                    src="/dragon-treasure-logo.jpg"
                    alt="Dragon Treasure Crest"
                    className="w-full h-full object-cover scale-[1.10]"
                  />
                </div>
                <span className="text-pine-950 font-bold">Dragon Treasure</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                <span className="text-slate-600 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-pine-700 inline" strokeWidth={2} />
                  {PROPERTY_INFO.location}
                </span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pine-100/80 text-pine-900 text-xs font-semibold border border-pine-200/80">
                <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" strokeWidth={1.5} />
                <span>Highland Hospitality</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-pine-950 tracking-tight leading-[1.12]">
                Your Peaceful Haven in the <span className="text-gold-gradient">City of Pines</span>
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-pine-800/80 font-medium">
                Dragon Treasure Transient & Condotel
              </p>
            </div>

            {/* Narrative Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {PROPERTY_INFO.description} Enjoy crisp mountain breezes, clean contemporary suites, pressurized hot showers, and dedicated 24/7 caretaker assistance.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <a
                href="#rooms"
                className="shimmer-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-md hover:shadow-glow-pine transition-all duration-300 border border-pine-700/50"
              >
                <span>View Accommodations</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>

              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-pine-950 bg-white/95 border border-stone-200/90 hover:bg-stone-50 hover:border-gold-400 active:scale-98 shadow-card transition-all duration-300"
              >
                <Calendar className="w-4 h-4 text-pine-800" strokeWidth={2} />
                <span>Reserve a Room</span>
              </button>

              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-pine-900 bg-gold-100/80 border border-gold-300/80 hover:bg-gold-200/80 active:scale-98 transition-all duration-200 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-gold-700" strokeWidth={2} />
                <span>Virtual Concierge</span>
              </button>
            </div>

            {/* Trust & Amenity Highlights Strip */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0 border-t border-stone-200/80">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="w-7 h-7 rounded-lg bg-pine-100/80 text-pine-800 flex items-center justify-center flex-shrink-0 border border-pine-200/60">
                  <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                </div>
                <span>24/7 Caretaker</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="w-7 h-7 rounded-lg bg-pine-100/80 text-pine-800 flex items-center justify-center flex-shrink-0 border border-pine-200/60">
                  <Wifi className="w-4 h-4" strokeWidth={2} />
                </div>
                <span>Fast Free Wi-Fi</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="w-7 h-7 rounded-lg bg-pine-100/80 text-pine-800 flex items-center justify-center flex-shrink-0 border border-pine-200/60">
                  <Flame className="w-4 h-4" strokeWidth={2} />
                </div>
                <span>Hot Showers</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image & Quick Reservation Search Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Photography Card */}
            <div className="group relative rounded-3xl overflow-hidden shadow-luxury border-4 border-white/90 bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
                alt="Dragon Treasure Transient & Condotel Baguio"
                className="w-full h-64 sm:h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-black/20 to-transparent" />

              {/* Regal Crest Badge Overlay */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-gold-400 shadow-glow-gold bg-pine-950/95 backdrop-blur-md z-10 transition-transform group-hover:scale-110 duration-300">
                <img
                  src="/dragon-treasure-logo.jpg"
                  alt="Dragon Treasure Crest"
                  className="w-full h-full object-cover scale-[1.10]"
                />
              </div>

              {/* Bottom Image Overlay Badges */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-300 uppercase tracking-wider mb-0.5">
                      <Clock className="w-3 h-3" strokeWidth={2} />
                      Open Year-Round
                    </span>
                    <p className="font-serif font-bold text-lg leading-tight">Short-Term Lodging & Dorms</p>
                  </div>
                  <div className="bg-pine-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-gold-300 border border-gold-500/40 shadow-xs">
                    From ₱1,500/night
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Availability Reservation Bar */}
            <form
              onSubmit={handleQuickSearch}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-luxury border border-stone-200/80 space-y-4"
            >
              {/* Card Header & Category Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-pine-50 text-pine-800 flex items-center justify-center border border-pine-100">
                    <BedDouble className="w-4 h-4 text-pine-700" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold text-pine-950 uppercase tracking-wider">
                    Quick Inquiry
                  </span>
                </div>

                <div className="flex p-0.5 bg-stone-100 rounded-lg border border-stone-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('transient');
                      setSelectedRoom(SAMPLE_ROOMS[0].name);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      activeTab === 'transient'
                        ? 'bg-pine-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Transient
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('dormitory');
                      const dorm = SAMPLE_ROOMS.find(r => r.category === 'dormitory');
                      if (dorm) setSelectedRoom(dorm.name);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      activeTab === 'dormitory'
                        ? 'bg-pine-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly Dorm
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Room Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                    <span>Room Option</span>
                  </label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-700 transition-all"
                  >
                    {filteredRoomOptions.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} ({r.formattedRate})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guests */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                    <span>Guests</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-700 transition-all"
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
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                    <span>Check-in Date</span>
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-700 transition-all"
                  />
                </div>

                {/* Check-Out */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
                    <span>Check-out Date</span>
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pine-700 transition-all"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="shimmer-btn w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-md hover:shadow-glow-pine transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Check Availability & Inquire</span>
                <ArrowRight className="w-4 h-4 text-gold-300" strokeWidth={2} />
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};
