import { Outlet } from 'react-router-dom'
import BottomNav from '../components/navigation/BottomNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-purple">
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}