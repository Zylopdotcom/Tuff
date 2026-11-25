import { useState, useEffect } from 'react'
import { useTheme } from '../lib/ThemeContext'
import type { Language } from '../data/languages'
import { askAI, parseJson, clip } from '../lib/ai'

type Level = 'beginner' | 'junior'
type Stage = 'setup' | 'asking' | 'evaluating' | 'report'

type QuestionResult = { score: number; feedback: string; ideal: string }
type Report = { verdict: string; questions: QuestionResult[]; strengths: string[]; improve: string[] }

const QUESTION_COUNT = 5
const MAX_ANSWER_CHARS = 1200
const SKIPPED = "(The candidate said they don't know.)"

// Topics the interview may cover: the first two steps for beginners, the whole path for juniors.
function interviewTopics(path: Language, level: Level) {
  const steps = level === 'beginner' ? path.steps.slice(0, 2) : path.steps
  return steps.map(s => `${s.name}: ${s.levels.map(l => l.title).join(', ')}`).join('\n')
}

function systemPrompt(path: Language, level: Level) {
  const role = level === 'beginner'
    ? `a friendly interviewer checking a beginner's understanding of ${path.firstLanguage} fundamentals`
    : `an interviewer for a junior ${path.field} position (main language: ${path.firstLanguage})`
  return `You are ${role} on CodePath, a learning platform.
Ask only about these topics:
${interviewTopics(path, level)}
Every question must be answerable in a few sentences of text: explain a concept, predict what a short code snippet outputs, spot a bug, or describe how you would approach a small problem. Never ask the candidate to run code or write a long program.
Write plain text only (no markdown, asterisks or code fences). Put code on its own lines using \\n.
Always respond in the exact JSON format requested.`
}

