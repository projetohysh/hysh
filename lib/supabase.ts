import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xcyfpqqffnbudylygxqv.supabase.co'
const supabasePublishableKey = 'sb_publishable_wg9GXDNojHygxQLdfslJTg_9HAGnwIp'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})