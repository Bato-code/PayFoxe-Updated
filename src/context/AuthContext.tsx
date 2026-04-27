import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
  username: string
  coins: number
  level: number
  xp: number
  role: string
  status?: string
  referral_code?: string
  referral_count?: number
  avatar_url?: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, refCode?: string) => Promise<void>
  signInWithGoogle: (refCode?: string) => Promise<void>
  signInWithApple: (refCode?: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchingRef = useRef(false)
  const initializedRef = useRef(false)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          await fetchUserProfile(session.user.id)
        } else {
          if (mounted) setLoading(false)
        }
        initializedRef.current = true
      } catch (error) {
        console.error('Init auth error:', error)
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && !initializedRef.current) return

      if (session?.user && mounted) {
        await fetchUserProfile(session.user.id)
      } else if (mounted && !session) {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function fetchUserProfile(userId: string) {
    if (fetchingRef.current) return
    fetchingRef.current = true

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        if (error.code === '42P17' || error.code === '42501') {
          await supabase.auth.signOut()
          setUser(null)
        }
        setLoading(false)
        return
      }

      if (!data) {
        // Profile may not exist yet for brand-new OAuth users — wait briefly and retry once
        await new Promise(r => setTimeout(r, 1500))
        const { data: retryData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (!retryData) {
          setLoading(false)
          return
        }

        return await _applyProfile(retryData, userId)
      }

      await _applyProfile(data, userId)
    } catch (error: any) {
      setLoading(false)
      if (error.code === '42P17' || error.code === '42501') {
        await supabase.auth.signOut()
        setUser(null)
      }
    } finally {
      fetchingRef.current = false
    }
  }

  async function _applyProfile(data: any, userId: string) {
    // Ban enforcement
    if (data.status === 'banned' || data.status === 'suspended') {
      await supabase.auth.signOut()
      setUser(null)
      setLoading(false)
      return
    }

    const { data: { user: authUser } } = await supabase.auth.getUser()

    setUser({
      id: data.id,
      email: authUser?.email || '',
      username: data.username || '',
      coins: data.coins || 0,
      level: data.level || 1,
      xp: data.xp || 0,
      role: data.role || 'user',
      status: data.status || 'active',
      referral_code: data.referral_code,
      referral_count: data.referral_count || 0,
      avatar_url: data.avatar_url || null,
    })

    setLoading(false)
  }

  async function refreshUser() {
    fetchingRef.current = false
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) await fetchUserProfile(authUser.id)
  }

  async function signIn(email: string, password: string) {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // Check ban immediately after sign-in
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', authUser.id)
          .single()

        if (profile?.status === 'banned' || profile?.status === 'suspended') {
          await supabase.auth.signOut()
          setLoading(false)
          throw new Error('Your account has been suspended. Please contact support.')
        }
      }
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  async function signUp(email: string, password: string, username: string, refCode?: string) {
    setLoading(true)
    try {
      const metadata: any = { username }
      if (refCode) metadata.ref = refCode

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (error) throw error
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  async function signInWithGoogle(refCode?: string) {
    const redirectTo = `${window.location.origin}/auth/callback${refCode ? `?ref=${refCode}` : ''}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) throw error
  }

  async function signInWithApple(refCode?: string) {
    const redirectTo = `${window.location.origin}/auth/callback${refCode ? `?ref=${refCode}` : ''}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo },
    })
    if (error) throw error
  }

  async function signOut() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      initializedRef.current = false
    } catch (error: any) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signInWithApple, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
