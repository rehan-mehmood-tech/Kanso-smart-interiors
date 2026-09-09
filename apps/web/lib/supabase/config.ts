/**
 * Supabase environment wiring.
 *
 * No Supabase project exists yet, so every consumer has to cope with the
 * credentials being absent. `isSupabaseConfigured` lets the UI say so plainly
 * instead of throwing an opaque runtime error, and lets the proxy fail closed.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Where an unauthenticated visitor to a /pro route is sent. */
export const VENDOR_LOGIN_PATH = "/pro/login";
export const VENDOR_HOME_PATH = "/pro/dashboard";
