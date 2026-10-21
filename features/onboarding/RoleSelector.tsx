"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Megaphone, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { signUpAction } from "@/lib/actions/auth";

type Role = "creator" | "brand";

const ROLE_COPY: Record<Role, { title: string; body: string; cta: string }> = {
  creator: {
    title: "Join as a creator",
    body: "Build a profile, discover campaigns and get paid for your work.",
    cta: "Continue to creator onboarding",
  },
  brand: {
    title: "Join as a brand",
    body: "Launch campaigns and find creators who fit your audience.",
    cta: "Continue to brand onboarding",
  },
};

export function RoleSelector({ initialRole }: { initialRole?: Role }) {
  const [role, setRole] = useState<Role | undefined>(initialRole);
  const [state, formAction, isPending] = useActionState(signUpAction, null);

  return (
    <GlassCard tone="raised">
      <h1 className="text-title">Join HRIX</h1>
      <p className="mt-1 text-sm text-muted">Choose how you&apos;ll use HRIX.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <RoleOption
          active={role === "creator"}
          icon={<Sparkles className="h-5 w-5" aria-hidden />}
          label="Creator"
          onClick={() => setRole("creator")}
        />
        <RoleOption
          active={role === "brand"}
          icon={<Megaphone className="h-5 w-5" aria-hidden />}
          label="Brand"
          onClick={() => setRole("brand")}
        />
      </div>

      {role ? (
        <div className="mt-6 space-y-4 border-t border-line pt-6">
          <p className="text-sm text-muted">{ROLE_COPY[role].body}</p>

          {state?.error ? (
            <div
              role="alert"
              className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {state.error}
            </div>
          ) : null}
          {state?.message ? (
            <div
              role="status"
              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"
            >
              {state.message}
            </div>
          ) : null}

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="role" value={role} />
            <Input label="Full name" name="name" autoComplete="name" required />
            <Input label="Email" type="email" name="email" autoComplete="email" required />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Creating account..." : ROLE_COPY[role].cta}
            </Button>
          </form>
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-ink underline underline-offset-4">
          Log in
        </Link>
      </p>
    </GlassCard>
  );
}

function RoleOption({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-2 rounded-md border px-4 py-5 text-sm font-medium transition-colors",
        active
          ? "border-violet bg-violet/10 text-ink"
          : "border-line-strong text-muted hover:bg-white/5",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
