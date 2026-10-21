'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { updatePasswordAction } from '@/lib/actions/auth'

export function UpdatePasswordForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(updatePasswordAction, null)

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => router.push('/login'), 2500)
      return () => clearTimeout(timer)
    }
  }, [state?.success, router])

  if (state?.success) {
    return (
      <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
        {state.message ?? 'Password updated!'} Redirecting you to login…
      </div>
    )
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

      <Input
        label="New password"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        minLength={6}
      />
      <Input
        label="Confirm new password"
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        required
        minLength={6}
      />
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? 'Updating password…' : 'Update password'}
      </Button>
    </form>
  )
}
