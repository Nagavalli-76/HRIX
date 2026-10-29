import { createClient } from "@/lib/supabase/server";
import { AUTHORIZED_ADMIN_EMAIL } from "@/lib/admin-config";

export type UserRole = "creator" | "brand" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

export function isAuthorizedAdmin(session: SessionUser | null): boolean {
  return isAuthorizedAdminRecord(session?.role, session?.email);
}

export function isAuthorizedAdminRecord(
  role: string | null | undefined,
  email: string | null | undefined,
): boolean {
  return (
    role === "admin" &&
    !!email &&
    email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL
  );
}

/**
 * Returns the currently authenticated user from Supabase Auth & public.profiles.
 * Returns null if the user is unauthenticated or session has expired.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Retrieve user's role and full name from public.profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    const role =
      profile?.role === "admin" || profile?.role === "brand"
        ? profile.role
        : "creator";
    const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

    return {
      id: user.id,
      name,
      role,
      email: user.email,
    };
  } catch (err) {
    // If running in development without live Supabase credentials, return null gracefully
    return null;
  }
}
