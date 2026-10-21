import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <GlassCard tone="raised">
      <h1 className="text-title">Log in to HRIX</h1>
      <p className="mt-1 text-sm text-muted">
        Welcome back. Enter your details to continue.
      </p>

      <Suspense fallback={<div className="mt-6 h-48 animate-pulse rounded bg-white/5" />}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-muted">
        New to HRIX?{" "}
        <Link href="/register" className="text-ink underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </GlassCard>
  );
}
