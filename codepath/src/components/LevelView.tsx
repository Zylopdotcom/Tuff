import { useState, useEffect } from 'react'
import { useTheme } from '../lib/ThemeContext'
import Editor from '@monaco-editor/react'
import type { Level } from '../data/languages'

type Props = {
  level: Level
  levelIndex: number
  totalLevels: number
  stepName: string
  language: string
  onBack: () => void
  onComplete: () => void
}

type Phase = 'loading' | 'learn' | 'quiz' | 'code' | 'reviewing' | 'passed' | 'failed'

export default function LevelView({ level, levelIndex, totalLevels, stepName, language, onBack, onComplete }: Props) {
  const { theme: t } = useTheme()
  const [phase, setPhase] = useState<Phase>('loading')
  const [lesson, setLesson] = useState('')
  const [quiz, setQuiz] = useState<{ question: string; options: string[]; correct: number } | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [code, setCode] = useState(`// ${level.challenge}\n// Write your solution here\n\n`)
  const [feedback, setFeedback] = useState('')
  const [dots, setDots] = useState('')

  const cacheKey = `codepath_level_${language}_${stepName}_${level.id}`

  useEffect(() => {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const data = JSON.parse(cached)
      setLesson(data.lesson)
      setQuiz(data.quiz)
      setPhase('learn')
    } else {
      loadLesson()
    }
  }, [])

  useEffect(() => {
    if (phase !== 'loading' && phase !== 'reviewing') return
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => clearInterval(interval)
  }, [phase])

  async function callAI(prompt: string, maxTokens = 300) {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        system: `You are EduBot, a coding teacher. You teach ${language}. Be concise and use terminal-style formatting. Always respond in the exact JSON format requested.`,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await response.json()
    return data.content[0].text
  }

  async function loadLesson() {
    setPhase('loading')
    try {
      const raw = await callAI(`
Teach the concept: "${level.title}" for ${language}.

Respond ONLY with this JSON (no markdown, no backticks):
{
  "lesson": "3-4 sentence explanation with a code example using \\n for newlines",
  "question": "A multiple choice question to test understanding",
  "options": ["option A", "option B", "option C", "option D"],
  "correct": 0
}

The correct field is the index (0-3) of the right answer.`, 400)

      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      const lessonData = {
        lesson: parsed.lesson,
        quiz: { question: parsed.question, options: parsed.options, correct: parsed.correct }
      }
      localStorage.setItem(cacheKey, JSON.stringify(lessonData))
      setLesson(parsed.lesson)
      setQuiz({ question: parsed.question, options: parsed.options, correct: parsed.correct })
      setPhase('learn')
    } catch {
      setLesson('Failed to load lesson. Please try again.')
      setPhase('learn')
    }
  }

  async function reviewCode() {
    setPhase('reviewing')
    try {
      const raw = await callAI(`
The student is learning "${level.title}" in ${language}.
Challenge: "${level.challenge}"
Student's code:
\`\`\`
${code}
\`\`\`

Respond ONLY with this JSON (no markdown, no backticks):
{
  "passed": true or false,
  "feedback": "2-3 sentences of feedback in terminal style using >> and [ ]"
}

Be encouraging. Pass if the student made a genuine attempt and the logic is mostly correct.`, 300)

      const parsed = JSON.parse(raw)
      setFeedback(parsed.feedback)
      setPhase(parsed.passed ? 'passed' : 'failed')
    } catch {
      setFeedback('[ ERROR ] Could not review code. Try again.')
      setPhase('failed')
    }
  }

  const editorLang = language.toLowerCase().includes('python') ? 'python'
    : language.toLowerCase().includes('swift') ? 'swift'
    : language.toLowerCase().includes('c#') || language.toLowerCase().includes('unity') ? 'csharp'
    : 'javascript'

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: t.font, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .option-btn { width:100%; text-align:left; background:${t.bgSecondary}; border:1px solid ${t.border}; color:${t.secondary}; padding:14px 18px; font-family:${t.font}; font-size:13px; cursor:pointer; transition:all 0.15s; letter-spacing:1px; margin-bottom:8px; }
        .option-btn:hover { border-color:${t.primary}; color:${t.primary}; }
        .option-btn.correct { border-color:#00ff88; color:#00ff88; background:#00ff8811; }
        .option-btn.wrong { border-color:#ff4444; color:#ff4444; background:#ff444411; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 40px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.secondary, padding: '8px 16px', fontFamily: t.font, fontSize: '11px', letterSpacing: '2px', cursor: 'pointer' }}>← BACK</button>
        <div style={{ flex: 1 }}>
          <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '2px' }}>{stepName} → Level {levelIndex + 1}/{totalLevels}</div>
          <div style={{ color: t.primary, fontSize: '16px', letterSpacing: '2px' }}>{level.title}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['LEARN', 'QUIZ', 'CODE'].map((p, i) => (
            <div key={p} style={{
              padding: '4px 12px', fontSize: '10px', letterSpacing: '1px',
              border: `1px solid ${['learn', 'quiz', 'code'].indexOf(phase) >= i ? t.primary : t.border}`,
              color: ['learn', 'quiz', 'code'].indexOf(phase) >= i ? t.primary : t.secondary
            }}>
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>

        {/* LOADING */}
        {phase === 'loading' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ color: t.primary, fontSize: '14px', letterSpacing: '3px' }}>EDUBOT PREPARING LESSON{dots}</div>
            <div style={{ color: t.secondary, fontSize: '11px', marginTop: '12px' }}>Loading {level.title}</div>
          </div>
        )}

        {/* LEARN */}
        {phase === 'learn' && (
          <div style={{ maxWidth: '720px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' }}>[ LESSON ]</div>
            <div style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '28px', marginBottom: '32px' }}>
              <div style={{ color: t.primary, fontSize: '13px', lineHeight: 2, whiteSpace: 'pre-wrap', letterSpacing: '0.5px' }}>{lesson}</div>
            </div>
            <button
              onClick={() => setPhase('quiz')}
              style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '14px 32px', fontFamily: t.font, fontSize: '13px', letterSpacing: '3px', cursor: 'pointer' }}
            >
              [ TAKE QUIZ ] →
            </button>
          </div>
        )}

        {/* QUIZ */}
        {phase === 'quiz' && quiz && (
          <div style={{ maxWidth: '600px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' }}>[ KNOWLEDGE CHECK ]</div>
            <div style={{ color: t.primary, fontSize: '16px', letterSpacing: '1px', marginBottom: '28px', lineHeight: 1.6 }}>{quiz.question}</div>
            {quiz.options.map((opt, i) => (
              <button
                key={i}
                className={`option-btn ${selectedAnswer !== null ? i === quiz.correct ? 'correct' : selectedAnswer === i ? 'wrong' : '' : ''}`}
                onClick={() => {
                  if (selectedAnswer !== null) return
                  setSelectedAnswer(i)
                  if (i === quiz.correct) setTimeout(() => setPhase('code'), 1200)
                }}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
            {selectedAnswer !== null && selectedAnswer !== quiz.correct && (
              <div style={{ color: '#ff4444', fontSize: '12px', marginTop: '16px', letterSpacing: '1px' }}>
                &gt;&gt; Not quite. The correct answer is {String.fromCharCode(65 + quiz.correct)}.
                <button onClick={() => setSelectedAnswer(null)} style={{ marginLeft: '16px', background: 'transparent', border: `1px solid ${t.border}`, color: t.secondary, padding: '4px 12px', fontFamily: t.font, fontSize: '11px', cursor: 'pointer' }}>TRY AGAIN</button>
                <button onClick={() => setPhase('code')} style={{ marginLeft: '8px', background: 'transparent', border: `1px solid ${t.border}`, color: t.secondary, padding: '4px 12px', fontFamily: t.font, fontSize: '11px', cursor: 'pointer' }}>SKIP →</button>
              </div>
            )}
          </div>
        )}

        {/* CODE */}
        {phase === 'code' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>[ CODING CHALLENGE ]</div>
            <div style={{ color: t.primary, fontSize: '16px', letterSpacing: '1px', marginBottom: '24px' }}>{level.challenge}</div>
            <div style={{ border: `1px solid ${t.border}`, marginBottom: '16px', overflow: 'hidden' }}>
              <div style={{ background: t.bgTertiary, padding: '8px 16px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: t.secondary, fontSize: '10px', letterSpacing: '2px' }}>CODE EDITOR</span>
                <span style={{ color: t.secondary, fontSize: '10px' }}>{editorLang}</span>
              </div>
              <Editor
                height="320px"
                defaultLanguage={editorLang}
                value={code}
                onChange={v => setCode(v || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontFamily: 'Share Tech Mono, monospace'
                }}
              />
            </div>
            <button
              onClick={reviewCode}
              style={{ background: t.border, border: `1px solid ${t.primary}`, color: t.primary, padding: '14px 32px', fontFamily: t.font, fontSize: '13px', letterSpacing: '3px', cursor: 'pointer' }}
            >
              [ SUBMIT FOR REVIEW ] →
            </button>
          </div>
        )}

        {/* REVIEWING */}
        {phase === 'reviewing' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ color: t.primary, fontSize: '14px', letterSpacing: '3px' }}>EDUBOT REVIEWING YOUR CODE{dots}</div>
            <div style={{ color: t.secondary, fontSize: '11px', marginTop: '12px' }}>Analyzing your solution...</div>
          </div>
        )}

        {/* PASSED */}
        {phase === 'passed' && (
          <div style={{ maxWidth: '600px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ color: '#00ff88', fontSize: '32px', marginBottom: '8px' }}>✓ LEVEL COMPLETE</div>
            <div style={{ background: t.bgSecondary, border: '1px solid #00ff8833', padding: '20px', marginBottom: '24px' }}>
              <div style={{ color: '#00ff88', fontSize: '12px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{feedback}</div>
            </div>
            <button
              onClick={onComplete}
              style={{ background: '#00ff8820', border: '1px solid #00ff88', color: '#00ff88', padding: '14px 32px', fontFamily: t.font, fontSize: '13px', letterSpacing: '3px', cursor: 'pointer' }}
            >
              {levelIndex + 1 < totalLevels ? '[ NEXT LEVEL ] →' : '[ STEP COMPLETE ] 🎉'}
            </button>
          </div>
        )}

        {/* FAILED */}
        {phase === 'failed' && (
          <div style={{ maxWidth: '600px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ color: '#ff6b2b', fontSize: '24px', marginBottom: '8px' }}>TRY AGAIN</div>
            <div style={{ background: t.bgSecondary, border: '1px solid #ff6b2b33', padding: '20px', marginBottom: '24px' }}>
              <div style={{ color: '#ff6b2b', fontSize: '12px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{feedback}</div>
            </div>
            <button
              onClick={() => setPhase('code')}
              style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '14px 32px', fontFamily: t.font, fontSize: '13px', letterSpacing: '3px', cursor: 'pointer' }}
            >
              [ TRY AGAIN ] →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}