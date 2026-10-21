import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <GlassCard tone="raised">
      <h1 className="text-title">Reset your password</h1>
      <p className="mt-1 text-sm text-muted">
        Enter the email on your account and we&apos;ll send a reset link.
      </p>

      <ForgotPasswordForm />

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-ink underline underline-offset-4">
          Back to login
        </Link>
      </p>
    </GlassCard>
  );
}
