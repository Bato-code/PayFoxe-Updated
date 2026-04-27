import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

/**
 * /auth/callback
 *
 * Supabase redirects here after Google / Apple OAuth.
 * We exchange the code for a session, handle the optional
 * referral code, then send the user to /dashboard.
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function handleCallback() {
      try {
        // Exchange the OAuth code for a Supabase session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        )

        if (sessionError) throw sessionError
        if (!data.session) throw new Error('No session returned')

        const userId = data.session.user.id
        const refCode = searchParams.get('ref')

        // Wait briefly for the DB trigger to create the profile
        await new Promise(r => setTimeout(r, 1000))

        // If a referral code was passed, look up the referrer and credit them
        if (refCode) {
          const { data: referrer } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', refCode)
            .maybeSingle()

          if (referrer && referrer.id !== userId) {
            // Increment referrer's count and award bonus coins via RPC
            await supabase.rpc('credit_referral', {
              referrer_id: referrer.id,
              referee_id: userId,
            })
          }
        }

        // Check for ban before letting them in
        const { data: profile } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', userId)
          .maybeSingle()

        if (!cancelled) {
          if (profile?.status === 'banned' || profile?.status === 'suspended') {
            await supabase.auth.signOut()
            setError('Your account has been suspended. Please contact support.')
            return
          }

          navigate('/dashboard', { replace: true })
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err)
        if (!cancelled) {
          setError(err.message || 'Authentication failed. Please try again.')
        }
      }
    }

    handleCallback()
    return () => { cancelled = true }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-purple flex items-center justify-center px-4">
        <div className="max-w-md w-full backdrop-blur-sm rounded-3xl p-8 shadow-glow-lg text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-3">Sign-in Failed</h2>
          <p className="text-red-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary px-8 py-3"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-purple flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🪙</div>
        <p className="text-2xl font-bold text-white animate-pulse">Signing you in…</p>
        <p className="text-gray-400 mt-2 text-sm">Setting up your PayFoxe account</p>
      </div>
    </div>
  )
}
