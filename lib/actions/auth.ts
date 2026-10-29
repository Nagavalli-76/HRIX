"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";

export interface AuthActionResult {
  error?: string;
  message?: string;
  success?: boolean;
}

function getSignInErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.code === "email_not_confirmed") {
      return "Please confirm your email address before logging in.";
    }

    if (error.code === "user_banned") {
      return "This account has been disabled. Please contact support.";
    }

    if (error.code === "invalid_credentials" || error.status === 400) {
      return "The email or password is incorrect.";
    }
  }

  return "Unable to sign in right now. Please try again.";
}

/**
 * Signs in a user with email and password using Supabase Auth.
 */
export async function signInAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || null;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error("Supabase client initialization failed during sign-in:", error);
    return { error: "Sign-in is temporarily unavailable. Please check the Supabase configuration." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign-in error:", {
      code: error.code,
      status: error.status,
      message: error.message,
    });
    return { error: getSignInErrorMessage(error) };
  }

  if (!data.user) {
    return { error: "Failed to sign in. Please verify your credentials." };
  }

  // Determine user role to route to appropriate dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  // Never use user-controlled Auth metadata for authorization decisions.
  // The database trigger provisions only creator or brand profiles from signup.
  const role = profile?.role === "brand" || profile?.role === "admin"
    ? profile.role
    : "creator";

  if (redirectTo && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }

  if (role === "admin") {
    redirect("/admin");
  } else if (role === "brand") {
    redirect("/brand/dashboard");
  } else {
    redirect("/creator/dashboard");
  }
}

function getSignUpErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    const msg = error.message?.toLowerCase() || "";

    if (error.code === "user_already_exists" || msg.includes("already registered") || msg.includes("already exists")) {
      return "An account with this email already exists. Please log in instead.";
    }

    if (error.code === "weak_password" || msg.includes("password")) {
      return error.message;
    }

    if (
      error.code === "over_email_send_rate_limit" ||
      error.code === "over_request_rate_limit" ||
      msg.includes("rate limit") ||
      error.status === 429
    ) {
      return "Too many sign-up attempts or email rate limit reached. Please wait a few minutes, or disable 'Confirm email' in Supabase Auth settings to skip email verification.";
    }

    if (
      error.name === "AuthRetryableFetchError" ||
      error.status === 0 ||
      msg.includes("fetch failed") ||
      msg.includes("failed to fetch")
    ) {
      return "Unable to reach the authentication server. The database project may be paused or offline. Please check your Supabase project status.";
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("fetch failed") || msg.includes("enotfound") || msg.includes("failed to fetch")) {
      return "Unable to reach the authentication server. The Supabase project may be paused or offline. Please check your Supabase project status.";
    }
    return error.message;
  }

  return "Unable to complete registration. Please try again.";
}

/**
 * Registers a new user with Supabase Auth, assigning their selected role.
 */
export async function signUpAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const fullName = (formData.get("name") as string)?.trim();
  const role = (formData.get("role") as string) || "creator";

  if (!email || !password || !fullName) {
    return { error: "All fields are required to register." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error("Supabase client initialization failed during sign-up:", error);
    return { error: "Registration is temporarily unavailable. Supabase configuration is missing or invalid." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  let data, error;
  try {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/${role === "brand" ? "brand" : "creator"}/onboarding`,
        data: {
          full_name: fullName,
          role: role === "brand" ? "brand" : "creator",
        },
      },
    });
    data = res.data;
    error = res.error;
  } catch (err) {
    console.error("Unexpected error during sign-up:", err);
    return { error: getSignUpErrorMessage(err) };
  }

  if (error) {
    console.error("Sign-up error:", {
      code: error.code,
      status: error.status,
      message: error.message,
    });
    return { error: getSignUpErrorMessage(error) };
  }

  if (!data?.user) {
    return { error: "Registration could not be completed. Please try again." };
  }

  if (!data.session) {
    return {
      success: true,
      message: "Account created! Please check your email and confirm your address before logging in.",
    };
  }

  // Route to onboarding based on role
  if (role === "brand") {
    redirect("/brand/onboarding");
  } else {
    redirect("/creator/onboarding");
  }
}

/**
 * Sends a password reset email via Supabase Auth.
 */
export async function resetPasswordAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  const supabase = await createClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/update-password`,
  })

  if (error) {
    console.error("Password reset error:", error);
    return { error: "Unable to send the password reset email. Please try again." };
  }

  return { success: true };
}

/**
 * Signs out the current user session and redirects to /login.
 */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Updates the user's password. Only works when the user has an active session
 * (i.e., after clicking the email reset link and going through /auth/callback).
 * If both fields are blank the update is skipped gracefully (useful from the settings form).
 */
export async function updatePasswordAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const passwordEmpty = !password || password.trim() === ''
  const confirmEmpty = !confirmPassword || confirmPassword.trim() === ''

  // Both blank → skip (settings form "save with no password change")
  if (passwordEmpty && confirmEmpty) {
    return { success: true, message: 'No changes made.' }
  }

  // One filled, the other blank → error
  if (passwordEmpty || confirmEmpty) {
    return { error: 'Please fill in both password fields.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('Update password error:', error)
    return { error: 'Unable to update your password. Please try again.' }
  }

  return { success: true, message: 'Your password has been updated successfully.' }
}
