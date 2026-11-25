import { useState, useEffect, useRef } from 'react'
import { languages } from '../data/languages'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Props = {
  onBack: () => void
  onComplete: (language: string) => void
}

const pathIds = Object.keys(languages)

const PATH_LIST = Object.values(languages)
  .map(p => `- ${p.id} | field: ${p.field} | first language: ${p.firstLanguage} | ${p.desc}`)
  .join('\n')

const SYSTEM_PROMPT = `You are EduBot, a guide for people who want to get into computer science but have no idea where to start. Through a short conversation you find the FIELD that fits this person, then the first language for that field, and you explain why.

The only paths you can assign (id | field | first language | description):
${PATH_LIST}

HOW TO TALK:
- One short question at a time. Plain words. The person may know nothing about programming, so never use a technical term without explaining it in a few words.
- Terminal style: start lines with >> and put labels in [ ].
- Plain text only. The chat cannot render markdown, so never use asterisks, code fences (\`\`\`), headings (#) or bullet symbols other than "-".
- Start with a short boot-up line, then ask what they would love to make, or what made them curious about computers.
- Adapt every next question to what they just said. Over the conversation, find out: what excites them, how they like to work (visual and creative, logic and math, or taking things apart to see how they work), their goal (job, freelance, university, hobby), what computer they have, and how many hours a week they can study.
- If they say "I don't know", do not push. Describe 3 or 4 concrete things people build in different fields and ask which sounds most fun.
- Ask 4 to 6 questions. Stop as soon as you are confident. Never ask more than 7.
- Only assign swift if they have access to a Mac. If they want phone apps and have no Mac, assign kotlin.
- Never invent statistics or numbers.

WHEN YOU HAVE DECIDED, send a final message in exactly this shape:
>> ANALYSIS COMPLETE.
[ YOUR FIELD: <field> ]
[ START WITH: <first language> ]

WHY THIS FITS YOU:
- two or three short points, each one tied to something the person actually said

WHAT TO IGNORE FOR NOW:
one sentence naming one or two other fields or languages they may be tempted by, and why those can wait

VERDICT:<id>

RULES FOR THE VERDICT:
- The VERDICT line is the absolute last line and <id> is exactly one of: ${pathIds.join(', ')}
- Be decisive: one path. Never answer "it depends".
- After the verdict the person may ask questions or disagree. Answer honestly and briefly. If what they say changes the fit, send a new final message with the new VERDICT. If it does not, end your answer with the same VERDICT line again.`

const VERDICT_RE = new RegExp(`VERDICT:\\s*(${pathIds.join('|')})\\b`, 'i')

function detectVerdict(text: string): string | null {
  const match = text.match(VERDICT_RE)
  return match ? match[1].toLowerCase() : null
}

