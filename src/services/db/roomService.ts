/**
 * ==============================================================================
 * Live Room Inventory Service (Objective 1)
 * ==============================================================================
 * Purpose:
 * 1. Fetches real-time room listings, rates, and capacities from Supabase (`public.rooms`).
 * 2. Falls back seamlessly to baseline room fixtures when Supabase is not yet connected.
 * 3. Allows the database admin to update room rates or add units in Supabase,
 *    instantly reflecting on the website without code changes.
 * ==============================================================================
 */

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SAMPLE_ROOMS } from '../../data/mockData';
import { Room } from '../../types';

/**
 * Fetches all available rooms from Supabase, or returns baseline rooms if offline.
 */
export const fetchRooms = async (): Promise<Room[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('rate', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          name: r.name,
          code: r.code,
          category: r.category,
          capacity: r.capacity,
          capacityLabel: r.capacity_label || `${r.capacity} Pax`,
          rate: Number(r.rate),
          ratePeriod: r.rate_period,
          formattedRate: `₱${Number(r.rate).toLocaleString()}/${r.rate_period}`,
          sampleQuantity: r.total_units || 1,
          description: r.description || '',
          image: r.image_url || '/compact-solo-room.jpg',
          features: Array.isArray(r.features) ? r.features : [],
          sharedAmenities: Array.isArray(r.shared_amenities) ? r.shared_amenities : []
        }));
      }
    } catch (err) {
      console.warn('Notice: Using baseline room fixtures while connecting to Supabase:', err);
    }
  }

  // Graceful fallback to baseline inventory
  return SAMPLE_ROOMS;
};
