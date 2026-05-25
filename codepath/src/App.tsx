import { useState } from 'react'
import Landing from './components/Landing'
import ChatBot from './components/ChatBot'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'

type Screen = 'landing' | 'chat' | 'signup' | 'login' | 'dashboard' | 'settings'

type User = {
  username: string
  email: string
  language: string
  avatar_url?: string
  streak?: number
  last_login?: string
  login_dates?: string[]
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem('codepath_user')
    return saved ? 'dashboard' : 'landing'
  })
  const [language, setLanguage] = useState('')
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('codepath_user')
    return saved ? JSON.parse(saved) : null
  })

  function handleChatComplete(lang: string) {
    setLanguage(lang)
    setScreen('signup')
  }

  function handleUserReady(u: User) {
    localStorage.setItem('codepath_user', JSON.stringify(u))
    setUser(u)
    setScreen('dashboard')
  }

  function handleUserUpdate(updates: Partial<User>) {
    if (!user) return
    const updated = { ...user, ...updates }
    localStorage.setItem('codepath_user', JSON.stringify(updated))
    setUser(updated)
  }

  function handleLogout() {
    localStorage.removeItem('codepath_user')
    setUser(null)
    setScreen('landing')
  }

  function handleDeleteAccount() {
    localStorage.removeItem('codepath_user')
    setUser(null)
    setScreen('landing')
  }

  return (
    <>
      {screen === 'landing' && <Landing onStart={() => setScreen('chat')} onLogin={() => setScreen('login')} />}
      {screen === 'chat' && <ChatBot onBack={() => setScreen('landing')} onComplete={handleChatComplete} />}
      {screen === 'signup' && <Signup language={language} onComplete={handleUserReady} />}
      {screen === 'login' && <Login onBack={() => setScreen('landing')} onComplete={handleUserReady} />}
      {screen === 'dashboard' && user && <Dashboard user={user} onSettings={() => setScreen('settings')} />}
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