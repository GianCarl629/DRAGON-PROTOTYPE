import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  BedDouble, 
  Plus, 
  Search, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Trash2, 
  Sparkles,
  Users,
  Tag,
  Layers
} from 'lucide-react';
import { SAMPLE_ROOMS } from '../../data/mockData';
import { AdminDataManager, INITIAL_ADMIN_ROOMS } from '../data/adminMockData';

export interface AdminRoom {
  id: string;
  roomNumber: string;
  name: string;
  category: string;
  roomType: string;
  capacity: number;
  price: number;
  ratePeriod: string;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
  floor: string;
  amenities: string[];
}

interface RoomsViewProps {
  rooms?: AdminRoom[];
  onAddRoom?: (newRoom: AdminRoom) => void;
  onUpdateRoom?: (updated: AdminRoom) => void;
  onDeleteRoom?: (id: string) => void;
  initialFilter?: string;
}

export const RoomsView: React.FC<RoomsViewProps> = ({ initialFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Occupied' | 'Reserved' | 'Maintenance'>(
    (initialFilter as any) || 'All'
  );

  const [dbRooms, setDbRooms] = useState<AdminRoom[]>([]);
  const [syncedRooms, setSyncedRooms] = useState<AdminRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('room_units')
        .select('*')
        .order('room_number', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn("Notice: Using baseline room units data:", error);
        const store = AdminDataManager.loadStore();
        setDbRooms((store.rooms as any) || (INITIAL_ADMIN_ROOMS as any));
      } else {
        const formattedRooms: AdminRoom[] = data.map((d: any) => ({
          id: d.id,
          roomNumber: d.room_number,
          name: d.name,
          category: d.category,
          roomType: d.room_type,
          capacity: d.capacity,
          price: d.price,
          ratePeriod: d.rate_period,
          status: d.status,
          floor: d.floor || '',
          amenities: d.amenities ? (Array.isArray(d.amenities) ? d.amenities : d.amenities.split(',').map((s: string) => s.trim())) : []
        }));
        setDbRooms(formattedRooms);
      }
    } catch (err) {
      console.warn("Notice: Error fetching rooms, using baseline:", err);
      const store = AdminDataManager.loadStore();
      setDbRooms((store.rooms as any) || (INITIAL_ADMIN_ROOMS as any));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    const channel = supabase
      .channel('admin-rooms-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_units' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const today = new Date().toLocaleDateString('en-CA');

        const { data: activeReservations, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('status', 'Confirmed')
          .gte('check_out_date', today);

        if (error) {
          console.warn("Notice: Live reservation sync error:", error);
          setSyncedRooms(dbRooms);
          return;
        }

        if (activeReservations) {
          const occupiedCounts: Record<string, number> = {};
          const reservedCounts: Record<string, number> = {};

          activeReservations.forEach(res => {
            const dbType = (res.room_type || res.room_id || '').toLowerCase().replace(/-/g, ' ');
            const resCheckIn = res.check_in_date || res.check_in || '';
            const resCheckOut = res.check_out_date || res.check_out || '';

            if (resCheckIn <= today && resCheckOut >= today) {
              occupiedCounts[dbType] = (occupiedCounts[dbType] || 0) + 1;
            } else if (resCheckIn > today) {
              reservedCounts[dbType] = (reservedCounts[dbType] || 0) + 1;
            }
          });

          const updatedRooms = dbRooms.map((room): AdminRoom => {
            if (room.status === 'Maintenance') return room;

            const localType = room.roomType.toLowerCase().replace(/-/g, ' ');

            if (occupiedCounts[localType] > 0) {
              occupiedCounts[localType] -= 1;
              return { ...room, status: 'Occupied' };
            }
            if (reservedCounts[localType] > 0) {
              reservedCounts[localType] -= 1;
              return { ...room, status: 'Reserved' };
            }
            return { ...room, status: 'Available' };
          });

          setSyncedRooms(updatedRooms);
        } else {
          setSyncedRooms(dbRooms);
        }
      } catch (error) {
        console.warn("Notice: Error syncing status:", error);
        setSyncedRooms(dbRooms);
      }
    };

    if (dbRooms.length > 0) {
      fetchLiveStatus();
    } else {
      setSyncedRooms([]);
    }
  }, [dbRooms]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<AdminRoom | null>(null);

  const [formData, setFormData] = useState({
    roomNumber: '',
    name: '',
    category: SAMPLE_ROOMS[0].category as 'transient' | 'dormitory',
    roomType: SAMPLE_ROOMS[0].name,
    capacity: SAMPLE_ROOMS[0].capacity,
    price: SAMPLE_ROOMS[0].rate,
    ratePeriod: (SAMPLE_ROOMS[0].category === 'dormitory' ? 'month' : 'night') as 'night' | 'month',
    status: 'Available' as 'Available' | 'Occupied' | 'Reserved' | 'Maintenance',
    floor: '1st Floor',
    amenities: SAMPLE_ROOMS[0].features.join(', ')
  });

  const handleRoomTypeSelect = (typeName: string) => {
    const selected = SAMPLE_ROOMS.find((r) => r.name === typeName) || SAMPLE_ROOMS[0];
    setFormData((prev) => ({
      ...prev,
      roomType: selected.name,
      category: selected.category,
      capacity: selected.capacity,
      price: selected.rate,
      ratePeriod: selected.category === 'dormitory' ? 'month' : 'night',
      amenities: selected.features.join(', ')
    }));
  };

  const filteredRooms = syncedRooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.floor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleQuickStatusChange = async (roomId: string, newStatus: string) => {
    const { error } = await supabase
      .from('room_units')
      .update({ status: newStatus })
      .eq('id', roomId);
    
    if (!error) {
      fetchRooms();
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    const { error } = await supabase
      .from('room_units')
      .update({
        room_number: editingRoom.roomNumber,
        name: editingRoom.name,
        capacity: editingRoom.capacity,
        price: editingRoom.price,
        floor: editingRoom.floor,
        status: editingRoom.status
      })
      .eq('id', editingRoom.id);

    if (!error) {
      setEditingRoom(null);
      fetchRooms();
    } else {
      alert("Error updating room!");
      console.error(error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dbPayload = {
      room_number: formData.roomNumber.trim(),
      name: formData.name.trim() || `${formData.roomType} ${formData.roomNumber}`,
      category: formData.category,
      room_type: formData.roomType,
      capacity: Number(formData.capacity) || 2,
      price: Number(formData.price) || 1500,
      rate_period: formData.ratePeriod,
      status: formData.status,
      floor: formData.floor,
      amenities: formData.amenities
    };

    const { error } = await supabase.from('room_units').insert([dbPayload]);

    if (!error) {
      setIsAddModalOpen(false);
      setFormData({
        roomNumber: '',
        name: '',
        category: SAMPLE_ROOMS[0].category,
        roomType: SAMPLE_ROOMS[0].name,
        capacity: SAMPLE_ROOMS[0].capacity,
        price: SAMPLE_ROOMS[0].rate,
        ratePeriod: SAMPLE_ROOMS[0].category === 'dormitory' ? 'month' : 'night',
        status: 'Available',
        floor: '1st Floor',
        amenities: SAMPLE_ROOMS[0].features.join(', ')
      });
      fetchRooms();
    } else {
      alert("Error adding new room!");
      console.error(error);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      const { error } = await supabase.from('room_units').delete().eq('id', id);
      if (!error) {
        fetchRooms();
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
            <span>Room & Unit Inventory</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-pine-900 border border-gold-300">
              {syncedRooms.length} Units
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Configure room pricing, occupancy status, maintenance logs, and guest capacity limits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      <div className="p-4 rounded-3xl bg-[#fffdfa] border border-gold-200/90 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-pine-700" />
            </div>
            <input
              type="text"
              placeholder="Search by room number (e.g. Room 201), type, floor, or amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['All', 'Available', 'Occupied', 'Reserved', 'Maintenance'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-pine-900 hover:bg-gold-50'
                }`}
              >
                {tab}
                {tab !== 'All' && (
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    statusFilter === tab ? 'bg-pine-950 text-gold-300' : 'bg-gold-100 text-gold-900'
                  }`}>
                    {syncedRooms.filter(r => r.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl overflow-hidden shadow-card">
        
        <div className="block md:hidden divide-y divide-gold-200/60">
          {filteredRooms.length === 0 ? (
            <div className="py-12 px-4 text-center text-slate-400 text-xs">
              No rooms found matching the current search criteria.
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div key={room.id} className="p-4 space-y-3 hover:bg-gold-50/30 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-pine-900 bg-gold-100/80 px-2.5 py-1 rounded-lg border border-gold-300">
                      {room.roomNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-slate-700 border border-stone-200">
                      {room.floor}
                    </span>
                  </div>

                  <select
                    value={room.status}
                    onChange={(e) => handleQuickStatusChange(room.id, e.target.value as any)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none bg-stone-50 ${
                      room.status === 'Available'
                        ? 'text-emerald-800 border-emerald-300 bg-emerald-50/70'
                        : room.status === 'Occupied'
                        ? 'text-purple-800 border-purple-300 bg-purple-50/70'
                        : room.status === 'Reserved'
                        ? 'text-blue-800 border-blue-300 bg-blue-50/70'
                        : 'text-amber-800 border-amber-300 bg-amber-50/70'
                    }`}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{room.name}</span>
                    <span className="font-serif font-bold text-base text-pine-900">
                      ₱{room.price.toLocaleString()}
                      <span className="text-[10px] font-sans font-normal text-slate-500">/{room.ratePeriod}</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    {room.roomType} • <span className="capitalize">{room.category}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                    <Users className="w-3.5 h-3.5 text-pine-700" />
                    <span>Capacity: Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
                  </div>
                </div>

                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {room.amenities.slice(0, 3).map((amenity, aIdx) => (
                      <span key={aIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-slate-600 border border-stone-200">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setEditingRoom(room)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-gold-100 text-slate-700 hover:text-pine-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 border border-stone-200"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-pine-700" />
                    <span>Edit Room</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRoom(room.id)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-stone-200"
                    title="Delete Room"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-pine-950 border-b border-gold-200/80 bg-gold-50/60">
              <tr>
                <th className="py-3.5 px-4 font-bold">Room #</th>
                <th className="py-3.5 px-4 font-bold">Room Name & Type</th>
                <th className="py-3.5 px-4 font-bold">Floor</th>
                <th className="py-3.5 px-4 font-bold">Max Capacity</th>
                <th className="py-3.5 px-4 font-bold">Rate / Night</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100/70">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm font-semibold">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading rooms from database...
                    </div>
                  </td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No physical rooms have been added yet. Click "Add New Room" to start building your inventory.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gold-50/40 transition-colors">
                    
                    <td className="py-3.5 px-4 font-mono font-bold text-pine-900 whitespace-nowrap">
                      {room.roomNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{room.name}</div>
                      <div className="text-[11px] text-slate-500">{room.roomType} • {room.category}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {room.floor}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-pine-700" />
                        <span>Up to {room.capacity} guests</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-serif font-bold text-pine-900 text-sm">
                      ₱{room.price.toLocaleString()}
                      <span className="text-[10px] font-sans font-normal text-slate-500">/{room.ratePeriod}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={room.status}
                        onChange={(e) => handleQuickStatusChange(room.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none bg-stone-50 ${
                          room.status === 'Available'
                            ? 'text-emerald-800 border-emerald-300 bg-emerald-50/70'
                            : room.status === 'Occupied'
                            ? 'text-purple-800 border-purple-300 bg-purple-50/70'
                            : room.status === 'Reserved'
                            ? 'text-blue-800 border-blue-300 bg-blue-50/70'
                            : 'text-amber-800 border-amber-300 bg-amber-50/70'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingRoom(room)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-gold-100 text-slate-700 hover:text-pine-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 border border-stone-200"
                        >
                          <Edit3 className="w-3 h-3 text-pine-700" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-1 rounded-lg bg-stone-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-stone-200"
                          title="Delete Room"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveEdit} className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-slate-900 font-serif">
                Edit Room: {editingRoom.roomNumber}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Room Number</label>
                <input
                  type="text"
                  value={editingRoom.roomNumber}
                  onChange={(e) => setEditingRoom({ ...editingRoom, roomNumber: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Display Title</label>
                <input
                  type="text"
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Capacity (Guests)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editingRoom.capacity}
                  onChange={(e) => setEditingRoom({ ...editingRoom, capacity: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Rate (₱ / night)</label>
                <input
                  type="number"
                  step="100"
                  value={editingRoom.price}
                  onChange={(e) => setEditingRoom({ ...editingRoom, price: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Floor Location</label>
                <input
                  type="text"
                  value={editingRoom.floor}
                  onChange={(e) => setEditingRoom({ ...editingRoom, floor: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Status</label>
                <select
                  value={editingRoom.status}
                  onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Room Details
              </button>
            </div>
          </form>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleCreateRoom} className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-slate-900 font-serif">
                Add Room to Property Inventory
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Room Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 204"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => handleRoomTypeSelect(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  {SAMPLE_ROOMS.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} (Max {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Nightly Rate (₱)</label>
                <input
                  type="number"
                  step="100"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Floor</label>
                <input
                  type="text"
                  placeholder="e.g. 2nd Floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-700 block font-semibold">Amenities (comma-separated)</label>
                <input
                  type="text"
                  placeholder="King Bed, Hot Shower, Wi-Fi, Balcony"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Room
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};