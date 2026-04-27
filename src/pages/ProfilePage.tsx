import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { LogOut, Mail, User, Trophy, Coins, Edit, Save, X, Camera } from 'lucide-react'
import BottomNav from '../components/navigation/BottomNav'

const COIN_VALUE_USD = 0.01

export default function ProfilePage() {
  const { user, signOut, refreshUser, loading: authLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || ''
  })

  if (!user) return null

  const balanceUSD = (user.coins * COIN_VALUE_USD).toFixed(2)

  const handleEdit = () => {
    setFormData({
      username: user.username
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      username: user.username
    })
  }

  const handleSave = async () => {
    if (!formData.username.trim()) {
      alert('Username cannot be empty')
      return
    }

    setLoading(true)
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: formData.username })
        .eq('id', user.id)

      if (profileError) throw profileError

      await refreshUser()
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error: any) {
      console.error('Update error:', error)
      alert(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB')
      return
    }

    setUploadingImage(true)
    try {
      if (user.avatar_url) {
        const oldPath = user.avatar_url.split('/').pop()
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`])
        }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      await refreshUser()
      alert('Profile picture updated!')
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      // Auth state listener will handle redirect automatically
    } catch (error: any) {
      console.error('Sign out error:', error)
      alert(error.message || 'Failed to sign out. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="pb-20 md:pb-0">
      <div className="space-y-8 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="btn-primary px-4 py-2 flex items-center gap-2"
            >
              <Edit size={20} />
              Edit
            </button>
          )}
        </div>

        <div className="backdrop-blur-sm rounded-3xl p-8 shadow-glow-lg text-center">
          {/* Profile Picture */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-primary-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
            )}
            
            {/* Upload Button */}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2 cursor-pointer hover:bg-primary-600 transition-colors shadow-lg"
            >
              {uploadingImage ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Camera size={20} className="text-white" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
          </div>

          {isEditing ? (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-left text-sm text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter username"
                />
              </div>
              
              {/* Email is read-only */}
              <div>
                <label className="block text-left text-sm text-gray-400 mb-2">Email (cannot be changed)</label>
                <div className="input-field w-full bg-white/5 cursor-not-allowed flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  {user.email}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary px-6 py-2 flex items-center gap-2"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 flex items-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-400 flex items-center justify-center gap-2 mt-2">
                <Mail size={16} /> {user.email}
              </p>
            </>
          )}

          {user.role === 'admin' && (
            <span className="inline-block mt-3 px-4 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded-full text-sm">
              ADMIN
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg text-center">
            <Coins className="mx-auto mb-3 text-gold" size={40} />
            <p className="text-3xl font-bold text-gold">{user.coins.toLocaleString()}</p>
            <p className="text-gray-400">Coins</p>
            <p className="text-lg text-green-400 mt-1">${balanceUSD}</p>
          </div>
          <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg text-center">
            <Trophy className="mx-auto mb-3 text-primary-500" size={40} />
            <p className="text-3xl font-bold">Level {user.level || 1}</p>
            <p className="text-gray-400">Rank</p>
            <p className="text-sm text-gray-500 mt-1">{user.xp || 0} XP</p>
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg">
          <h3 className="text-xl font-bold mb-4">Referral Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Referral Code</span>
              <span className="font-mono font-bold text-primary-400">{user.referral_code || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Successful Referrals</span>
              <span className="font-bold">{user.referral_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Coins from Referrals</span>
              <span className="font-bold text-green-400">
                {((user.referral_count || 0) * 25).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={loading || authLoading}
          className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 bg-red-500/20 border border-red-500 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || authLoading ? (
            <>
              <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut size={24} />
              Sign Out
            </>
          )}
        </button>
      </div>
      <BottomNav />
    </div>
  )
}