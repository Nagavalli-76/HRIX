'use client'

import { useActionState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { updatePasswordAction } from '@/lib/actions/auth'

export function AccountSettingsForm({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, null)

  return (
    <GlassCard tone="raised" className="mt-8 max-w-xl space-y-5">
      <h2 className="text-title">Account</h2>

      {state?.error ? (
        <div
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {state.error}
        </div>
      ) : null}

      {state?.success ? (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          {state.message ?? 'Changes saved successfully!'}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-muted mb-1">Email</label>
        <p className="rounded-md border border-line bg-surface/40 px-3 py-2.5 text-sm text-ink">
          {email || '—'}
        </p>
        <p className="mt-1 text-xs text-faint">Email cannot be changed here. Contact support if needed.</p>
      </div>

      <form action={formAction} className="space-y-4">
        <Input
          label="New password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Leave blank to keep current"
        />
        <Input
          label="Confirm new password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat new password"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
