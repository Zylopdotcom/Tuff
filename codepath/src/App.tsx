import { useState } from 'react'
import Landing from './components/Landing'
import Quiz from './components/Quiz'
import Result from './components/Result'

type Screen = 'landing' | 'quiz' | 'result'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [answers, setAnswers] = useState<Record<string, string>>({})

  function handleComplete(a: Record<string, string>) {
    setAnswers(a)
    setScreen('result')
  }

  return (
    <>
      {screen === 'landing' && <Landing onStart={() => setScreen('quiz')} />}
      {screen === 'quiz' && <Quiz onComplete={handleComplete} />}
      {screen === 'result' && <Result answers={answers} onRestart={() => setScreen('landing')} />}
    </>
  )
}