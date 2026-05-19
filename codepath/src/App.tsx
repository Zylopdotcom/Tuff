import { useState } from 'react'
import Landing from './components/Landing'
import ChatBot from './components/ChatBot'

type Screen = 'landing' | 'chat'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')

  return (
    <>
      {screen === 'landing' && <Landing onStart={() => setScreen('chat')} />}
      {screen === 'chat' && <ChatBot onBack={() => setScreen('landing')} />}
    </>
  )
}