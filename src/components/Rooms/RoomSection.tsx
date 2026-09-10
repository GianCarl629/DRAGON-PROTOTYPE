import React, { useState } from 'react';
import { SAMPLE_ROOMS } from '../../data/mockData';
import { Room, RoomCategory } from '../../types';
import { RoomCard } from './RoomCard';
import { RoomDetailModal } from './RoomDetailModal';
import { Sparkles, BedDouble, Building, Layers } from 'lucide-react';

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

  return (
    <section id="rooms" className="py-20 bg-slate-50/70 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-semibold tracking-wide uppercase">
            <BedDouble className="w-3.5 h-3.5 text-pine-600" />
            <span>Sample Room Inventory</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pine-950">
            Rooms & Accommodations
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Choose from our comfortable short-term transient rooms for your Baguio vacation or explore our monthly dormitory rentals tailored for students and working professionals.
          </p>

          <p className="text-xs text-slate-600 italic">
            * Demonstration data only. Easily integrated with database records via REST API or ORM.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm gap-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-pine-800 text-white shadow'
                  : 'text-slate-600 hover:text-pine-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Options ({SAMPLE_ROOMS.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('transient')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'transient'
                  ? 'bg-pine-800 text-white shadow'
                  : 'text-slate-600 hover:text-pine-900 hover:bg-slate-50'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>Short-Term Transient (4)</span>
            </button>

            <button
              onClick={() => setActiveCategory('dormitory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'dormitory'
                  ? 'bg-pine-800 text-white shadow'
                  : 'text-slate-600 hover:text-pine-900 hover:bg-slate-50'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Monthly Dormitory (1)</span>
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelect={(r) => setSelectedRoom(r)}
              onBook={(r) => handleBookRoom(r)}
            />
          ))}
        </div>

        {/* Quick Help Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cedar-100 text-cedar-800 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-cedar-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Need help choosing a room?</h4>
              <p className="text-xs text-slate-600">Our floating Dragon Treasure Assistant can answer questions regarding rates, capacity, and check-in times.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenBooking()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-pine-900 bg-pine-50 hover:bg-pine-100 border border-pine-200 transition-colors whitespace-nowrap"
          >
            Open Booking Request Form
          </button>
        </div>

      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onBook={(r) => handleBookRoom(r)}
      />
    </section>
  );
};
