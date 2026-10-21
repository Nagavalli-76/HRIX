import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'signup' | 'recovery' | 'email' | 'invite' | null
  const next = searchParams.get('next') ?? '/'

  // Helper: build the correct redirect URL respecting proxied host (Vercel)
  function buildRedirect(path: string) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    if (isLocalEnv || !forwardedHost) {
      return NextResponse.redirect(`${origin}${path}`)
    }
    return NextResponse.redirect(`https://${forwardedHost}${path}`)
  }

  // PKCE flow: authorization code exchange (default for @supabase/ssr)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return buildRedirect(next)
    }
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return buildRedirect('/auth-error?reason=code_exchange_failed')
  }

  // Token hash flow: email confirmation OTP (older/alternative flow)
  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) {
      return buildRedirect(next)
    }
    console.error('[auth/callback] verifyOtp error:', error.message)
    return buildRedirect('/auth-error?reason=token_expired')
  }

  // No valid params — link is malformed or already used
  return buildRedirect('/auth-error?reason=invalid_link')
}
