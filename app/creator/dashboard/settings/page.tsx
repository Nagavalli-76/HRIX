import type { Metadata } from 'next'
import { AccountSettingsForm } from '@/components/dashboard/AccountSettingsForm'
import { getSession } from '@/lib/api/auth'

export const metadata: Metadata = { title: 'Settings' }

export default async function CreatorSettingsPage() {
  const session = await getSession()
  return (
    <div>
      <h1 className="text-headline">Settings</h1>
      <p className="mt-2 text-muted">Manage your account and notification preferences.</p>
      <AccountSettingsForm email={session?.email ?? ''} />
    </div>
  )
}
