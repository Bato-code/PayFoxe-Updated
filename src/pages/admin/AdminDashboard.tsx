import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { 
  CheckCircle, XCircle, Copy, Clock, Users, Coins, 
  TrendingUp, AlertCircle, Search, Edit, Trash2, 
  UserX, Calendar, ShieldCheck, Ban, User, LogOut
} from 'lucide-react'

const COIN_VALUE_USD = 0.01

interface Withdrawal {
  id: string
  amount: number
  account_name: string
  bank: string
  account_number: string
  country: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  processed_at?: string
  profiles: {
    username: string | null
    email: string | null
    coins: number
  } | null
}

interface Profile {
  id: string
  username: string | null
  email: string | null
  coins: number
  level: number
  xp: number
  referral_count: number
  role: string
  banned: boolean
  banned_reason: string | null
  banned_until: string | null
  avatar_url: string | null
}

interface Stats {
  totalUsers: number
  totalCoins: number
  pendingWithdrawals: number
  approvedWithdrawals: number
  bannedUsers: number
  avgCoinsPerUser: number
}

interface BanModalData {
  userId: string
  username: string
  type: 'suspend' | 'ban'
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'withdrawals' | 'users'>('overview')
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCoins: 0,
    pendingWithdrawals: 0,
    approvedWithdrawals: 0,
    bannedUsers: 0,
    avgCoinsPerUser: 0
  })
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Profile>>({})
  const [banModal, setBanModal] = useState<BanModalData | null>(null)
  const [banDuration, setBanDuration] = useState<number>(7)
  const [banReason, setBanReason] = useState('')

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllData()
    }
  }, [user])

  useEffect(() => {
    const filtered = users.filter(u => 
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const fetchAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchWithdrawals(),
      fetchUsers(),
      calculateStats()
    ])
    setLoading(false)
  }

  const fetchWithdrawals = async () => {
    const { data, error } = await supabase.rpc('admin_get_all_withdrawals')

    if (!error && data) {
      // Transform data to match expected structure
      const transformedData = data.map((w: any) => ({
        ...w,
        profiles: {
          username: w.username,
          email: w.email,
          coins: w.user_coins
        }
      }))
      setWithdrawals(transformedData)
    }
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase.rpc('admin_get_all_profiles')

    if (!error) {
      setUsers(data || [])
      setFilteredUsers(data || [])
    }
  }

  const calculateStats = async () => {
    const { data: profiles } = await supabase.from('profiles').select('coins, banned')
    const { data: withdrawalData } = await supabase.from('withdrawals').select('status, amount')

    const totalUsers = profiles?.length || 0
    const totalCoins = profiles?.reduce((sum, p) => sum + (p.coins || 0), 0) || 0
    const bannedUsers = profiles?.filter(p => p.banned).length || 0
    const pendingWithdrawals = withdrawalData?.filter(w => w.status === 'pending').length || 0
    const approvedWithdrawals = withdrawalData?.filter(w => w.status === 'approved').length || 0
    const avgCoinsPerUser = totalUsers > 0 ? totalCoins / totalUsers : 0

    setStats({
      totalUsers,
      totalCoins,
      pendingWithdrawals,
      approvedWithdrawals,
      bannedUsers,
      avgCoinsPerUser
    })
  }

  const updateWithdrawalStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.rpc('admin_update_withdrawal', {
      withdrawal_id: id,
      new_status: status
    })

    if (error) {
      alert('Failed to update withdrawal status')
    } else {
      await fetchAllData()
      alert(`Withdrawal ${status} successfully!`)
    }
  }

  const startEdit = (userId: string, userData: Profile) => {
    setEditingUser(userId)
    setEditForm({
      username: userData.username,
      coins: userData.coins,
      level: userData.level,
      xp: userData.xp,
      role: userData.role
    })
  }

  const saveEdit = async (userId: string) => {
    const { error } = await supabase.rpc('admin_update_profile', {
      target_user_id: userId,
      new_username: editForm.username,
      new_coins: editForm.coins,
      new_level: editForm.level,
      new_xp: editForm.xp,
      new_role: editForm.role
    })

    if (error) {
      alert('Failed to update user')
    } else {
      setEditingUser(null)
      await fetchAllData()
      alert('User updated successfully!')
    }
  }

  const openBanModal = (userId: string, username: string, type: 'suspend' | 'ban') => {
    setBanModal({ userId, username, type })
    setBanReason('')
    setBanDuration(7)
  }

  const executeBanAction = async () => {
    if (!banModal || !banReason.trim()) {
      alert('Please provide a reason')
      return
    }

    const bannedUntil = banModal.type === 'suspend' 
      ? new Date(Date.now() + banDuration * 24 * 60 * 60 * 1000).toISOString()
      : null

    const { error } = await supabase.rpc('admin_update_profile', {
      target_user_id: banModal.userId,
      new_banned: true,
      new_banned_reason: banReason,
      new_banned_until: bannedUntil
    })

    if (error) {
      alert('Failed to ban user')
    } else {
      setBanModal(null)
      await fetchAllData()
      alert(`User ${banModal.type === 'suspend' ? 'suspended' : 'banned'} successfully!`)
    }
  }

  const unbanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to unban this user?')) return

    const { error } = await supabase.rpc('admin_update_profile', {
      target_user_id: userId,
      new_banned: false,
      new_banned_reason: null,
      new_banned_until: null
    })

    if (error) {
      alert('Failed to unban user')
    } else {
      await fetchAllData()
      alert('User unbanned successfully!')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm(`Are you sure you want to permanently delete this user? This action cannot be undone.`)) return

    const { error } = await supabase.rpc('admin_delete_profile', {
      target_user_id: userId
    })

    if (error) {
      alert('Failed to delete user')
    } else {
      await fetchAllData()
      alert('User deleted successfully!')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-24 h-24 text-red-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-300">You do not have permission to access this page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logout */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-purple-300 text-sm mt-1">
              Logged in as: <span className="font-semibold">{user?.email}</span>
            </p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border-2 border-red-500 text-red-300 rounded-xl hover:bg-red-500/30 transition-all font-semibold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
          {['overview', 'withdrawals', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={<Users className="w-8 h-8" />}
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={<Coins className="w-8 h-8" />}
              title="Total Coins"
              value={`${stats.totalCoins.toLocaleString()} ($${(stats.totalCoins * COIN_VALUE_USD).toFixed(2)})`}
              color="yellow"
            />
            <StatCard
              icon={<Clock className="w-8 h-8" />}
              title="Pending Withdrawals"
              value={stats.pendingWithdrawals.toLocaleString()}
              color="yellow"
            />
            <StatCard
              icon={<CheckCircle className="w-8 h-8" />}
              title="Approved Withdrawals"
              value={stats.approvedWithdrawals.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={<Ban className="w-8 h-8" />}
              title="Banned Users"
              value={stats.bannedUsers.toLocaleString()}
              color="red"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Avg Coins/User"
              value={stats.avgCoinsPerUser.toFixed(2)}
              color="purple"
            />
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Withdrawal Requests ({withdrawals.length})
            </h2>

            {loading ? (
              <p className="text-center text-gray-300">Loading...</p>
            ) : withdrawals.length === 0 ? (
              <p className="text-center text-gray-400">No withdrawal requests</p>
            ) : (
              <div className="space-y-4">
                {withdrawals.map(w => (
                  <div
                    key={w.id}
                    className={`p-6 rounded-2xl border-2 bg-white/5 ${
                      w.status === 'pending'
                        ? 'border-yellow-500'
                        : w.status === 'approved'
                        ? 'border-green-500'
                        : 'border-red-500'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">User</p>
                        <p className="text-white font-medium">
                          {w.profiles?.username || w.profiles?.email || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Amount</p>
                        <p className="text-white font-medium">
                          {w.amount} coins
                          <span className="text-green-400 text-sm block">
                            ${(w.amount * COIN_VALUE_USD).toFixed(2)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Account</p>
                        <p className="text-white">{w.account_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Bank</p>
                        <p className="text-white">{w.bank}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Country</p>
                        <p className="text-white">{w.country}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Account Number</p>
                        <button
                          onClick={() => copyToClipboard(w.account_number)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                          {w.account_number} <Copy size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {w.status === 'pending' ? (
                          <Clock className="text-yellow-400" />
                        ) : w.status === 'approved' ? (
                          <CheckCircle className="text-green-400" />
                        ) : (
                          <XCircle className="text-red-400" />
                        )}
                        <span className="font-bold text-white">
                          {w.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
                      <span>Requested: {formatDate(w.created_at)}</span>
                      {w.processed_at && (
                        <span className="ml-4">Processed: {formatDate(w.processed_at)}</span>
                      )}
                    </div>

                    {w.status === 'pending' && (
                      <div className="mt-4 flex gap-4 justify-end">
                        <button
                          onClick={() => updateWithdrawalStatus(w.id, 'approved')}
                          className="px-6 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateWithdrawalStatus(w.id, 'rejected')}
                          className="px-6 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">
                User Management ({filteredUsers.length})
              </h2>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {loading ? (
              <p className="text-center text-gray-300">Loading...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-gray-400">No users found</p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map(u => (
                  <div
                    key={u.id}
                    className={`p-6 rounded-2xl border-2 bg-white/5 ${
                      u.banned ? 'border-red-500' : 'border-white/20'
                    }`}
                  >
                    {editingUser === u.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          <input
                            type="text"
                            value={editForm.username || ''}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            placeholder="Username"
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                          <input
                            type="number"
                            value={editForm.coins || 0}
                            onChange={(e) => setEditForm({ ...editForm, coins: parseInt(e.target.value) })}
                            placeholder="Coins"
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                          <input
                            type="number"
                            value={editForm.level || 1}
                            onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) })}
                            placeholder="Level"
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                          <input
                            type="number"
                            value={editForm.xp || 0}
                            onChange={(e) => setEditForm({ ...editForm, xp: parseInt(e.target.value) })}
                            placeholder="XP"
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                          <select
                            value={editForm.role || 'user'}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => saveEdit(u.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                              {u.avatar_url ? (
                                <img src={u.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <User />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-white">
                                  {u.username || 'No Username'}
                                </h3>
                                {u.role === 'admin' && (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-500 text-purple-300 rounded text-xs">
                                    <ShieldCheck size={14} /> Admin
                                  </span>
                                )}
                                {u.banned && (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500 text-red-300 rounded text-xs">
                                    <Ban size={14} /> Banned
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm break-all">{u.email}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                <div>
                                  <p className="text-gray-400 text-xs">Coins</p>
                                  <p className="text-white font-semibold">{u.coins}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs">Level</p>
                                  <p className="text-white font-semibold">{u.level}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs">XP</p>
                                  <p className="text-white font-semibold">{u.xp}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs">Referrals</p>
                                  <p className="text-white font-semibold">{u.referral_count}</p>
                                </div>
                              </div>
                              {u.banned && (
                                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                  <p className="text-red-300 text-sm">
                                    <strong>Ban Reason:</strong> {u.banned_reason || 'No reason provided'}
                                  </p>
                                  {u.banned_until && (
                                    <p className="text-red-300 text-sm mt-1">
                                      <strong>Expires:</strong> {formatDate(u.banned_until)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-4">
                            {u.banned ? (
                              <button
                                onClick={() => unbanUser(u.id)}
                                className="p-2 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30"
                                title="Unban"
                              >
                                <CheckCircle size={20} />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => openBanModal(u.id, u.username || u.email || 'User', 'suspend')}
                                  className="p-2 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
                                  title="Suspend"
                                >
                                  <Calendar size={20} />
                                </button>
                                <button
                                  onClick={() => openBanModal(u.id, u.username || u.email || 'User', 'ban')}
                                  className="p-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30"
                                  title="Ban"
                                >
                                  <UserX size={20} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => startEdit(u.id, u)}
                              className="p-2 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/30"
                              title="Edit"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ban/Suspend Modal */}
      {banModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full border-2 border-purple-500 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              {banModal.type === 'suspend' ? 'Suspend User' : 'Ban User'}
            </h2>
            <p className="text-gray-300 mb-6">
              {banModal.type === 'suspend' 
                ? `Temporarily suspend ${banModal.username}`
                : `Permanently ban ${banModal.username}`
              }
            </p>

            {banModal.type === 'suspend' && (
              <div className="mb-4">
                <label className="block text-white mb-2 font-semibold">Duration</label>
                <select
                  value={banDuration}
                  onChange={(e) => setBanDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value={1}>1 Day</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Reason *</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter the reason for this action..."
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={executeBanAction}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  banModal.type === 'suspend'
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-red-500 hover:bg-red-600'
                } text-white transition-colors`}
              >
                Confirm {banModal.type === 'suspend' ? 'Suspend' : 'Ban'}
              </button>
              <button
                onClick={() => setBanModal(null)}
                className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  color: 'blue' | 'yellow' | 'green' | 'red' | 'purple'
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 border-blue-400',
    yellow: 'from-yellow-500 to-yellow-600 border-yellow-400',
    green: 'from-green-500 to-green-600 border-green-400',
    red: 'from-red-500 to-red-600 border-red-400',
    purple: 'from-purple-500 to-purple-600 border-purple-400'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border-2 shadow-xl`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-xl">
          {icon}
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}
