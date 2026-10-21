import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service Role Supabase Client.
 *
 * CAUTION:
 * This client bypasses Row Level Security (RLS).
 * MUST ONLY be called in server environments for privileged operations
 * (e.g. initial admin setup, webhooks, background audit logging).
 * NEVER expose or call this client on the client-side/browser.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient must never be called on the client side.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin configuration is missing.");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