// The chat shows plain text, so markdown the model adds anyway would appear as raw symbols.
function cleanMessage(text: string): string {
  return text
    .replace(VERDICT_RE, '')
    .replace(/^\s*```[a-z]*\s*$/gim, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function ChatBot({ onBack, onComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dots, setDots] = useState('')
  const [verdict, setVerdict] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const path = verdict ? languages[verdict] : null

  // StrictMode runs effects twice in development; without this guard EduBot greets twice.
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    sendToAI([])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [loading])

  async function sendToAI(history: Message[]) {
    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 800,
          system: SYSTEM_PROMPT,
          messages: history.length === 0
            ? [{ role: 'user', content: 'Start with a short terminal boot-up line, then ask your first question.' }]
            : history,
        }),
      })
      const data = await response.json()
      const reply = data.content[0].text
      const found = detectVerdict(reply)
      if (found) setVerdict(found)
      setMessages(prev => [...prev, { role: 'assistant', content: cleanMessage(reply) }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '[ ERROR ] Connection failed. Please try again.' }])
    }
    setLoading(false)
  }

  async function handleSend() {
    if (loading) return

    if (!input.trim()) {
      if (verdict) onComplete(verdict)
      return
    }

    const userMsg: Message = { role: 'user', content: input.trim() }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')
    await sendToAI(newHistory)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div style={{ background: '#050d12', minHeight: '100vh', fontFamily: "'Share Tech Mono', monospace", display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050d12; }
        ::-webkit-scrollbar-thumb { background: #00fff733; }
      `}</style>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #00fff722', flexShrink: 0 }}>
        <div style={{ color: '#00fff7', fontSize: '17px', letterSpacing: '3px' }}>
          CODE_PATH <span style={{ color: '#4af', fontSize: '12px' }}>// EduBot</span>
        </div>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #4af6', color: '#4af', padding: '8px 20px', fontFamily: "'Share Tech Mono',monospace", fontSize: '11px', letterSpacing: '2px', cursor: 'pointer' }}>
          [ BACK ]
        </button>
      </nav>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ color: msg.role === 'user' ? '#4af6' : '#00fff766', fontSize: '10px', letterSpacing: '2px' }}>
              {msg.role === 'user' ? '[ YOU ]' : '[ EDUBOT ]'}
            </div>
            <div style={{
              background: msg.role === 'user' ? '#0a1f2e' : '#071219',
              border: `1px solid ${msg.role === 'user' ? '#4af4' : '#00fff722'}`,
              color: msg.role === 'user' ? '#4af' : '#00fff7',
              padding: '14px 18px',
              fontSize: '13px',
              lineHeight: 1.8,
              maxWidth: '70%',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
            <div style={{ color: '#00fff766', fontSize: '10px', letterSpacing: '2px' }}>[ EDUBOT ]</div>
            <div style={{ background: '#071219', border: '1px solid #00fff722', color: '#00fff7', padding: '14px 18px', fontSize: '13px' }}>
              THINKING{dots}
            </div>
          </div>
        )}

        {path && !loading && (
          <div style={{ border: '1px solid #00fff766', background: '#071219', padding: '24px', maxWidth: '720px', width: '100%', alignSelf: 'center' }}>
            <div style={{ color: '#4af', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>[ YOUR PATH ]</div>
            <div style={{ color: '#00fff7', fontSize: '24px', letterSpacing: '3px', marginBottom: '6px' }}>{path.emoji} {path.field.toUpperCase()}</div>
            <div style={{ color: '#4af', fontSize: '12px', letterSpacing: '1px', marginBottom: '20px' }}>
              First language: <span style={{ color: '#00fff7' }}>{path.firstLanguage}</span>
            </div>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ flex: '1 1 240px' }}>
                <div style={{ color: '#4af', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>YOU WILL BE ABLE TO BUILD</div>
                {path.builds.map(b => (
                  <div key={b} style={{ color: '#00fff7', fontSize: '12px', lineHeight: 1.9 }}>&gt; {b}</div>
                ))}
              </div>
              <div style={{ flex: '1 1 240px' }}>
                <div style={{ color: '#4af', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>WHERE IT CAN LEAD</div>
                {path.careers.map(c => (
                  <div key={c} style={{ color: '#00fff7', fontSize: '12px', lineHeight: 1.9 }}>&gt; {c}</div>
                ))}
              </div>
            </div>

            <div style={{ color: '#4af', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>YOUR ROADMAP</div>
            {path.steps.map((step, i) => (
              <div key={step.name} style={{ color: '#00fff7', fontSize: '12px', lineHeight: 1.9 }}>
                <span style={{ color: '#4af' }}>{String(i + 1).padStart(2, '0')}</span> {step.name} <span style={{ color: '#4af' }}>// {step.detail}</span>
              </div>
            ))}

            <button
              onClick={() => verdict && onComplete(verdict)}
              style={{ marginTop: '24px', width: '100%', background: '#00fff720', border: '1px solid #00fff7', color: '#00fff7', padding: '14px', fontFamily: "'Share Tech Mono',monospace", fontSize: '13px', letterSpacing: '3px', cursor: 'pointer' }}
            >
              [ ACCEPT THIS PATH ]
            </button>
            <div style={{ color: '#4af', fontSize: '11px', letterSpacing: '1px', marginTop: '12px', textAlign: 'center' }}>
              Not convinced? Tell EduBot why below and it will reconsider.
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '24px 48px', borderTop: '1px solid #00fff722', display: 'flex', gap: '12px', flexShrink: 0 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: `1px solid ${verdict ? '#00fff7' : '#00fff744'}`, padding: '0 16px', background: '#071219', transition: 'border-color 0.3s' }}>
          <span style={{ color: '#00fff766', fontSize: '13px', marginRight: '8px' }}>&gt;&gt;</span>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={verdict ? 'ask a question or disagree, or press enter to accept...' : 'type your response...'}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#00fff7', caretColor: '#00fff7', fontFamily: "'Share Tech Mono',monospace", fontSize: '13px', padding: '14px 0', letterSpacing: '1px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={loading || (!verdict && !input.trim())}
          style={{ background: verdict ? '#00fff720' : 'transparent', border: '1px solid #00fff7', color: '#00fff7', padding: '0 24px', fontFamily: "'Share Tech Mono',monospace", fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', opacity: loading ? 0.4 : 1 }}
        >
          {verdict && !input.trim() ? '[ ACCEPT ]' : '[ SEND ]'}
        </button>
      </div>
    </div>
  )
}
