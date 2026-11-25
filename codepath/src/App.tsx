import { useState, useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import Landing from './components/Landing'
import ChatBot from './components/ChatBot'
import Signup from './components/Signup'
import Login from './components/Login'
import ResetPassword from './components/ResetPassword'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import { supabase } from './lib/supabase'
import { type User, loadProfile, createProfile, takePending } from './lib/profile'

type Screen = 'loading' | 'landing' | 'chat' | 'signup' | 'login' | 'reset-password' | 'dashboard' | 'settings'

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [language, setLanguage] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [authError, setAuthError] = useState('')
  const recovering = useRef(false)

  useEffect(() => {
    // Accounts used to be kept only in the browser; that copy is no longer used.
    try { localStorage.removeItem('codepath_user') } catch { /* storage unavailable */ }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Supabase advises not to await its own calls inside this callback, so defer the work.
      setTimeout(() => {
        if (event === 'PASSWORD_RECOVERY') {
          recovering.current = true
          setSession(newSession)
          setScreen('reset-password')
          return
        }
        if (recovering.current && event !== 'SIGNED_OUT') return
        handleSession(newSession)
      }, 0)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Decides where a (possibly signed-in) visitor belongs, creating their profile after signup.
  async function handleSession(newSession: Session | null) {
    setSession(newSession)
    if (!newSession) {
      setUser(null)
      setScreen(s => (s === 'chat' || s === 'signup' || s === 'login') ? s : 'landing')
      return
    }
    try {
      let profile = await loadProfile(newSession.user.id)
      if (!profile) {
        const pending = takePending()
        if (pending?.language) {
          profile = await createProfile(newSession, pending.language, pending.username)
        } else {
          // Signed in (e.g. with Google) but never chose a path: let EduBot pick one first.
          setUser(null)
          setScreen('chat')
          return
        }
      }
      setUser(profile)
      setScreen(s => (s === 'settings' ? s : 'dashboard'))
    } catch (e) {
      console.error('Could not load profile:', e)
      setAuthError('[ ERROR ] Could not load your profile. Please try again.')
      setScreen('login')
    }
  }

  async function handleChatComplete(lang: string) {
    if (user) {
      // An existing user talking to EduBot again is changing path, not signing up.
      const { error } = await supabase.from('users').update({ language: lang }).eq('id', user.id)
      if (error) console.error('Failed to save new path:', error.message)
      setUser({ ...user, language: lang })
      setScreen('dashboard')
      return
    }
    if (session) {
      // Signed in without a profile yet: create it with the path EduBot chose.
      try {
        setUser(await createProfile(session, lang))
        setScreen('dashboard')
      } catch (e) {
        console.error('Could not create profile:', e)
        setAuthError('[ ERROR ] Could not create your profile. Please try again.')
        setScreen('login')
      }
      return
    }
    setLanguage(lang)
    setScreen('signup')
  }

  // Builds on the latest user, so several updates in a row (e.g. progress, then a badge) all keep their changes.
  function handleUserUpdate(updates: Partial<User>) {
    setUser(prev => (prev ? { ...prev, ...updates } : prev))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setScreen('landing')
  }

  async function handleDeleteAccount() {
    await supabase.auth.signOut()
    setUser(null)
    setScreen('landing')
  }

  function handlePasswordUpdated() {
    recovering.current = false
    handleSession(session)
  }

  return (
    <>
      {screen === 'loading' && (
        <div style={{ background: '#050d12', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00fff7', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '3px', fontSize: '13px' }}>
          &gt;&gt; LOADING CODEPATH...
        </div>
      )}
      {screen === 'landing' && <Landing onStart={() => setScreen('chat')} onLogin={() => setScreen('login')} />}
      {screen === 'chat' && <ChatBot onBack={() => setScreen(user ? 'settings' : 'landing')} onComplete={handleChatComplete} />}
      {screen === 'signup' && <Signup language={language} onLogin={() => setScreen('login')} />}
      {screen === 'login' && <Login initialError={authError} onBack={() => { setAuthError(''); setScreen('landing') }} />}
      {screen === 'reset-password' && <ResetPassword onDone={handlePasswordUpdated} />}
      {screen === 'dashboard' && user && <Dashboard user={user} onSettings={() => setScreen('settings')} onUserUpdate={handleUserUpdate} />}
      {screen === 'settings' && user && (
        <Settings
          user={user}
          onBack={() => setScreen('dashboard')}
          onRetakeQuiz={() => setScreen('chat')}
          onDeleteAccount={handleDeleteAccount}
          onUserUpdate={handleUserUpdate}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}
