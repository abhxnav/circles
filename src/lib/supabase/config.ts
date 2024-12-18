import { envConfig } from '@/lib/envConfig'
import { createClient } from '@supabase/supabase-js'

const {
  supabase: { supabaseProjectUrl, supabasePublicKey },
} = envConfig

export const supabase = createClient(supabaseProjectUrl, supabasePublicKey)
