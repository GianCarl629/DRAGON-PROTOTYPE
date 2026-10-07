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
import { RoomDropdown } from '../UI/RoomDropdown';
import { GuestDropdown } from '../UI/GuestDropdown';
import { DatePickerInput } from '../UI/DatePickerInput';

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

  const currentRoomObj = SAMPLE_ROOMS.find(r => r.name === selectedRoom) || filteredRoomOptions[0] || SAMPLE_ROOMS[0];

  const handleSelectRoom = (name: string) => {
    setSelectedRoom(name);
    const targetRoom = SAMPLE_ROOMS.find(r => r.name === name);
    if (targetRoom && guests > targetRoom.capacity) {
      setGuests(targetRoom.capacity);
    }
  };

  const handleCategorySwitch = (tab: 'transient' | 'dormitory') => {
    setActiveTab(tab);
    const roomsInTab = SAMPLE_ROOMS.filter(r => r.category === tab);
    const defaultRoom = roomsInTab[0] || SAMPLE_ROOMS[0];
    setSelectedRoom(defaultRoom.name);
    if (guests > defaultRoom.capacity) {
      setGuests(defaultRoom.capacity);
    }
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(selectedRoom, checkIn, checkOut, guests);
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-luxury">

      {/* Background Atmospheric Glows */}
      <div className="absolute top-0 right-0 z-0 w-[550px] h-[550px] bg-gradient-to-br from-gold-200/35 via-pine-100/25 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute top-1/3 left-0 z-0 w-[500px] h-[500px] bg-gradient-to-tr from-cedar-200/35 via-gold-100/25 to-transparent rounded-full blur-3xl transform -translate-x-1/3 pointer-events-none" />

      {/* Oriental Golden Wave Pattern Motif in Bottom Right */}
      <div 
        className="absolute -bottom-2 right-0 w-80 sm:w-[420px] h-40 z-0 pointer-events-none opacity-45 select-none bg-repeat"
        style={{ backgroundImage: 'url(/oriental-waves.svg)', backgroundSize: '60px 30px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Text & Call to Action (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left relative isolate">
            
            {/* Top Eyebrow Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-gold-400/60 text-pine-950 text-xs sm:text-sm font-semibold tracking-wide shadow-sm backdrop-blur-md">
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

              <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-100/90 text-gold-900 text-xs font-semibold border border-gold-300/90 shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" strokeWidth={1.5} />
                <span>Highland Hospitality</span>
              </div>
            </div>

            {/* Main Headline with Watermark Centered Directly on "Your Peaceful Haven in the" */}
            <div className="relative space-y-2">
              {/* Golden Dragon Watermark centered right around the headline words (Clean, no glow/shine effect) */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-[45%] w-[480px] h-[480px] sm:w-[560px] sm:h-[560px] lg:w-[620px] lg:h-[620px] -z-10 pointer-events-none select-none flex items-center justify-center opacity-30"
              >
                <img
                  src="/golden-dragon-watermark.png?v=4"
                  alt="Dragon Treasure Watermark"
                  className="w-full h-full object-contain"
                />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-pine-900 tracking-tight leading-[1.12] relative z-10">
                Your Peaceful Haven in the <span className="text-gold-gradient">City of Pines</span>
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-pine-800 font-medium relative z-10">
                Dragon Treasure Transient & Condotel
              </p>
            </div>

            {/* Narrative Description */}
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {PROPERTY_INFO.description} Enjoy crisp mountain breezes, clean contemporary suites, pressurized hot showers, and dedicated 24/7 caretaker assistance.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <a
                href="#rooms"
                className="shimmer-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-md hover:shadow-glow-pine transition-all duration-300 border border-pine-700/50"
              >
                <span>View Accommodations</span>
                <ArrowRight className="w-4 h-4 text-gold-300" strokeWidth={2} />
              </a>

              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-pine-950 bg-white/95 border border-gold-300 hover:border-gold-500 hover:bg-gold-50/50 active:scale-98 shadow-card transition-all duration-300 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-pine-800" strokeWidth={2} />
                <span>Reserve a Room</span>
              </button>

              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-pine-900 bg-gold-100/90 border border-gold-300/90 hover:bg-gold-200 active:scale-98 transition-all duration-200 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gold-700" strokeWidth={2} />
                <span>Virtual Concierge</span>
              </button>
            </div>

            {/* Trust & Amenity Highlights Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 max-w-xl mx-auto lg:mx-0 border-t border-gold-200/70">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/85 border border-gold-300/70 text-xs sm:text-sm text-slate-800 font-medium shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-pine-700 flex-shrink-0" strokeWidth={2} />
                <span>24/7 Caretaker</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/85 border border-gold-300/70 text-xs sm:text-sm text-slate-800 font-medium shadow-2xs">
                <Wifi className="w-4 h-4 text-pine-700 flex-shrink-0" strokeWidth={2} />
                <span>Fast Free Wi-Fi</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/85 border border-gold-300/70 text-xs sm:text-sm text-slate-800 font-medium shadow-2xs">
                <Flame className="w-4 h-4 text-pine-700 flex-shrink-0" strokeWidth={2} />
                <span>Hot Showers</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image & Quick Reservation Search Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Photography Card */}
            <div className="group relative rounded-3xl overflow-hidden shadow-luxury border-4 border-white/90 bg-stone-900">
              <img
                src="/front.view.jpg"
                alt="Dragon Treasure Transient & Condotel Baguio Exterior"
                className="w-full h-64 sm:h-72 object-cover object-[center_35%] transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-black/15 to-transparent" />

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
              className="bg-[#fffdfa] rounded-3xl p-5 sm:p-6 shadow-luxury border-2 border-gold-300/80 space-y-4"
            >
              {/* Card Header & Category Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-gold-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gold-100 text-pine-900 flex items-center justify-center border border-gold-300/80 shadow-2xs">
                    <BedDouble className="w-4 h-4 text-pine-700" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold text-pine-950 uppercase tracking-wider">
                    Quick Inquiry
                  </span>
                </div>

                <div className="flex p-0.5 bg-gold-100/60 rounded-lg border border-gold-300/70">
                  <button
                    type="button"
                    onClick={() => handleCategorySwitch('transient')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      activeTab === 'transient'
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-pine-900'
                    }`}
                  >
                    Transient
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategorySwitch('dormitory')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      activeTab === 'dormitory'
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-pine-900'
                    }`}
                  >
                    Monthly Dorm
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Room Option Luxury Dropdown */}
                <RoomDropdown
                  rooms={filteredRoomOptions}
                  selectedRoomName={selectedRoom}
                  onSelectRoom={handleSelectRoom}
                  label="Room Option"
                />

                {/* Guests Luxury Dropdown with capacity enforcement */}
                <GuestDropdown
                  value={guests}
                  onChange={(val) => setGuests(val)}
                  maxGuests={currentRoomObj.capacity}
                  roomCapacityLabel={currentRoomObj.capacityLabel}
                  label="Guests"
                />

                {/* Check-In Luxury Date Picker */}
                <DatePickerInput
                  label="Check-in Date"
                  value={checkIn}
                  onChange={(date) => {
                    setCheckIn(date);
                    if (!checkOut || checkOut <= date) {
                      const next = new Date(date);
                      next.setDate(next.getDate() + 1);
                      setCheckOut(next.toISOString().split('T')[0]);
                    }
                  }}
                  placeholder="Select check-in"
                />

                {/* Check-Out Luxury Date Picker */}
                <DatePickerInput
                  label="Check-out Date"
                  value={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  minDate={checkIn || new Date().toISOString().split('T')[0]}
                  placeholder="Select check-out"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="shimmer-btn w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-md hover:shadow-glow-pine transition-all duration-300 flex items-center justify-center gap-2 border border-pine-700/50 cursor-pointer"
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
