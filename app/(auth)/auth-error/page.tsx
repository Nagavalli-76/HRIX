import type { Metadata } from 'next'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'

export const metadata: Metadata = { title: 'Authentication Error' }

interface Props {
  searchParams: Promise<{ reason?: string }>
}

const REASON_MESSAGES: Record<string, string> = {
  code_exchange_failed:
    'The confirmation link has already been used or has expired. Please request a new one.',
  token_expired:
    'The link has expired. Confirmation links are valid for up to 1 hour. Please request a new one.',
  invalid_link:
    'The link is malformed or invalid. Please use the link exactly as sent in the email.',
}

export default async function AuthErrorPage({ searchParams }: Props) {
  const { reason } = await searchParams
  const message =
    (reason && REASON_MESSAGES[reason]) ||
    'The link you followed has expired or is no longer valid. This can happen if the link was already used or if it has been more than 1 hour since the email was sent.'

  return (
    <GlassCard tone="raised">
      <h1 className="text-title">Link expired or invalid</h1>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/forgot-password"
          className="inline-flex w-full items-center justify-center rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium text-ink hover:bg-white/[0.15] transition-colors"
        >
          Request a new password reset link
        </Link>
        <Link
          href="/login"
          className="text-center text-sm text-muted underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </GlassCard>
  )
}
