import type { Language } from '../data/languages'
import { supabase } from './supabase'

// Completed levels are stored as "<pathId>:<stepIndex>:<levelId>" so each path keeps its own progress.
export const levelKey = (pathId: string, stepIndex: number, levelId: number) => `${pathId}:${stepIndex}:${levelId}`

export type StepStatus = 'DONE' | 'IN PROGRESS' | 'PENDING'

export function stepProgress(path: Language, stepIndex: number, completed: string[]) {
  const levels = path.steps[stepIndex].levels
  const done = levels.filter(l => completed.includes(levelKey(path.id, stepIndex, l.id))).length
  return { done, total: levels.length, percent: Math.round((done / levels.length) * 100) }
}

export function pathProgress(path: Language, completed: string[]) {
  const steps = path.steps.map((_, i) => stepProgress(path, i, completed))
  const doneLevels = steps.reduce((a, s) => a + s.done, 0)
  const totalLevels = steps.reduce((a, s) => a + s.total, 0)
  // The current step is the first one not finished; it counts as in progress even before any level is done.
  const current = steps.findIndex(s => s.done < s.total)
  const statuses: StepStatus[] = steps.map((s, i) =>
    s.done === s.total ? 'DONE' : s.done > 0 || i === current ? 'IN PROGRESS' : 'PENDING')
  return {
    steps,
    statuses,
    doneLevels,
    totalLevels,
    completedSteps: statuses.filter(s => s === 'DONE').length,
    inProgressSteps: statuses.filter(s => s === 'IN PROGRESS').length,
    percent: totalLevels ? Math.round((doneLevels / totalLevels) * 100) : 0,
  }
}

export type LearningEvent = {
  kind: 'quiz' | 'review' | 'hint' | 'error_explained' | 'interview'
  stepIndex?: number
  levelId?: number
  correct?: boolean
  detail?: Record<string, unknown>
}

// Records one learning attempt for the knowledge tracing dataset. Never blocks or breaks the UI.
export async function logEvent(userId: string, pathId: string, e: LearningEvent) {
  const { error } = await supabase.from('learning_events').insert({
    user_id: userId,
    path: pathId,
    step_index: e.stepIndex ?? null,
    level_id: e.levelId ?? null,
    kind: e.kind,
    correct: e.correct ?? null,
    detail: e.detail ?? {},
  })
  if (error) console.error('Failed to log learning event:', error.message)
}
