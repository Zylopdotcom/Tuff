import { useState, useEffect } from 'react'
import { useTheme } from '../lib/ThemeContext'
import Editor from '@monaco-editor/react'
import type { Level } from '../data/languages'
import { parseJson, clip } from '../lib/ai'

type Props = {
  level: Level
  levelIndex: number
  totalLevels: number
  stepName: string
  language: string
  // Topics the learner has already gone through, oldest first.
  covered: string[]
  onBack: () => void
  onComplete: () => void
}

type Phase = 'loading' | 'learn' | 'quiz' | 'code' | 'reviewing' | 'passed' | 'failed'

type ErrorExplanation = { meaning: string; cause: string; fix: string }

const MAX_HINTS = 3
// Keeps requests well inside the AI proxy's size limits.
const MAX_CODE_CHARS = 6000
const MAX_ERROR_CHARS = 3000

// Step names say more than the path language for some steps, for example the
// Linux step of the cybersecurity path or the HTML step of the web path.
function editorLanguage(stepName: string, language: string) {
  const step = stepName.toLowerCase()
  if (step.includes('linux') || step.includes('bash') || step.includes('command line')) return 'shell'
  if (step.includes('html')) return 'html'
  const lang = language.toLowerCase()
  if (lang.includes('python')) return 'python'
  if (lang.includes('swift')) return 'swift'
  if (lang.includes('c#')) return 'csharp'
  if (lang.includes('kotlin')) return 'kotlin'
  if (lang.includes('c++')) return 'cpp'
  return 'javascript'
}

// Starter text must be a valid comment in the editor's language, or running it fails.
function starterCode(challenge: string, editorLang: string) {
  if (editorLang === 'python' || editorLang === 'shell') return `# ${challenge}\n# Write your solution here\n\n`
  if (editorLang === 'html') return `<!-- ${challenge} -->\n<!-- Write your solution here -->\n\n`
  return `// ${challenge}\n// Write your solution here\n\n`
}

const HINT_RULES: Record<number, string> = {
  1: 'Hint 1: ask one guiding question or give a nudge about what to think about first. No code at all.',
  2: 'Hint 2: name the concept or approach to use and outline the steps in plain words. You may show general syntax, but not code for this challenge.',
  3: 'Hint 3: show a short example that solves a DIFFERENT but similar problem, then explain in one sentence how it relates to this challenge.',
}

export default function LevelView({ level, levelIndex, totalLevels, stepName, language, covered, onBack, onComplete }: Props) {
  const { theme: t } = useTheme()
  const [phase, setPhase] = useState<Phase>('loading')
  const [lesson, setLesson] = useState('')
  const [quiz, setQuiz] = useState<{ question: string; options: string[]; correct: number } | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [code, setCode] = useState(() => starterCode(level.challenge, editorLanguage(stepName, language)))
  const [feedback, setFeedback] = useState('')
  const [hints, setHints] = useState<string[]>([])
  const [hintLoading, setHintLoading] = useState(false)
  const [showErrorPanel, setShowErrorPanel] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [errorExplanation, setErrorExplanation] = useState<ErrorExplanation | null>(null)
  const [explaining, setExplaining] = useState(false)
  const [assistError, setAssistError] = useState('')
  const [dots, setDots] = useState('')

  // v2: lessons now depend on the challenge and on what was covered before.
  const cacheKey = `codepath_level_v2_${language}_${stepName}_${level.id}`

  const coveredText = covered.length ? covered.join(', ') : 'nothing yet, this is their first level'
  const learnerContext = `Topics the learner has already covered: ${coveredText}.
The current level teaches: "${level.title}" (${level.concept}).
Only expect the learner to know these topics and what this level teaches; never require anything from later levels.`

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
    if (phase !== 'loading' && phase !== 'reviewing' && !hintLoading && !explaining) return
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => clearInterval(interval)
  }, [phase, hintLoading, explaining])

  async function callAI(prompt: string, maxTokens = 300) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        system: `You are EduBot, a coding teacher for complete beginners. You teach ${language}; the current step is "${stepName}". Be concise and use terminal-style formatting. Always respond in the exact JSON format requested.`,
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
Teach the concept: "${level.title}" (step: "${stepName}") for ${language}.
${learnerContext}
After the lesson the learner must solve this coding challenge: "${level.challenge}"
The lesson must teach everything the challenge needs, using only what they already covered plus this level's concept. Do not solve the challenge in the lesson.
The quiz question must be about this lesson; put any code in it on separate lines using \\n.

