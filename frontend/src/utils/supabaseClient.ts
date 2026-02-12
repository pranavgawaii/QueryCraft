import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

// Log warning if using placeholder values
if (supabaseUrl.includes("placeholder") || supabaseAnonKey.includes("placeholder")) {
  console.warn("⚠️ QueryCraft is running in demo mode. Some features may not work without proper Supabase configuration.");
}

// Create client even with placeholder values for demo purposes
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Export a function to check if the client is properly configured
export const isSupabaseConfigured = () => {
  return !supabaseUrl.includes("placeholder") && !supabaseAnonKey.includes("placeholder");
};
