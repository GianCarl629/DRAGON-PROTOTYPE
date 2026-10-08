import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Innayon ti Supabase
import { 
  Building2, 
  User, 
  Phone, 
  Zap, 
  X, 
  UserCheck, 
  UserMinus
} from 'lucide-react';

// Na-update a format para iti Supabase db structure
export interface AdminDormSlot {
  id: string;
  dormRoom: string; // Katumbas ti room_number
  wing: string;
  bedSlot: string; // Katumbas ti bed_identifier
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
  tenantName: string | null;
  tenantPhone?: string;
  dueDate: string | null;
  contractEnd?: string;
  monthlyRate: number;
  utilityStatus: string;
}

// Inikkat ti slots prop ta agala itan iti live data
interface DormitoryViewProps {}

export const DormitoryView: React.FC<DormitoryViewProps> = () => {
  const [slots, setSlots] = useState<AdminDormSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState<AdminDormSlot | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [assignForm, setAssignForm] = useState({
    tenantName: '',
    tenantPhone: '',
    monthlyRate: 3500, // In-adjust babaen ti standard rate
    dueDate: '',
    contractEnd: '',
    utilityStatus: 'Inclusive of Wi-Fi & Water'
  });

  // MANGALA TI DATA MANIPUD SUPABASE
  const fetchDormBeds = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('dorm_beds')
      .select('*')
      .order('room_number', { ascending: true })
      .order('bed_identifier', { ascending: true });

    if (error) {
      console.error("Error fetching beds:", error);
    } else if (data) {
      const formattedSlots: AdminDormSlot[] = data.map((d: any) => ({
        id: d.id,
        dormRoom: d.room_number,
        wing: d.wing,
        bedSlot: d.bed_identifier,
        status: (d.status as any) || 'Available',
        tenantName: d.tenant_name,
        tenantPhone: d.tenant_phone,
        dueDate: d.due_date,
        monthlyRate: Number(d.monthly_rent) || 3500,
        utilityStatus: d.amenities || 'Inclusive of Wi-Fi & Water'
      }));
      setSlots(formattedSlots);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDormBeds();
  }, []);

  // Group slots by Dorm Room
  const dormRooms = Array.from(new Set(slots.map(s => s.dormRoom)));

  const handleOpenAssign = (slot: AdminDormSlot) => {
    setSelectedSlot(slot);
    setAssignForm({
      tenantName: slot.tenantName || '',
      tenantPhone: slot.tenantPhone || '',
      monthlyRate: slot.monthlyRate,
      dueDate: slot.dueDate || new Date().toISOString().split('T')[0],
      contractEnd: slot.contractEnd || '',
      utilityStatus: slot.utilityStatus
    });
    setIsAssignModalOpen(true);
  };

  const handleSaveAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlot) {
      const { error } = await supabase
        .from('dorm_beds')
        .update({
          tenant_name: assignForm.tenantName.trim(),
          tenant_phone: assignForm.tenantPhone.trim(),
          monthly_rent: Number(assignForm.monthlyRate) || selectedSlot.monthlyRate,
          due_date: assignForm.dueDate,
          amenities: assignForm.utilityStatus,
          status: 'Occupied'
        })
        .eq('id', selectedSlot.id);

      if (!error) {
        setIsAssignModalOpen(false);
        setSelectedSlot(null);
        fetchDormBeds(); // I-refresh ti data tapno agparang a dagus ti baro a tenant
      } else {
        alert("Pammakaammo: Saan a naisave iti database. Basaen ti console logs.");
        console.error(error);
      }
    }
  };

  const handleVacateSlot = async (slot: AdminDormSlot) => {
    if (window.confirm(`Vacate ${slot.dormRoom} - ${slot.bedSlot}? Tenant record will be cleared.`)) {
      const { error } = await supabase
        .from('dorm_beds')
        .update({
          tenant_name: null,
          tenant_phone: null,
          due_date: null,
          status: 'Available'
        })
        .eq('id', slot.id);

      if (!error) {
        fetchDormBeds();
      }
    }
  };

  const totalSlots = slots.length;
  const occupiedSlots = slots.filter(s => s.status === 'Occupied').length;
  const availableSlots = slots.filter(s => s.status === 'Available').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
            <span>Dormitory Management</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-pine-900 border border-gold-300">
              Long-Term Monthly Stays
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Manage bed assignments, monthly student leases, due dates, and utility sub-meters.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-[#fffdfa] border border-gold-200/90 px-4 py-2 rounded-2xl text-xs shadow-card">
          <div className="text-slate-700">
            Total Beds: <strong className="text-pine-900">{totalSlots}</strong>
          </div>
          <span className="text-gold-300">•</span>
          <div className="text-emerald-800">
            Available: <strong>{availableSlots}</strong>
          </div>
          <span className="text-gold-300">•</span>
          <div className="text-pine-900">
            Occupied: <strong>{occupiedSlots}</strong>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500 font-semibold text-sm flex justify-center items-center gap-2">
          <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          Agur-uray, karkargaen dagiti record ti kuarto ken kama manipud database...
        </div>
      ) : (
        /* Dorm Rooms & Bed Slots Grid */
        <div className="space-y-6">
          {dormRooms.map((roomName) => {
            const roomSlots = slots.filter(s => s.dormRoom === roomName);
            const wing = roomSlots[0]?.wing || 'Co-ed';

            return (
              <div key={roomName} className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-card">
                
                {/* Dorm Room Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gold-200/70 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-100 text-pine-900 flex items-center justify-center border border-gold-300">
                      <Building2 className="w-5 h-5 text-pine-700" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-pine-950">
                        {roomName}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-pine-900 border border-stone-200 font-semibold">
                          {wing}
                        </span>
                        <span>4 Total Bunks</span>
                        <span>•</span>
                        <span>Baguio Central Location</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <span>Capacity: 4 Bed Slots</span>
                    <span className="text-gold-300">•</span>
                    <span className="font-bold text-emerald-800">
                      {roomSlots.filter(s => s.status === 'Available').length} Vacancies
                    </span>
                  </div>
                </div>

                {/* 4 Bed Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roomSlots.map((slot) => {
                    const isOccupied = slot.status === 'Occupied';
                    const isAvailable = slot.status === 'Available';

                    return (
                      <div
                        key={slot.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                          isOccupied
                            ? 'bg-stone-50 border-gold-300/90 shadow-2xs'
                            : isAvailable
                            ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                            : 'bg-amber-50/40 border-amber-300 shadow-2xs'
                        }`}
                      >
                        {/* Bed Header & Badge */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-pine-950">
                              {slot.bedSlot}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                isOccupied
                                  ? 'bg-gold-100 text-gold-900 border border-gold-300'
                                  : isAvailable
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {slot.status}
                            </span>
                          </div>

                          {/* Tenant Info */}
                          {isOccupied && slot.tenantName ? (
                            <div className="space-y-1 text-xs pt-1">
                              <div className="flex items-center gap-1.5 text-pine-950 font-bold">
                                <User className="w-3.5 h-3.5 text-pine-700" />
                                <span className="truncate">{slot.tenantName}</span>
                              </div>
                              {slot.tenantPhone && (
                                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                                  <Phone className="w-3 h-3 text-pine-700" />
                                  <span>{slot.tenantPhone}</span>
                                </div>
                              )}
                              <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                                <span>Due Date:</span>
                                <span className="text-amber-800 font-bold">{slot.dueDate}</span>
                              </div>
                            </div>
                          ) : slot.status === 'Reserved' ? (
                            <div className="space-y-1 text-xs pt-1 text-amber-900">
                              <div className="font-semibold">{slot.tenantName || 'Move-in Reserved'}</div>
                              <div className="text-[11px] text-slate-500">Target move-in: {slot.dueDate || 'Soon'}</div>
                            </div>
                          ) : (
                            <div className="py-2 text-center text-xs text-slate-500 italic">
                              Bed ready for immediate occupancy
                            </div>
                          )}
                        </div>

                        {/* Financial & Utility Footnote */}
                        <div className="space-y-2 pt-2 border-t border-stone-200 text-xs">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[11px] text-slate-600">Monthly Rent:</span>
                            <span className="font-bold text-pine-900 font-serif">
                              ₱{slot.monthlyRate.toLocaleString()}/mo
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-600 flex items-center gap-1 bg-white p-1.5 rounded-lg border border-stone-200">
                            <Zap className="w-3 h-3 text-gold-600 flex-shrink-0" />
                            <span className="truncate">{slot.utilityStatus}</span>
                          </div>

                          {/* Actions */}
                          <div className="pt-1 flex items-center gap-1.5">
                            {isOccupied ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenAssign(slot)}
                                  className="flex-1 py-1.5 px-2 bg-white hover:bg-gold-50 text-pine-950 border border-gold-300 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center"
                                >
                                  Edit Tenant
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleVacateSlot(slot)}
                                  className="p-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                  title="Vacate Bed"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenAssign(slot)}
                                className="w-full py-1.5 px-2 bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                              >
                                <UserCheck className="w-3 h-3 text-gold-300" />
                                <span>Assign Tenant</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ASSIGN BED MODAL */}
      {isAssignModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveAssign} className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-slate-900 font-serif">
                Assign Bed: {selectedSlot.dormRoom} — {selectedSlot.bedSlot}
              </h3>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Tenant Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan Dela Cruz"
                  value={assignForm.tenantName}
                  onChange={(e) => setAssignForm({ ...assignForm, tenantName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Phone Contact *</label>
                <input
                  type="text"
                  required
                  placeholder="0917-000-0000"
                  value={assignForm.tenantPhone}
                  onChange={(e) => setAssignForm({ ...assignForm, tenantPhone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Monthly Rent (₱)</label>
                <input
                  type="number"
                  step="100"
                  value={assignForm.monthlyRate}
                  onChange={(e) => setAssignForm({ ...assignForm, monthlyRate: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Monthly Due Date</label>
                <input
                  type="date"
                  value={assignForm.dueDate}
                  onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-700 block font-semibold">Utility Agreement Terms</label>
                <input
                  type="text"
                  value={assignForm.utilityStatus}
                  onChange={(e) => setAssignForm({ ...assignForm, utilityStatus: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Bed Assignment
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};