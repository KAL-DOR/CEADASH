import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types'

// Direct Supabase client for demo mode - bypasses SSR helpers
export function createDemoClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-demo-mode': 'true',
      },
    },
  })
}

export const demoSupabase = createDemoClient()

