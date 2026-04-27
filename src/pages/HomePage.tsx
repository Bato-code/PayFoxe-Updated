import { TrendingUp, Award, Users, Wallet, CheckSquare, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getLevelInfo } from '../utils/levelSystem'
import BottomNav from '../components/navigation/BottomNav'

const COIN_VALUE_USD = 0.01

export default function HomePage() {
  const { user } = useAuth()
  if (!user) return null

  const levelInfo = getLevelInfo(user.xp || 0)
  const balanceCoins = user.coins || 0
  const balanceUSD = (balanceCoins * COIN_VALUE_USD).toFixed(2)
  const xp = user.xp || 0

  // XP within the current level band
  const xpIntoLevel = xp % levelInfo.xpToNext
  const xpPct = levelInfo.xpToNext > 0 ? Math.min((xpIntoLevel / levelInfo.xpToNext) * 100, 100) : 0

  return (
    <div className="pb-20 md:pb-0">
      <div className="space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome back,</h1>
          <p className="text-3xl text-primary-400 font-bold">{user.username}!</p>
          <p className="text-gray-400 mt-2">Ready to earn more?</p>
        </div>

        {/* Balance Card */}
        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg text-center">
          <Wallet className="mx-auto mb-4 text-primary-500" size={50} />
          <p className="text-5xl font-bold text-gold">{balanceCoins.toLocaleString()}</p>
          <p className="text-xl text-gray-400">Coins Balance</p>
          <p className="text-2xl mt-2 text-green-400">${balanceUSD}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="backdrop-blur-sm rounded-3xl p-5 shadow-glow-lg text-center">
            <TrendingUp className="text-primary-500 mx-auto mb-3" size={36} />
            <p className="text-2xl font-bold">Lvl {levelInfo.level}</p>
            <p className="text-xs text-gray-400">{levelInfo.rank}</p>
          </div>

          <div className="backdrop-blur-sm rounded-3xl p-5 shadow-glow-lg text-center">
            <Award className="text-green-500 mx-auto mb-3" size={36} />
            <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Total XP</p>
          </div>

          <div className="backdrop-blur-sm rounded-3xl p-5 shadow-glow-lg text-center">
            <Users className="text-blue-500 mx-auto mb-3" size={36} />
            <p className="text-2xl font-bold">{user.referral_count ?? 0}</p>
            <p className="text-xs text-gray-400">Referrals</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg">
          <div className="flex justify-between mb-3">
            <span className="font-semibold">Level Progress — {levelInfo.rank}</span>
            <span className="text-sm text-gray-400">
              {xpIntoLevel} / {levelInfo.xpToNext} XP
            </span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 shadow-glow"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-sm text-gray-400">
              {levelInfo.xpToNext - xpIntoLevel} XP to Level {levelInfo.level + 1}
            </p>
            <p className="text-xs text-primary-400 font-semibold">
              {levelInfo.multiplier}x XP multiplier
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/tasks"
              className="flex items-center justify-between p-4 bg-primary-500/10 border border-primary-500/30 rounded-2xl hover:bg-primary-500/20 transition-all"
            >
              <div>
                <CheckSquare className="text-primary-400 mb-1" size={22} />
                <p className="font-semibold text-sm">Earn Coins</p>
                <p className="text-xs text-gray-400">Complete tasks</p>
              </div>
              <ArrowRight size={18} className="text-primary-400" />
            </Link>

            <Link
              to="/referrals"
              className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl hover:bg-yellow-500/20 transition-all"
            >
              <div>
                <Users className="text-yellow-400 mb-1" size={22} />
                <p className="font-semibold text-sm">Refer & Earn</p>
                <p className="text-xs text-gray-400">Invite friends</p>
              </div>
              <ArrowRight size={18} className="text-yellow-400" />
            </Link>

            <Link
              to="/wallet"
              className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-2xl hover:bg-green-500/20 transition-all"
            >
              <div>
                <Wallet className="text-green-400 mb-1" size={22} />
                <p className="font-semibold text-sm">Withdraw</p>
                <p className="text-xs text-gray-400">Cash out coins</p>
              </div>
              <ArrowRight size={18} className="text-green-400" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl hover:bg-blue-500/20 transition-all"
            >
              <div>
                <Award className="text-blue-400 mb-1" size={22} />
                <p className="font-semibold text-sm">Profile</p>
                <p className="text-xs text-gray-400">View stats</p>
              </div>
              <ArrowRight size={18} className="text-blue-400" />
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
