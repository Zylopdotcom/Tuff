import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

// A learner's profile row in public.users. `id` is the Supabase Auth user id.
export type User = {
  id: string
  username: string
  email: string
  language: string
  avatar_url?: string
  streak?: number
  last_login?: string
  login_dates?: string[]
  badges?: string[]
  completed_levels?: string[]
}

// Signup can leave the page (Google sign-in, or confirming the email), so the chosen
// path and username are kept here until the profile is created.
const PENDING_KEY = 'codepath_pending_signup'
type Pending = { language: string; username?: string }

export function savePending(p: Pending) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(p)) } catch { /* storage unavailable */ }
}

export function takePending(): Pending | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    localStorage.removeItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function loadProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data as User | null
}

// A friendly default name: what the user typed, else their Google name, else the start of their email.
function defaultUsername(session: Session, typed?: string) {
  const meta = session.user.user_metadata || {}
  const name = typed || meta.username || meta.full_name || meta.name || session.user.email?.split('@')[0] || 'learner'
  return String(name).trim().slice(0, 40)
}

export async function createProfile(session: Session, language: string, typedUsername?: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({ id: session.user.id, email: session.user.email, username: defaultUsername(session, typedUsername), language })
    .select('*')
    .single()
  if (error) throw error
  return data as User
}
