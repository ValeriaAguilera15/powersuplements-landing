import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ledstnkvvyikwzrpvwqp.supabase.co';
const supabaseAnonKey = 'sb_publishable_2iA9nTQo83crjgEh9DDnDQ_19hk3dDj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);