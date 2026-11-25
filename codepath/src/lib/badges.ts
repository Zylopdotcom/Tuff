// Achievement badges. Ids are stored in users.badges, so never rename an id.

export type Badge = { id: string; icon: string; name: string; how: string }

export const BADGES: Badge[] = [
  { id: 'pathfinder', icon: '🧭', name: 'Pathfinder', how: 'Get your path from EduBot and sign up' },
  { id: 'first-level', icon: '🌱', name: 'First Steps', how: 'Complete your first level' },
  { id: 'step-cleared', icon: '🏁', name: 'Step Cleared', how: 'Complete every level in a step' },
  { id: 'first-interview', icon: '🎤', name: 'Interview Ready', how: 'Finish your first mock interview' },
  { id: 'interview-70', icon: '🧠', name: 'Sharp Mind', how: 'Score 70% or more in a mock interview' },
  { id: 'interview-90', icon: '🏆', name: 'Interview Ace', how: 'Score 90% or more in a mock interview' },
  { id: 'streak-3', icon: '🔥', name: 'On Fire', how: 'Log in 3 days in a row' },
  { id: 'streak-7', icon: '⚡', name: 'Week Warrior', how: 'Log in 7 days in a row' },
  { id: 'streak-30', icon: '👑', name: 'Unstoppable', how: 'Log in 30 days in a row' },
]

export const badgeById = (id: string) => BADGES.find(b => b.id === id)

export function streakBadges(streak: number): string[] {
  return [[3, 'streak-3'], [7, 'streak-7'], [30, 'streak-30']]
    .filter(([days]) => streak >= (days as number))
    .map(([, id]) => id as string)
}

export function interviewBadges(scorePercent: number): string[] {
  const ids = ['first-interview']
  if (scorePercent >= 70) ids.push('interview-70')
  if (scorePercent >= 90) ids.push('interview-90')
  return ids
}