Respond ONLY with this JSON (no markdown, no backticks):
{
  "lesson": "3-4 sentence explanation with a code example using \\n for newlines",
  "question": "A multiple choice question to test understanding",
  "options": ["option A", "option B", "option C", "option D"],
  "correct": 0
}

The correct field is the index (0-3) of the right answer.`, 400)

      const parsed = parseJson<{ lesson: string; question: string; options: string[]; correct: number }>(raw)
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
${learnerContext}
Challenge: "${level.challenge}"
Student's code:
\`\`\`
${clip(code, MAX_CODE_CHARS)}
\`\`\`

Respond ONLY with this JSON (no markdown, no backticks):
{
  "passed": true or false,
  "feedback": "2-3 sentences of feedback in terminal style using >> and [ ]"
}

Be encouraging. Pass if the student made a genuine attempt and the logic is mostly correct.`, 300)

      const parsed = parseJson<{ passed: boolean; feedback: string }>(raw)
      setFeedback(parsed.feedback)
      setPhase(parsed.passed ? 'passed' : 'failed')
    } catch {
      setFeedback('[ ERROR ] Could not review code. Try again.')
      setPhase('failed')
    }
  }

  // Progressive hints: each one reveals a bit more, and none gives the solution.
  async function getHint() {
    if (hintLoading || hints.length >= MAX_HINTS) return
    const n = hints.length + 1
    setHintLoading(true)
    setAssistError('')
    try {
      const previous = hints.length
        ? hints.map((h, i) => `${i + 1}. ${h}`).join('\n')
        : 'none'
      const raw = await callAI(`
The student is learning "${level.title}" in ${language}.
${learnerContext}
Challenge: "${level.challenge}"
Their current code:
\`\`\`
${clip(code, MAX_CODE_CHARS)}
\`\`\`
Hints already given:
${previous}

Give hint ${n} of ${MAX_HINTS}. ${HINT_RULES[n]}
Rules for every hint:
- Never write the solution to this challenge and never complete or rewrite their code.
- Build on their current code and on the earlier hints; do not repeat them.
- If their code already solves the challenge, say so and suggest submitting it.
- 2-4 short sentences in terminal style.

Respond ONLY with this JSON (no markdown, no backticks):
{"hint": "..."}`, 350)
      const parsed = parseJson<{ hint: string }>(raw)
      setHints(prev => [...prev, parsed.hint])
    } catch {
      setAssistError('[ ERROR ] Could not get a hint. Try again.')
    }
    setHintLoading(false)
  }

  // Error explainer: turns an error message into plain language for a beginner.
  async function explainError() {
    if (explaining || !errorText.trim()) return
    setExplaining(true)
    setAssistError('')
    setErrorExplanation(null)
    try {
      const raw = await callAI(`
The student is learning "${level.title}" in ${language}.
${learnerContext}
Challenge: "${level.challenge}"
Their code:
\`\`\`
${clip(code, MAX_CODE_CHARS)}
\`\`\`
They got this error message:
\`\`\`
${clip(errorText.trim(), MAX_ERROR_CHARS)}
\`\`\`

Explain it for a complete beginner, avoiding jargon.
- Do not write the full corrected solution; describe the fix in steps.
- If the text is not an error message, say so in "meaning" and leave "cause" and "fix" empty.

Respond ONLY with this JSON (no markdown, no backticks):
{
  "meaning": "what the error means, in 1-2 plain sentences",
  "cause": "the most likely cause in their code, pointing to the line if possible, in 1-2 sentences",
  "fix": "how to fix it, in 1-3 sentences, without writing the solution"
}`, 450)
      setErrorExplanation(parseJson<ErrorExplanation>(raw))
    } catch {
      setAssistError('[ ERROR ] Could not explain the error. Try again.')
    }
    setExplaining(false)
  }

  const editorLang = editorLanguage(stepName, language)

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
            <div style={{ color: t.primary, fontSize: '16px', letterSpacing: '1px', marginBottom: '28px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{quiz.question}</div>
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
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <button
                onClick={reviewCode}
                style={{ background: t.border, border: `1px solid ${t.primary}`, color: t.primary, padding: '14px 32px', fontFamily: t.font, fontSize: '13px', letterSpacing: '3px', cursor: 'pointer' }}
              >
                [ SUBMIT FOR REVIEW ] →
              </button>
              <button
                onClick={getHint}
                disabled={hintLoading || hints.length >= MAX_HINTS}
                style={{ background: 'transparent', border: `1px solid ${t.secondary}`, color: t.secondary, padding: '14px 24px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: hints.length >= MAX_HINTS ? 'not-allowed' : 'pointer', opacity: hintLoading || hints.length >= MAX_HINTS ? 0.5 : 1 }}
              >
                {hintLoading ? `THINKING${dots}` : hints.length >= MAX_HINTS ? '[ NO HINTS LEFT ]' : `[ HINT ${hints.length + 1}/${MAX_HINTS} ]`}
              </button>
              <button
                onClick={() => setShowErrorPanel(v => !v)}
                style={{ background: 'transparent', border: `1px solid ${t.secondary}`, color: t.secondary, padding: '14px 24px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}
              >
                {showErrorPanel ? '[ HIDE ERROR HELP ]' : '[ EXPLAIN AN ERROR ]'}
              </button>
            </div>

            {assistError && (
              <div style={{ color: '#ff4444', fontSize: '12px', letterSpacing: '1px', marginBottom: '16px' }}>{assistError}</div>
            )}

            {hints.length > 0 && (
              <div style={{ maxWidth: '760px', marginBottom: '24px' }}>
                <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>[ HINTS ]</div>
                {hints.map((h, i) => (
                  <div key={i} style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '14px 18px', marginBottom: '8px', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '2px', marginBottom: '6px' }}>HINT {i + 1}</div>
                    <div style={{ color: t.primary, fontSize: '12px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{h}</div>
                  </div>
                ))}
              </div>
            )}

            {showErrorPanel && (
              <div style={{ maxWidth: '760px', marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>[ ERROR EXPLAINER ]</div>
                <div style={{ color: t.secondary, fontSize: '11px', lineHeight: 1.7, marginBottom: '8px' }}>
                  Ran your code somewhere and got an error? Paste the message here and EduBot will explain it in plain words.
                </div>
                <textarea
                  value={errorText}
                  onChange={e => setErrorText(e.target.value)}
                  placeholder="e.g. TypeError: Cannot read properties of undefined (reading 'length')"
                  rows={4}
                  style={{ width: '100%', boxSizing: 'border-box', background: t.bgSecondary, border: `1px solid ${t.border}`, color: t.primary, padding: '12px', fontFamily: t.font, fontSize: '12px', resize: 'vertical', outline: 'none' }}
                />
                <button
                  onClick={explainError}
                  disabled={explaining || !errorText.trim()}
                  style={{ marginTop: '8px', background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '10px 20px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', opacity: explaining || !errorText.trim() ? 0.5 : 1 }}
                >
                  {explaining ? `EXPLAINING${dots}` : '[ EXPLAIN ]'}
                </button>
                {errorExplanation && (
                  <div style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '16px 18px', marginTop: '12px' }}>
                    {([['WHAT IT MEANS', errorExplanation.meaning], ['LIKELY CAUSE', errorExplanation.cause], ['HOW TO FIX IT', errorExplanation.fix]] as const)
                      .filter(([, text]) => text && text.trim())
                      .map(([label, text]) => (
                        <div key={label} style={{ marginBottom: '10px' }}>
                          <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '2px', marginBottom: '4px' }}>{label}</div>
                          <div style={{ color: t.primary, fontSize: '12px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{text}</div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
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
