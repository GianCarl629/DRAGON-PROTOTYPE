import React from 'react';
import { Users, Bed, Check, Info, CalendarCheck } from 'lucide-react';
import { Room } from '../../types';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  onBook: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect, onBook }) => {
  const isDorm = room.category === 'dormitory';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col group">
      {/* Image with badges */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm ${
              isDorm
                ? 'bg-amber-700/90 text-amber-100 border border-amber-500/30'
                : 'bg-pine-900/90 text-pine-100 border border-pine-700/40'
            }`}
          >
            {isDorm ? 'Monthly Rental' : 'Short-Term Lodging'}
          </span>
          {room.popular && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cedar-600 text-white shadow-sm w-fit">
              Most Popular
            </span>
          )}
        </div>

        {/* Demo Quantity Indicator */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-700 border border-slate-200/60 shadow-sm">
          Sample Inv: <span className="font-bold text-pine-900">{room.sampleQuantity} rooms</span>
        </div>

        {/* Capacity overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
          <Users className="w-3.5 h-3.5 text-cedar-300" />
          <span>Capacity: {room.capacityLabel}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-pine-800 transition-colors">
              {room.name}
            </h3>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Key Feature Bullets */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-1.5">
            {room.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-pine-700 flex-shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
            {room.features.length > 3 && (
              <p className="text-[11px] text-slate-600 font-medium pl-5.5">
                + {room.features.length - 3} more amenities
              </p>
            )}
          </div>
        </div>

        {/* Price & Actions footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-600 uppercase font-semibold tracking-wider">
              {isDorm ? 'Monthly Rate' : 'Nightly Rate'}
            </div>
            <div className="text-lg font-bold text-pine-950 font-serif">
              ₱{room.rate.toLocaleString()}
              <span className="text-xs font-normal text-slate-600 ml-1">
                / {room.ratePeriod}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(room)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              title="View room details"
              aria-label={`View details for ${room.name}`}
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => onBook(room)}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow-sm transition-all flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-cedar-300" />
              <span>Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
