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
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [language, setLanguage] = useState('')
  const [user, setUser] = useState<User | null>(null)

  function handleChatComplete(lang: string) {
    setLanguage(lang)
    setScreen('signup')
  }

  function handleUserReady(u: User) {
    setUser(u)
    setScreen('dashboard')
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
          onRetakeQuiz={() => { setScreen('chat') }}
          onDeleteAccount={() => { setUser(null); setScreen('landing') }}
          onUserUpdate={(u) => setUser(u)}
          onLogout={() => { setUser(null); setScreen('landing') }}
        />
      )}
    </>
  )
}