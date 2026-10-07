// Live calendar and reservation service for Supabase and double booking checks
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { UserReservation } from '../../types/auth';

export interface RoomAvailabilityQuery {
  roomId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
}

export interface AvailabilityResult {
  isAvailable: boolean;
  conflictingReservationsCount: number;
  message: string;
}

// Helper to check if two date ranges overlap
export const doDateRangesOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean => {
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();

  return aStart < bEnd && aEnd > bStart;
};

// Check room availability in Supabase or local storage
export const checkRoomAvailability = async (
  query: RoomAvailabilityQuery
): Promise<AvailabilityResult> => {
  const { roomId, checkInDate, checkOutDate } = query;

  if (isSupabaseConfigured()) {
    try {
      // Query Supabase for active overlapping reservations
      const { data, error } = await supabase
        .from('reservations')
        .select('id, check_in_date, check_out_date, status')
        .eq('room_id', roomId)
        .in('status', ['Confirmed', 'Checked In', 'Pending Review'])
        .lt('check_in_date', checkOutDate)
        .gt('check_out_date', checkInDate);

      if (error) {
        console.warn('Supabase availability query warning, using local state:', error.message);
      } else if (data && data.length > 0) {
        return {
          isAvailable: false,
          conflictingReservationsCount: data.length,
          message: 'The selected dates are already booked for this room.'
        };
      } else {
        return {
          isAvailable: true,
          conflictingReservationsCount: 0,
          message: 'Dates are available for booking.'
        };
      }
    } catch (err) {
      console.warn('Network error checking Supabase availability:', err);
    }
  }

  // Fallback: Validate against active session storage records
  const localReservations = getLocalReservations();
  const conflicts = localReservations.filter((res) => {
    if (res.status === 'Cancelled') return false;
    // Map room names or ids
    return doDateRangesOverlap(res.checkInDate, res.checkOutDate, checkInDate, checkOutDate);
  });

  return {
    isAvailable: conflicts.length === 0,
    conflictingReservationsCount: conflicts.length,
    message: conflicts.length === 0 
      ? 'Dates are available for booking.' 
      : 'Selected dates conflict with an existing reservation.'
  };
};

// Create and submit reservation request
export const createReservationRequest = async (
  reservation: UserReservation
): Promise<{ success: boolean; data?: UserReservation; error?: string }> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([
          {
            reservation_code: reservation.reservationCode,
            room_id: reservation.roomName.toLowerCase().replace(/\s+/g, '-'),
            guest_name: reservation.fullName,
            guest_email: reservation.email,
            guest_phone: reservation.contactNumber,
            stay_type: reservation.roomCategory,
            check_in_date: reservation.checkInDate,
            check_out_date: reservation.checkOutDate,
            number_of_guests: reservation.numberOfGuests,
            rate_applied: reservation.rate,
            total_price: reservation.rate,
            special_requests: reservation.specialRequests || '',
            status: reservation.status
          }
        ])
        .select()
        .single();

      if (error) {
        console.warn('Supabase reservation creation error:', error.message);
      } else if (data) {
        saveLocalReservation(reservation);
        return { success: true, data: reservation };
      }
    } catch (err: any) {
      console.warn('Supabase connection failed, using local persistence:', err?.message);
    }
  }

  // Local persistence fallback
  saveLocalReservation(reservation);
  return { success: true, data: reservation };
};

// Subscribe to live calendar changes in Supabase
export const subscribeToLiveCalendar = (
  onUpdate: (payload: any) => void
): (() => void) => {
  if (!isSupabaseConfigured()) {
    return () => {};
  }

  const channel = supabase
    .channel('live-calendar-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'reservations' },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Local storage helpers for reservations
const RESERVATIONS_STORAGE_KEY = 'dragon_treasure_reservations';

export const getLocalReservations = (): UserReservation[] => {
  try {
    const data = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveLocalReservation = (reservation: UserReservation): void => {
  try {
    const existing = getLocalReservations();
    const updated = [reservation, ...existing.filter(r => r.id !== reservation.id)];
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save reservation locally', e);
  }
};
