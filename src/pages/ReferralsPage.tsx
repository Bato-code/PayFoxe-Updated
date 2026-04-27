import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Users, Share2, Copy, Gift } from 'lucide-react'

const REFERRAL_BONUS = 25 // coins for successful referral

export default function ReferralsPage() {
  const { user } = useAuth()
  const [referralLink, setReferralLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (user?.referral_code) {
      // Fixed: Added opening parenthesis
      setReferralLink(`${window.location.origin}/register?ref=${user.referral_code}`)
    }
  }, [user])

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me and earn coins!',
        text: `Sign up using my referral link and earn ${REFERRAL_BONUS.toLocaleString()} coins!`,
        url: referralLink
      })
    } else {
      copyLink()
    }
  }

  if (!user) return null

  return (
    <div className="pb-20 md:pb-0">
      <div className="space-y-8 p-4">
        <h1 className="text-3xl font-bold text-center">Refer & Earn</h1>

        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg text-center">
          <Gift className="mx-auto mb-4 text-primary-500" size={60} />
          <p className="text-2xl font-bold">Earn {REFERRAL_BONUS.toLocaleString()} coins</p>
          <p className="text-gray-400 mt-2">For every friend who signs up with your link</p>
        </div>

        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg">
          <h2 className="text-xl font-bold mb-4">Your Referral Link</h2>
          
          {user.referral_code ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="input-field flex-1"
                />
                <button
                  onClick={copyLink}
                  className="btn-primary px-6 py-3 flex items-center gap-2"
                >
                  <Copy size={20} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
                <p className="text-3xl font-bold text-primary-500">{user.referral_code}</p>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400">Loading your referral code...</p>
          )}
        </div>

        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg text-center">
          <Users className="mx-auto mb-4 text-primary-500" size={50} />
          <p className="text-4xl font-bold text-gold">{user.referral_count || 0}</p>
          <p className="text-xl text-gray-400">Successful Referrals</p>
          <p className="text-lg mt-2 text-green-400">
            {((user.referral_count || 0) * REFERRAL_BONUS).toLocaleString()} coins earned
          </p>
        </div>

        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg">
          <h2 className="text-xl font-bold mb-4">How it works</h2>
          <ol className="space-y-3 text-gray-300">
            <li>1. Share your unique referral link with friends</li>
            <li>2. They sign up using your link</li>
            <li>3. You get {REFERRAL_BONUS.toLocaleString()} coins instantly!</li>
            <li>4. They get started earning too</li>
          </ol>
        </div>

        <button
          onClick={shareLink}
          className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
        >
          <Share2 size={24} />
          Share Referral Link
        </button>
      </div>
    </div>
  )
}