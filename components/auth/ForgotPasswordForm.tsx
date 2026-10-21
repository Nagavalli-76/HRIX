"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { resetPasswordAction } from "@/lib/actions/auth";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);

  if (state?.success) {
    return (
      <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
        Password reset link sent! Check your email inbox for instructions to reset your password.
      </div>
    );
  }

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

      <Input label="Email" type="email" name="email" autoComplete="email" required />
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Sending link..." : "Send reset link"}
      </Button>
    </form>
  );
}
