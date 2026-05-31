import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env'

export const supabase =
  env.supabaseUrl && env.supabasePublishableKey
    ? createClient(env.supabaseUrl, env.supabasePublishableKey)
    : null
