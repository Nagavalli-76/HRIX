import type { Metadata } from 'next'
import { GlassCard } from '@/components/ui/GlassCard'
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm'

export const metadata: Metadata = { title: 'Set New Password' }

export default function UpdatePasswordPage() {
  return (
    <GlassCard tone="raised">
      <h1 className="text-title">Set a new password</h1>
      <p className="mt-1 text-sm text-muted">
        Choose a strong password for your account.
      </p>
      <UpdatePasswordForm />
    </GlassCard>
  )
}
