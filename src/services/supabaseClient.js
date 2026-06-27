import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey && !url.includes("your-project"));

export const supabase = supabaseEnabled ? createClient(url, anonKey) : null;
