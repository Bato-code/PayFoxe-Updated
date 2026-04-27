export interface LevelInfo {
  level: number
  rank: string
  xpToNext: number
  multiplier: number
}

const LEVELS = [
  { level: 1, xp: 0, rank: 'Beginner', multiplier: 1 },
  { level: 2, xp: 100, rank: 'Novice', multiplier: 1.05 },
  { level: 3, xp: 300, rank: 'Apprentice', multiplier: 1.1 },
  { level: 4, xp: 600, rank: 'Worker', multiplier: 1.15 },
  { level: 5, xp: 1000, rank: 'Skilled', multiplier: 1.2 },
  { level: 6, xp: 1500, rank: 'Expert', multiplier: 1.25 },
  { level: 7, xp: 2100, rank: 'Professional', multiplier: 1.3 },
  { level: 8, xp: 2800, rank: 'Veteran', multiplier: 1.4 },
  { level: 9, xp: 3600, rank: 'Master', multiplier: 1.5 },
  { level: 10, xp: 4500, rank: 'Elite', multiplier: 1.6 },
  { level: 11, xp: 5500, rank: 'Champion', multiplier: 1.75 },
  { level: 12, xp: 6600, rank: 'Legend', multiplier: 2.0 },
]

export function getLevelInfo(xp: number): LevelInfo {
  let current = LEVELS[0]
  let next = LEVELS[1]
  for (const lvl of LEVELS) {
    if (xp >= lvl.xp) {
      current = lvl
      next = LEVELS[LEVELS.indexOf(lvl) + 1] || lvl
    } else break
  }
  return {
    level: current.level,
    rank: current.rank,
    xpToNext: next.xp - current.xp,
    multiplier: current.multiplier
  }
}