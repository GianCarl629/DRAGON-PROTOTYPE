import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Phone, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { AdminDataManager } from '../data/adminMockData';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Top Header */}
      <div>
        <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
          <span>System & Property Settings</span>
          <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300">
            Internal Config
          </span>
        </h2>
        <p className="text-xs text-slate-600">
          Configure property contact details, front desk reception shift schedules, and prototype data persistence.
        </p>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Property operational parameters updated successfully.</span>
        </div>
      )}

      {/* Property Information Form */}
      <form onSubmit={handleSaveSettings} className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-6 space-y-4 shadow-card">
        <h3 className="font-serif font-bold text-base text-pine-950 flex items-center gap-2 pb-3 border-b border-stone-100">
          <Building2 className="w-4 h-4 text-gold-600" />
          <span>Dragon Treasure Property Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Property Name</label>
            <input
              type="text"
              defaultValue="Dragon Treasure Transient & Condotel"
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Location</label>
            <input
              type="text"
              defaultValue="Baguio City, Benguet, Philippines"
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Standard Check-In Time</label>
            <input
              type="text"
              defaultValue="2:00 PM"
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Standard Check-Out Time</label>
            <input
              type="text"
              defaultValue="12:00 PM"
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Front Desk Hotline</label>
            <input
              type="text"
              defaultValue="0917-123-4567"
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">24/7 Caretaker Phone</label>
            <input
              type="text"
              defaultValue="0928-555-4321"
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all"
          >
            Save Property Details
          </button>
        </div>
      </form>

      {/* Security & Prototype Architecture Notice (Sections 20 & 21) */}
      <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-6 space-y-3 shadow-card">
        <h3 className="font-serif font-bold text-base text-pine-950 flex items-center gap-2 pb-2 border-b border-stone-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Security & System Architecture Notice</span>
        </h3>

        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            <strong className="text-pine-950 font-bold">Prototype Separation:</strong> This administrative portal operates as an independent, unlinked frontend route (<code className="text-pine-900 bg-gold-50 border border-gold-200 px-1.5 py-0.5 rounded font-mono">/admin.html</code>) separated from the customer experience.
          </p>
          <p className="text-slate-500">
            For production deployment, this interface will connect to server-side role-based authorization (Manager, Receptionist, Administrator) with JWT/session cookies, password hashing, and encrypted database records.
          </p>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-6 space-y-3 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-pine-950 flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Demo Admin Data</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Restore initial mock reservations, room statuses, dorm slots, and billing records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Reset admin database to original demo fixtures?')) {
              onResetData();
            }
          }}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs"
        >
          Reset Demo Data
        </button>
      </div>

    </div>
  );
};

