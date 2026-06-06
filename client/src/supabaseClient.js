import { createClient } from '@supabase/supabase-js';

// Leemos las credenciales de forma segura desde el archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creamos e exportamos el cliente de Supabase optimizado para producción
export const supabase = createClient(supabaseUrl, supabaseAnonKey);