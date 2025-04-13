import { createClient } from '@supabase/supabase-js';

// Always use the complete URL value directly in client-side code
const supabaseUrl = 'https://zevxyvzpkatnumcnmxzn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpldnh5dnpwa2F0bnVtY25teHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDc4NjEsImV4cCI6MjA2MDAyMzg2MX0.G12lxYbAFejG1cRrVuaHufKa5YOs59ojvvyAr9zn8N0';

// Check that we have values for our client
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

// Create a single supabase client for interacting with the database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
}); 