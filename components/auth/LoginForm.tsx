"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signInAction } from "@/lib/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const [state, formAction, isPending] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state?.error ? (
        <div
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {state.error}
        </div>
      ) : null}

      <input type="hidden" name="redirect" value={redirectUrl} />

      <Input label="Email" type="email" name="email" autoComplete="email" required />
      <Input
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />

      <div className="flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-blue-soft underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}
