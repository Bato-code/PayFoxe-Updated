import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Gift } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const refCode = searchParams.get('ref')

  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState('')
  const { signUp, signInWithGoogle, signInWithApple } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signUp(formData.email, formData.password, formData.username, refCode || undefined)
      navigate('/login?registered=1')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setOauthLoading('google')
    setError('')
    try {
      await signInWithGoogle(refCode || undefined)
      // Redirects away — no navigate needed
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed. Please try again.')
      setOauthLoading(null)
    }
  }

  const handleApple = async () => {
    setOauthLoading('apple')
    setError('')
    try {
      await signInWithApple(refCode || undefined)
    } catch (err: any) {
      setError(err.message || 'Apple sign-up failed. Please try again.')
      setOauthLoading(null)
    }
  }

  const isAnyLoading = loading || oauthLoading !== null

  return (
    <div className="min-h-screen bg-gradient-purple flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="backdrop-blur-sm rounded-3xl p-8 shadow-glow-lg">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-black flex items-center justify-center font-black text-gold text-sm">P</div>
            <span className="text-xl font-black tracking-tight">Pay<span className="text-primary-400">Foxe</span></span>
          </div>
          <h2 className="text-2xl font-bold mb-1 text-center">Create Account</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Start earning real Naira today</p>

          {refCode && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-sm text-center flex items-center justify-center gap-2">
              <Gift size={16} />
              You're signing up with a referral — bonus coins incoming!
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGoogle}
              disabled={isAnyLoading}
              className="flex items-center justify-center gap-2 py-3 bg-white text-gray-800 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {oauthLoading === 'google' ? (
                <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                  <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.1 81.1-197.2z" fill="#4285f4"/>
                  <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.7H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853"/>
                  <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.7 0 244.6l90.4-70.3z" fill="#fbbc05"/>
                  <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7 0 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.8 81.8-112.4 152.8-112.4z" fill="#ea4335"/>
                </svg>
              )}
              Google
            </button>

            <button
              onClick={handleApple}
              disabled={isAnyLoading}
              className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {oauthLoading === 'apple' ? (
                <span className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17.56 2.23 12.81 4.42 8.57c1.11-.95 2.46-1.52 3.88-1.54 1.41 0 2.3.77 3.49.77.38 0 1.75-.76 3.02-.76 1.03 0 2.11.81 2.88 1.82-2.58 1.58-2.16 4.65.42 6.97-.55 1.66-1.43 3.32-2.1 4.27zM13.98 4.5c-.64.88-1.51 1.56-2.39 1.51.03-.79.63-1.64 1.36-2.27.76-.63 1.72-1.12 2.65-1.12-.03.79-.62 1.64-1.62 2.38z"/>
                </svg>
              )}
              Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-transparent text-gray-500">or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" name="username" value={formData.username} onChange={handleChange}
                  className="input-field pl-10" placeholder="payfoxe_user" required disabled={isAnyLoading} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="input-field pl-10" placeholder="you@example.com" required disabled={isAnyLoading} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} className="input-field pl-10 pr-12" placeholder="Min. 6 characters"
                  required disabled={isAnyLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} className="input-field pl-10 pr-12" placeholder="••••••••"
                  required disabled={isAnyLoading} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isAnyLoading}
              className="btn-primary w-full py-4 text-lg shadow-glow disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
