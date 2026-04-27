import axios from 'axios'
import { supabase } from '../lib/supabase'
import { getLevelInfo } from '../utils/levelSystem'

export interface Task {
  id: string
  title: string
  description: string
  category: 'videos' | 'surveys' | 'offers'
  coins: number
  xp: number
  duration: string
  url: string
  provider: 'timewall' | 'cpalead' | 'mock'
}

const TIMEWALL = import.meta.env.VITE_TIMEWALL_PUB_ID
const CPALEAD = import.meta.env.VITE_CPALEAD_PUB_ID

export async function fetchTasks(userId: string): Promise<Task[]> {
  const tasks: Task[] = []

  // Timewall offers
  if (TIMEWALL) {
    try {
      const res = await axios.get(`https://api.timewall.io/api/offers?pub_id=${TIMEWALL}&user_id=${userId}`)
      tasks.push(...(res.data.offers || []).map((o: any) => ({
        id: o.id,
        title: o.name,
        description: o.desc,
        category: 'offers' as const,
        coins: o.reward || 60,
        xp: 12,
        duration: o.est_time || '3 min',
        url: o.url,
        provider: 'timewall' as const
      })))
    } catch (e) { 
      console.warn('Timewall fetch failed:', e) 
    }
  }

  // CPALead offers
  if (CPALEAD) {
    try {
      const res = await axios.get(`https://api.cpalead.com/json/offers?pub_id=${CPALEAD}`)
      tasks.push(...(res.data || []).map((o: any) => ({
        id: o.id,
        title: o.name,
        description: o.description,
        category: 'surveys' as const,
        coins: parseInt(o.reward) || 120,
        xp: 25,
        duration: o.time || '5 min',
        url: o.landing_url,
        provider: 'cpalead' as const
      })))
    } catch (e) { 
      console.warn('CPALead fetch failed:', e) 
    }
  }

  // Fallback mock tasks
  if (tasks.length === 0) {
    tasks.push(
      { id: 'mock1', title: 'Watch Video', description: 'Watch a short video', category: 'videos', coins: 50, xp: 10, duration: '30 sec', url: '#', provider: 'mock' },
      { id: 'mock2', title: 'Complete Survey', description: 'Answer quick questions', category: 'surveys', coins: 150, xp: 25, duration: '3 min', url: '#', provider: 'mock' },
      { id: 'mock3', title: 'Install App', description: 'Download and open app', category: 'offers', coins: 500, xp: 50, duration: '5 min', url: '#', provider: 'mock' }
    )
  }

  return tasks
}

export async function completeTask(task: Task, userId: string) {
  // Prevent duplicate completion
  const { data: exists } = await supabase
    .from('task_completions')
    .select('id')
    .eq('user_id', userId)
    .eq('task_id', task.id)
    .single()

  if (exists) throw new Error('Task already completed')

  // Get user's current XP for level calculation
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', userId)
    .single()

  const levelInfo = getLevelInfo(profile?.xp || 0)
  const xpEarned = Math.round(task.xp * levelInfo.multiplier)

  // Record completion
  const { error: completionError } = await supabase
    .from('task_completions')
    .insert({
      user_id: userId,
      task_id: task.id,
      provider: task.provider,
      coins_earned: task.coins,
      xp_earned: xpEarned
    })

  if (completionError) throw completionError

  // Award rewards using atomic RPC function
  const { error: rewardError } = await supabase
    .rpc('increment_user_rewards', {
      user_id_param: userId,
      coins_param: task.coins,
      xp_param: xpEarned
    })

  if (rewardError) throw rewardError

  // Optional: Check and update level (if you created the level-up function)
  await supabase.rpc('check_and_update_level', {
    user_id_param: userId
  })

  // Optional notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Task Completed!', {
      body: `+${task.coins} coins & +${xpEarned} XP`,
      icon: '/pwa-192x192.png'
    })
  }
}
