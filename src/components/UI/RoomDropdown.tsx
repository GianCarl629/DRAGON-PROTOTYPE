import React, { useState, useRef, useEffect } from 'react';
import { BedDouble, ChevronDown, Check } from 'lucide-react';
import { Room } from '../../types';

interface RoomDropdownProps {
  rooms: Room[];
  selectedRoomName: string;
  onSelectRoom: (roomName: string) => void;
  label?: string;
  id?: string;
}

export const RoomDropdown: React.FC<RoomDropdownProps> = ({
  rooms,
  selectedRoomName,
  onSelectRoom,
  label = 'Room Choice',
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRoom = rooms.find((r) => r.name === selectedRoomName) || rooms[0];

  // Click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHoveredRoomId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setHoveredRoomId(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (roomName: string) => {
    onSelectRoom(roomName);
    setIsOpen(false);
    setHoveredRoomId(null);
  };

  return (
    <div className="relative space-y-1" ref={containerRef} id={id}>
      {label && (
        <label className="text-xs font-bold text-pine-950 flex items-center gap-1.5 uppercase tracking-wider">
          <BedDouble className="w-3.5 h-3.5 text-pine-700" strokeWidth={2} />
          <span>{label}</span>
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setHoveredRoomId(null);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full text-left bg-white border rounded-2xl px-3.5 py-2.5 transition-all duration-200 flex items-center justify-between gap-2 shadow-xs hover:border-gold-400 focus:outline-none focus:ring-2 focus:ring-pine-800 cursor-pointer ${
          isOpen ? 'border-pine-800 ring-2 ring-pine-800/10 shadow-md' : 'border-stone-200'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedRoom?.image ? (
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200 shadow-2xs">
              <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-pine-50 text-pine-800 flex items-center justify-center flex-shrink-0 border border-pine-100">
              <BedDouble className="w-4 h-4 text-pine-700" strokeWidth={2} />
            </div>
          )}
          <div className="truncate">
            <span className="block text-xs sm:text-sm font-bold text-pine-950 truncate">
              {selectedRoom ? selectedRoom.name : 'Select a Room'}
            </span>
            {selectedRoom && (
              <span className="block text-[11px] text-slate-500 font-semibold truncate">
                <span className="text-pine-800 font-bold">₱{selectedRoom.rate.toLocaleString()}</span> / {selectedRoom.ratePeriod} • {selectedRoom.capacityLabel}
              </span>
            )}
          </div>
        </div>

        <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform duration-200 flex-shrink-0 ${
          isOpen ? 'bg-pine-900 text-white rotate-180' : 'bg-stone-100 text-slate-600'
        }`}>
          <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>
      </button>

      {/* Options Dropdown Menu: Clean, with hovering revealing a floating panel above that specific option */}
      {isOpen && (
        <div
          onMouseLeave={() => setHoveredRoomId(null)}
          className="absolute top-full left-0 right-0 sm:min-w-[340px] mt-2 z-50 bg-white border border-stone-200 rounded-3xl shadow-2xl p-3 space-y-2 animate-fade-in"
        >
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Choose Room Option</span>
            <span>{rooms.length} Units</span>
          </div>
          
          <div className="space-y-1.5">
            {rooms.map((room) => {
              const isSelected = selectedRoom?.name === room.name;
              const isHovered = hoveredRoomId === room.id;
              const isDorm = room.category === 'dormitory';

              return (
                <div
                  key={room.id}
                  className="relative"
                  onMouseEnter={() => setHoveredRoomId(room.id)}
                  onMouseLeave={() => setHoveredRoomId(null)}
                >
                  {/* Floating Panel: 100% solid opaque card with crystal-clear high-contrast details */}
                  {isHovered && (
                    <div className="absolute bottom-full left-0 right-0 mb-2.5 z-60 pointer-events-none animate-fade-in">
                      <div className="bg-white border-2 border-gold-400 rounded-2xl p-3 shadow-2xl shadow-pine-950/25 ring-4 ring-pine-950/10 space-y-2">
                        <div className="flex items-start gap-3">
                          {/* Clear High-Res Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0 border-2 border-gold-400/80 shadow-xs">
                            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                          </div>

                          {/* Crystal-Clear Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <h4 className="font-serif font-bold text-sm text-pine-950 truncate">
                                {room.name}
                              </h4>
                              <span className="text-xs font-extrabold text-pine-800 font-serif bg-gold-50 border border-gold-300 px-2 py-0.5 rounded-lg flex-shrink-0 shadow-2xs">
                                ₱{room.rate.toLocaleString()}
                                <span className="text-[10px] text-slate-600 font-sans font-normal">/{room.ratePeriod}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                isDorm
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-pine-100 text-pine-900 border border-pine-200'
                              }`}>
                                {isDorm ? 'Monthly Dorm' : 'Transient Lodging'}
                              </span>
                              <span className="text-[11px] font-bold text-slate-700 truncate">
                                • {room.capacityLabel}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed line-clamp-2">
                              {room.description}
                            </p>

                            {/* Amenity Badges with high contrast */}
                            <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                              {room.features.slice(0, 3).map((feat, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-bold text-pine-900 bg-pine-50 border border-pine-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs"
                                >
                                  <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                                  <span>{feat}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Solid Downward Pointer Arrow */}
                      <div className="flex justify-center -mt-1.5">
                        <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-gold-400 rotate-45 shadow-xs" />
                      </div>
                    </div>
                  )}

                  {/* Option Button */}
                  <button
                    type="button"
                    onClick={() => handleSelect(room.name)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-pine-900 text-white shadow-xs'
                        : isHovered
                        ? 'bg-pine-50 border border-pine-300 text-pine-950 shadow-2xs'
                        : 'hover:bg-stone-50 text-slate-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-900 flex-shrink-0 border border-white/20">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-pine-950'}`}>
                            {room.name}
                          </span>
                        </div>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                          <strong className={isSelected ? 'text-gold-300' : 'text-pine-900 font-semibold'}>
                            ₱{room.rate.toLocaleString()}
                          </strong>{' '}
                          / {room.ratePeriod} • {room.capacityLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : isDorm
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-stone-100 text-slate-700 border border-stone-200'
                      }`}>
                        {isDorm ? 'Dorm' : 'Transient'}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-gold-400 text-pine-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-1 pb-0.5 text-center text-[10.5px] text-slate-400 font-medium">
            Hover cursor on any room to view floating details
          </div>
        </div>
      )}
    </div>
  );
};
