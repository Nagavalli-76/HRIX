import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function redirectToPath(request: NextRequest, path: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || request.nextUrl.host;
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto || request.nextUrl.protocol.replace(":", "");

  return NextResponse.redirect(new URL(path, `${protocol}://${host}`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabaseResponse, user, role } = await updateSession(request);

  // If Supabase is not configured yet (local dev placeholder mode without live connection),
  // let developers preview the pages without a blocking redirect loop.
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

  if (!isConfigured) {
    return supabaseResponse;
  }

  const isCreatorRoute = pathname === "/creator" || pathname.startsWith("/creator/");
  const isBrandRoute = pathname === "/brand" || pathname.startsWith("/brand/");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/update-password") ||
    pathname.startsWith("/auth-error") ||
    pathname.startsWith("/auth/callback");

  const isPasswordUpdateRoute = pathname.startsWith("/update-password");

  // 1. Unauthenticated users trying to access protected dashboards
  if ((isCreatorRoute || isBrandRoute || isAdminRoute) && !user) {
    const redirectUrl = new URLSearchParams({ redirect: pathname });
    return redirectToPath(request, `/login?${redirectUrl.toString()}`);
  }

  // 2. Authenticated users trying to access login/register pages (but not update-password)
  if (isAuthRoute && user && !isPasswordUpdateRoute) {
    if (role === "admin") {
      return redirectToPath(request, "/admin");
    } else if (role === "brand") {
      return redirectToPath(request, "/brand/dashboard");
    } else {
      return redirectToPath(request, "/creator/dashboard");
    }
  }

  // 3. Role-based route enforcement
  if (user && role) {
    // Creator trying to access Brand route
    if (isBrandRoute && role === "creator") {
      return redirectToPath(request, "/creator/dashboard");
    }

    // Brand trying to access Creator route
    if (isCreatorRoute && role === "brand") {
      return redirectToPath(request, "/brand/dashboard");
    }

    // Non-admin trying to access Admin route
    if (isAdminRoute && role !== "admin") {
      const targetDashboard = role === "brand" ? "/brand/dashboard" : "/creator/dashboard";
      return redirectToPath(request, targetDashboard);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
