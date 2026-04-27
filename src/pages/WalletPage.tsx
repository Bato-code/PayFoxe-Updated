import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Wallet, ArrowDownToLine, Clock, CheckCircle, XCircle } from 'lucide-react'

const MIN_WITHDRAW_COINS = 500
const COIN_VALUE_USD = 0.01 // 100 coins = $1

// Define withdrawal type for type safety
interface Withdrawal {
  id: string
  amount: number
  account_name: string
  bank: string
  account_number: string
  country: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function WalletPage() {
  const { user } = useAuth()
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [showModal, setShowModal] = useState(false)
  const [amountCoins, setAmountCoins] = useState('')
  const [form, setForm] = useState({
    accountName: '',
    bank: '',
    accountNumber: '',
    country: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      fetchWithdrawals()
    }
  }, [user])

  const fetchWithdrawals = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching withdrawals:', error)
    } else {
      setWithdrawals(data || [])
    }
  }

  if (!user) return null

  const balanceCoins = user.coins || 0
  const balanceUSD = (balanceCoins * COIN_VALUE_USD).toFixed(2)
  const canWithdraw = balanceCoins >= MIN_WITHDRAW_COINS

  const handleSubmit = async () => {
    const coins = parseInt(amountCoins || '0', 10)
    
    if (isNaN(coins) || coins < MIN_WITHDRAW_COINS || coins > balanceCoins) {
      setMessage('Invalid amount: must be between 500 and your balance')
      return
    }
    
    if (!form.accountName.trim() || !form.bank.trim() || !form.accountNumber.trim() || !form.country.trim()) {
      setMessage('All fields are required')
      return
    }
    
    if (form.accountNumber.length < 10) {
      setMessage('Account number must be at least 10 digits')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('withdrawals').insert({
      user_id: user.id,
      amount: coins,
      account_name: form.accountName.trim(),
      bank: form.bank.trim(),
      account_number: form.accountNumber.trim(),
      country: form.country.trim(),
      status: 'pending'
    })

    if (error) {
      console.error('Withdrawal submit error:', error)
      setMessage(`Failed to submit: ${error.message}`)
    } else {
      setMessage('Withdrawal request submitted! Awaiting admin approval.')
      setShowModal(false)
      setAmountCoins('')
      setForm({ accountName: '', bank: '', accountNumber: '', country: '' })
      fetchWithdrawals()
    }
    
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': 
        return <Clock className="text-yellow-400" size={20} />
      case 'approved': 
        return <CheckCircle className="text-green-400" size={20} />
      case 'rejected': 
        return <XCircle className="text-red-400" size={20} />
      default: 
        return null
    }
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

  return (
    <div className="pb-20 md:pb-0">
      <div className="space-y-8 p-4">
        <h1 className="text-3xl font-bold text-center">My Wallet</h1>

        {/* Balance Card */}
        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg text-center">
          <Wallet className="mx-auto mb-4 text-primary-500" size={60} />
          <p className="text-5xl font-bold text-gold">{balanceCoins.toLocaleString()}</p>
          <p className="text-xl text-gray-400">Coins Balance</p>
          <p className="text-2xl mt-2 text-green-400">${balanceUSD}</p>
        </div>

        {/* Request Withdrawal Button */}
        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg text-center">
          <button
            onClick={() => setShowModal(true)}
            disabled={!canWithdraw || loading}
            className={`btn-primary px-8 py-4 text-lg flex items-center gap-3 mx-auto ${(!canWithdraw || loading) && 'opacity-50 cursor-not-allowed'}`}
          >
            <ArrowDownToLine size={24} />
            Request Withdrawal
          </button>
          {!canWithdraw && balanceCoins > 0 && (
            <p className="text-sm text-gray-400 mt-4">
              Need {(MIN_WITHDRAW_COINS - balanceCoins).toLocaleString()} more coins to withdraw
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`text-center p-4 rounded-lg ${message.includes('submitted') || message.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            <p className="text-lg">{message}</p>
          </div>
        )}

        {/* Withdrawal History */}
        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg">
          <h2 className="text-2xl font-bold mb-4">Withdrawal History</h2>
          {withdrawals.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No withdrawal requests yet</p>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((w) => (
                <div key={w.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-lg">
                        {w.amount.toLocaleString()} coins (${(w.amount * COIN_VALUE_USD).toFixed(2)})
                      </p>
                      <p className="text-sm text-gray-400">
                        {w.bank} • ***{w.account_number.slice(-4)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(w.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {getStatusIcon(w.status)}
                      <span className={`font-bold text-sm ${w.status === 'pending' ? 'text-yellow-400' : w.status === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
                        {w.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-glow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Request Withdrawal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Amount in coins</label>
                <input
                  type="number"
                  placeholder={`Minimum ${MIN_WITHDRAW_COINS}`}
                  value={amountCoins}
                  onChange={(e) => setAmountCoins(e.target.value)}
                  className="input-field"
                  min={MIN_WITHDRAW_COINS}
                  max={balanceCoins}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  = ${(parseInt(amountCoins || '0') * COIN_VALUE_USD).toFixed(2)} USD
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Account Name</label>
                <input
                  type="text"
                  placeholder="Full name on account"
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Bank</label>
                <input
                  type="text"
                  placeholder="e.g., Opay, Palmpay, Kuda"
                  value={form.bank}
                  onChange={(e) => setForm({ ...form, bank: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Account Number</label>
                <input
                  type="text"
                  placeholder="Your account number"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value.replace(/\D/g, '') })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Country</label>
                <input
                  type="text"
                  placeholder="e.g., Nigeria"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 btn-primary py-3 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}