export default function Interview({ path }: { path: Language }) {
  const { theme: t } = useTheme()
  const [stage, setStage] = useState<Stage>('setup')
  const [level, setLevel] = useState<Level>('beginner')
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<Report | null>(null)
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => clearInterval(interval)
  }, [loading])

  async function fetchQuestion(prevQuestions: string[], prevAnswers: string[]) {
    setLoading(true)
    setError('')
    const n = prevQuestions.length + 1
    const history = prevQuestions.length
      ? prevQuestions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${clip(prevAnswers[i], 400)}`).join('\n\n')
      : 'none yet'
    try {
      const raw = await askAI(systemPrompt(path, level), [{
        role: 'user',
        content: `Ask question ${n} of ${QUESTION_COUNT}.
Questions and answers so far:
${history}

- Cover a different topic from the earlier questions.
- If the candidate struggled or skipped, make this one a little easier; if they answered well, a little harder.
- Do not include the answer or hints in the question.

Respond ONLY with this JSON (no markdown, no backticks):
{"question": "..."}`,
      }], 300)
      const { question } = parseJson<{ question: string }>(raw)
      setQuestions([...prevQuestions, question])
    } catch {
      setError('[ ERROR ] Could not get the next question.')
    }
    setLoading(false)
  }

  function start() {
    setQuestions([])
    setAnswers([])
    setDraft('')
    setReport(null)
    setStage('asking')
    fetchQuestion([], [])
  }

  async function submit(answer: string) {
    if (loading) return
    const nextAnswers = [...answers, answer]
    setAnswers(nextAnswers)
    setDraft('')
    if (nextAnswers.length < QUESTION_COUNT) {
      fetchQuestion(questions, nextAnswers)
    } else {
      evaluate(questions, nextAnswers)
    }
  }

  async function evaluate(qs: string[], as: string[]) {
    setStage('evaluating')
    setLoading(true)
    setError('')
    const transcript = qs.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${clip(as[i], MAX_ANSWER_CHARS)}`).join('\n\n')
    try {
      const raw = await askAI(systemPrompt(path, level), [{
        role: 'user',
        content: `The interview is over. Evaluate each answer.
${transcript}

Scoring for each answer, out of 10: correctness up to 6, clarity up to 2, depth up to 2. A skipped answer scores 0.
Be fair to the candidate's level (${level === 'beginner' ? 'beginner' : 'junior developer'}) and encouraging, but honest.

Respond ONLY with this JSON (no markdown, no backticks), with exactly ${QUESTION_COUNT} items in "questions", in order:
{
  "verdict": "one sentence overall impression",
  "questions": [{"score": 0, "feedback": "1-2 sentences on this answer", "ideal": "a strong answer in 1-3 sentences"}],
  "strengths": ["up to 3 short points"],
  "improve": ["up to 3 short points"]
}`,
      }], 1000)
      setReport(parseJson<Report>(raw))
      setStage('report')
    } catch {
      setError('[ ERROR ] Could not evaluate the interview.')
    }
    setLoading(false)
  }

  // Computed here rather than by the model, which is unreliable at arithmetic.
  const scores = report ? questions.map((_, i) => {
    const s = Number(report.questions?.[i]?.score)
    return Number.isFinite(s) ? Math.max(0, Math.min(10, s)) : 0
  }) : []
  const overall = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 10)) * 100) : 0
  const scoreColor = (pct: number) => pct >= 70 ? '#00ff88' : pct >= 40 ? '#ffb02e' : '#ff6b6b'

  const button = (primary: boolean) => ({
    background: primary ? t.border : 'transparent',
    border: `1px solid ${primary ? t.primary : t.secondary}`,
    color: primary ? t.primary : t.secondary,
    padding: '12px 24px', fontFamily: t.font, fontSize: '12px', letterSpacing: '2px', cursor: 'pointer',
  })
  const label = { color: t.secondary, fontSize: '10px', letterSpacing: '2px', marginBottom: '6px' }
  const card = { background: t.bgSecondary, border: `1px solid ${t.border}`, padding: '18px 22px' }

  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{ color: t.secondary, fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>&gt;&gt; INTERVIEW</div>
      <div style={{ color: t.primary, fontSize: '24px', letterSpacing: '2px', marginBottom: '8px' }}>Mock Interview</div>
      <div style={{ color: t.secondary, fontSize: '12px', lineHeight: 1.8, marginBottom: '28px' }}>
        {QUESTION_COUNT} questions for the {path.field} path, one at a time. Answer in your own words; you get a scorecard at the end.
      </div>

      {stage === 'setup' && (
        <div>
          <div style={label}>CHOOSE A LEVEL</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {([
              ['beginner', 'BEGINNER', `Questions on the first steps of your path: ${path.steps.slice(0, 2).map(s => s.name).join(' and ')}.`],
              ['junior', 'JUNIOR DEVELOPER', `A realistic junior ${path.field} interview across your whole path.`],
            ] as const).map(([id, title, desc]) => (
              <div key={id} onClick={() => setLevel(id)}
                style={{ ...card, cursor: 'pointer', borderColor: level === id ? t.primary : t.border }}>
                <div style={{ color: level === id ? t.primary : t.secondary, fontSize: '13px', letterSpacing: '2px', marginBottom: '8px' }}>
                  {level === id ? '◉' : '○'} {title}
                </div>
                <div style={{ color: t.secondary, fontSize: '11px', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
          <button onClick={start} style={button(true)}>[ START INTERVIEW ] →</button>
        </div>
      )}

      {(stage === 'asking' || stage === 'evaluating') && (
        <div>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={card}>
                <div style={label}>QUESTION {i + 1}/{QUESTION_COUNT}</div>
                <div style={{ color: t.primary, fontSize: '13px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{q}</div>
              </div>
              {answers[i] !== undefined && (
                <div style={{ ...card, borderTop: 'none', background: t.bgTertiary }}>
                  <div style={label}>YOUR ANSWER</div>
                  <div style={{ color: t.secondary, fontSize: '12px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {answers[i] === SKIPPED ? "I don't know." : answers[i]}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ color: t.primary, fontSize: '12px', letterSpacing: '2px', margin: '16px 0' }}>
              {stage === 'evaluating' ? `INTERVIEWER IS SCORING YOUR ANSWERS${dots}` : `INTERVIEWER IS THINKING${dots}`}
            </div>
          )}

          {error && (
            <div style={{ color: '#ff4444', fontSize: '12px', letterSpacing: '1px', margin: '16px 0' }}>
              {error}{' '}
              <button
                onClick={() => stage === 'evaluating' ? evaluate(questions, answers) : fetchQuestion(questions, answers)}
                style={{ ...button(false), padding: '6px 14px', fontSize: '11px', marginLeft: '8px' }}
              >
                RETRY
              </button>
            </div>
          )}

          {stage === 'asking' && !loading && !error && questions.length > answers.length && (
            <div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="type your answer..."
                rows={5}
                style={{ width: '100%', boxSizing: 'border-box', background: t.bgSecondary, border: `1px solid ${t.borderSecondary}`, color: t.primary, caretColor: t.primary, padding: '14px', fontFamily: t.font, fontSize: '13px', lineHeight: 1.7, resize: 'vertical', outline: 'none', marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => draft.trim() && submit(draft.trim())} disabled={!draft.trim()}
                  style={{ ...button(true), opacity: draft.trim() ? 1 : 0.5 }}>
                  {answers.length + 1 < QUESTION_COUNT ? '[ SUBMIT ANSWER ] →' : '[ FINISH INTERVIEW ] →'}
                </button>
                <button onClick={() => submit(SKIPPED)} style={button(false)}>[ I DON'T KNOW ]</button>
              </div>
            </div>
          )}
        </div>
      )}

      {stage === 'report' && report && (
        <div>
          <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ color: scoreColor(overall), fontSize: '44px', letterSpacing: '2px' }}>{overall}%</div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={label}>OVERALL · {level === 'beginner' ? 'BEGINNER' : 'JUNIOR DEVELOPER'}</div>
              <div style={{ color: t.primary, fontSize: '13px', lineHeight: 1.8 }}>{report.verdict}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {([['STRENGTHS', report.strengths, '#00ff88'], ['TO IMPROVE', report.improve, '#ffb02e']] as const).map(([title, items, color]) => (
              <div key={title} style={card}>
                <div style={{ ...label, color }}>{title}</div>
                {(items || []).map((s, i) => (
                  <div key={i} style={{ color: t.primary, fontSize: '12px', lineHeight: 1.8 }}>&gt; {s}</div>
                ))}
              </div>
            ))}
          </div>

          {questions.map((q, i) => {
            const r = report.questions?.[i]
            return (
              <div key={i} style={{ ...card, marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={label}>QUESTION {i + 1}</div>
                  <div style={{ color: scoreColor(scores[i] * 10), fontSize: '12px', letterSpacing: '1px' }}>{scores[i]}/10</div>
                </div>
                <div style={{ color: t.primary, fontSize: '12px', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{q}</div>
                <div style={label}>YOUR ANSWER</div>
                <div style={{ color: t.secondary, fontSize: '12px', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
                  {answers[i] === SKIPPED ? "I don't know." : answers[i]}
                </div>
                {r?.feedback && (<><div style={label}>FEEDBACK</div><div style={{ color: t.primary, fontSize: '12px', lineHeight: 1.8, marginBottom: '10px' }}>{r.feedback}</div></>)}
                {r?.ideal && (<><div style={label}>A STRONG ANSWER</div><div style={{ color: t.primary, fontSize: '12px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{r.ideal}</div></>)}
              </div>
            )
          })}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button onClick={start} style={button(true)}>[ NEW INTERVIEW ] →</button>
            <button onClick={() => setStage('setup')} style={button(false)}>[ CHANGE LEVEL ]</button>
          </div>
        </div>
      )}
    </div>
  )
}
