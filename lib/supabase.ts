import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xcyfpqqffnbudylygxqv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjeWZwcXFmZm5idWR5bHlneHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDMwMTIsImV4cCI6MjA3MTg3OTAxMn0.cH2o163yO3uwqLoVI4ZwBBTlGpj8XgT18CpVb8fovc8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});