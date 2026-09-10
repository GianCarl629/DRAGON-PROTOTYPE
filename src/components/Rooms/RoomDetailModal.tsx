import React from 'react';
import { X, Users, Check, CalendarCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import { Room } from '../../types';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onBook: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose, onBook }) => {
  if (!room) return null;

  const isDorm = room.category === 'dormitory';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Modal Header Image */}
        <div className="relative h-64 sm:h-72 bg-slate-900">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pine-900/90 border border-pine-700/50 backdrop-blur-md">
              {isDorm ? 'Monthly Dormitory Rental' : 'Short-Term Transient Lodging'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1 text-white">
              {room.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-pine-50/60 border border-pine-100">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Rate</span>
              <span className="text-base font-bold text-pine-950 font-serif">
                ₱{room.rate.toLocaleString()} <span className="text-xs font-normal text-slate-600">/ {room.ratePeriod}</span>
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Capacity</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-pine-700" />
                {room.capacityLabel}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-500 font-medium block">Demo Inventory</span>
              <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                {room.sampleQuantity} rooms (sample)
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Inclusions & Amenities */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Room Inclusions & Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-pine-100 text-pine-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prototype disclaimer note */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Prototype Demonstration:</span> All room specifications, rates, and inventory counts are demonstration mock data for this capstone project.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(room);
              }}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-cedar-300" />
              <span>Book This Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
