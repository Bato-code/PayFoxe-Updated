import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import WalletPage from './pages/WalletPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ReferralsPage from './pages/ReferralsPage'
import ProfilePage from './pages/ProfilePage'
import TasksPage from './pages/TasksPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import SupportPage from './pages/SupportPage'
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />

        {/* Admin route - outside layout */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

        {/* User routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      }
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-purple flex items-center justify-center">
        <div className="text-2xl text-white animate-pulse">Loading PayFoxe...</div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-purple flex items-center justify-center">
        <div className="text-2xl text-white animate-pulse">Loading Admin...</div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default App
