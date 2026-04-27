import { Home, CheckSquare, Wallet, Users, UserCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  const items = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/referrals', icon: Users, label: 'Referrals' },
    { path: '/profile', icon: UserCircle, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex justify-around py-3 max-w-7xl mx-auto">
        {items.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                active ? 'text-primary-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={24} className={active ? 'drop-shadow-glow' : ''} />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
