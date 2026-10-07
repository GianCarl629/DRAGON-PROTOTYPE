/**
 * Supabase Client Configuration for Dragon Treasure Real Estate & Condotel Platform
 * 
 * Purpose:
 * Initializes and exports the Supabase client instance using environment variables:
 * - VITE_SUPABASE_URL: Project URL from Supabase dashboard
 * - VITE_SUPABASE_ANON_KEY: Public anonymous API key
 * 
 * Provides fallback handling so the application operates seamlessly both when
 * connected to Supabase and during local offline execution.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite environment
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Returns true if both Supabase URL and Anon Key are configured in the environment.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    !supabaseUrl.includes('placeholder')
  );
};

/**
 * Singleton Supabase client instance.
 * When environment variables are missing, a fallback client is created
 * so importing components don't crash, while `isSupabaseConfigured()` signals
 * whether real database queries can be executed.
 */
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-anon-key',
      {
        auth: {
          persistSession: false,
        },
      }
    );

export default supabase;
