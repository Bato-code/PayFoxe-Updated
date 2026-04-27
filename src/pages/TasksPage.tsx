import { useEffect, useState } from 'react'
import { Play, Clock, Coins } from 'lucide-react'
import { fetchTasks, completeTask, Task } from '../services/taskApi'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/navigation/BottomNav'

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'videos' | 'surveys' | 'offers'>('all')

  useEffect(() => {
    if (user) {
      fetchTasks(user.id).then(setTasks)
    }
  }, [user])

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.category === filter)

  const handleStart = async (task: Task) => {
    try {
      await completeTask(task, user!.id)
      setTasks(prev => prev.filter(t => t.id !== task.id))
      alert('Task completed! Rewards added.')
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="pb-20 md:pb-0">
      <div className="space-y-6 p-4">
        <h1 className="text-3xl font-bold">Available Tasks</h1>
        <p className="text-gray-400">Complete tasks to earn coins and XP</p>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {(['all', 'videos', 'surveys', 'offers'] as const).map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-xl whitespace-nowrap ${filter === c ? 'bg-primary-500 text-white shadow-glow' : 'bg-white/10 text-gray-400'}`}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No tasks available in this category</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(task => (
              <div key={task.id} className="backdrop-blur-sm rounded-3xl p-6 shadow-glow-lg">
                <div className="flex justify-between mb-3">
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">
                    {task.category}
                  </span>
                  <span className="flex items-center gap-1 text-gold font-bold">
                    <Coins size={16} /> {task.coins}
                  </span>
                </div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-sm text-gray-400 my-2">{task.description}</p>
                <div className="flex justify-between items-center gap-3 mt-4">
                  <span className="text-gray-400 flex items-center gap-1 text-sm">
                    <Clock size={16} /> {task.duration}
                  </span>
                  <button onClick={() => handleStart(task)}
                    className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-glow">
                    <Play size={16} /> Start
                  </button>
                </div>
                <a href={task.url} target="_blank" rel="noopener noreferrer" className="block text-center text-primary-400 text-sm mt-2 hover:underline">
                  Open Offer →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
