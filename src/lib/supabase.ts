// Supabase client setup and connection helper
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project live Supabase instance defaults (ensures deployed site connects even if Vercel env vars aren't set)
const DEFAULT_SUPABASE_URL = 'https://jhsxsspyuogepwusjdyj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoc3hzc3B5dW9nZXB3dXNqZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzk0ODYsImV4cCI6MjEwNjk1NTQ4Nn0.box7ptlN3xano1B2Nq7Ff9kXo_q-f3YxvNfb6l2oH4o';

// Get credentials from environment with fallback to live project instance
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl: string = (envUrl && !envUrl.includes('placeholder') && envUrl !== 'https://your-project-id.supabase.co')
  ? envUrl
  : DEFAULT_SUPABASE_URL;

const supabaseAnonKey: string = (envKey && !envKey.includes('placeholder'))
  ? envKey
  : DEFAULT_SUPABASE_ANON_KEY;

// Check if Supabase credentials are configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    !supabaseUrl.includes('placeholder')
  );
};

// Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
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
});

export default supabase;

