import React, { useState } from 'react';
import { SAMPLE_ROOMS } from '../../data/mockData';
import { Room, RoomCategory } from '../../types';
import { RoomCard } from './RoomCard';
import { RoomDetailModal } from './RoomDetailModal';
import { Sparkles, BedDouble, Building, Layers, HelpCircle, PhoneCall } from 'lucide-react';
import { DEMO_CONTACT } from '../../data/mockData';

interface RoomSectionProps {
  onOpenBooking: (roomType?: string) => void;
}

export const RoomSection: React.FC<RoomSectionProps> = ({ onOpenBooking }) => {
  const [activeCategory, setActiveCategory] = useState<RoomCategory>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = SAMPLE_ROOMS.filter((room) => {
    if (activeCategory === 'all') return true;
    return room.category === activeCategory;
  });

  const handleBookRoom = (room: Room) => {
    onOpenBooking(room.name);
  };

  const transientCount = SAMPLE_ROOMS.filter(r => r.category === 'transient').length;
  const dormCount = SAMPLE_ROOMS.filter(r => r.category === 'dormitory').length;

  return (
    <section id="rooms" className="py-24 bg-stone-50/70 border-t border-stone-200/60 relative overflow-hidden">
      {/* Background Ambient Radial Spot */}
      <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-gradient-to-b from-pine-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100/80 text-gold-900 border border-gold-300/80 text-xs font-semibold tracking-wider uppercase">
            <BedDouble className="w-3.5 h-3.5 text-gold-700" strokeWidth={2} />
            <span>Accommodations & Rates</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pine-950 tracking-tight">
            Rooms & <span className="text-gold-gradient">Accommodations</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Choose from our comfortable short-term transient rooms for your Baguio vacation or explore our secure monthly dormitory rentals tailored for students, board examinees, and professionals.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-stone-200 shadow-sm gap-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-pine-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-pine-950 hover:bg-stone-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" strokeWidth={2} />
              <span>All Rooms ({SAMPLE_ROOMS.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('transient')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === 'transient'
                  ? 'bg-pine-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-pine-950 hover:bg-stone-50'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Transient Lodging ({transientCount})</span>
            </button>

            <button
              onClick={() => setActiveCategory('dormitory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === 'dormitory'
                  ? 'bg-pine-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-pine-950 hover:bg-stone-50'
              }`}
            >
              <Building className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Monthly Dorms ({dormCount})</span>
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelect={(r) => setSelectedRoom(r)}
              onBook={(r) => handleBookRoom(r)}
            />
          ))}
        </div>

        {/* Guest Inquiries Assistance Strip */}
        <div className="mt-14 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-pine-950 via-pine-900 to-pine-950 text-white border border-gold-500/30 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-400/40 text-gold-300 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Need customized group rates or monthly dorm arrangements?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Our front desk is available to assist you with special requests, family bookings, and long-term stays.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:0917-123-4567"
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              Call {DEMO_CONTACT.phone}
            </a>
            <button
              onClick={() => onOpenBooking()}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-pine-950 bg-white hover:bg-gold-300 active:scale-95 shadow-md border border-white/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Direct Inquiry</span>
            </button>
          </div>
        </div>

      </div>

      {/* Selected Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onBook={(room) => {
          setSelectedRoom(null);
          handleBookRoom(room);
        }}
      />
    </section>
  );
};
