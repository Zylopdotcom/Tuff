import { useState, useEffect, useRef } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Props = {
  onBack: () => void
  onComplete: (language: string) => void
}

const SYSTEM_PROMPT = `You are EduBot, a robotic terminal AI. Your ONLY job is to ask 4 questions then output a VERDICT.

STRICT RULES:
- Ask ONE question at a time, keep it short
- Use terminal style: >> and [ ]
- After question 4 is answered, output your final message
- Your final message MUST have VERDICT:JavaScript or VERDICT:Python or VERDICT:Swift or VERDICT:C# as the absolute last line
- Nothing comes after the VERDICT line. Ever.

Ask these 4 questions in order:
1. What do you want to build?
2. Math and logic, or creative and visual?
3. Job, freelance, or hobby?
4. Hours per week you can study?

After 4th answer, respond like this example (replace language):
>> SCANNING COMPLETE.
[ 1,247 PROFILES ANALYZED ]
[ RESULT LOCKED ]

JavaScript is your language. You want websites and you learn by doing — this is the only logical choice. Every second you waste on other languages is time stolen from your future.

Type anything to accept your destiny.
VERDICT:JavaScript`

function detectVerdict(text: string): string | null {
  const match = text.match(/VERDICT:(JavaScript|Python|Swift|C#)/)
  return match ? match[1] : null
}

function cleanMessage(text: string): string {
  return text.replace(/VERDICT:(JavaScript|Python|Swift|C#)/, '').trim()
}

export default function ChatBot({ onBack, onComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dots, setDots] = useState('')
  const [verdict, setVerdict] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { sendToAI([]) }, [])

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
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: history.length === 0
            ? [{ role: 'user', content: 'Start by greeting me with a cool terminal boot-up sequence, then ask your first question.' }]
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
    if (!input.trim() || loading) return

    if (verdict) {
      onComplete(verdict)
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
        .cp-cursor { display:inline-block; width:9px; height:16px; background:#00fff7; animation:blink 1s infinite; vertical-align:middle; margin-left:3px; }
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

        {verdict && !loading && (
          <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #00fff744', color: '#00fff7', fontSize: '12px', letterSpacing: '2px', animation: 'blink 2s infinite' }}>
            &gt;&gt; TYPE ANYTHING OR PRESS ENTER TO ACCEPT YOUR PATH
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
            placeholder={verdict ? 'press enter to accept your path...' : 'type your response...'}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#00fff7', fontFamily: "'Share Tech Mono',monospace", fontSize: '13px', padding: '14px 0', letterSpacing: '1px' }}
          />
          <span className="cp-cursor" />
        </div>
        <button
          onClick={handleSend}
          disabled={loading || (!verdict && !input.trim())}
          style={{ background: verdict ? '#00fff720' : 'transparent', border: '1px solid #00fff7', color: '#00fff7', padding: '0 24px', fontFamily: "'Share Tech Mono',monospace", fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', opacity: loading ? 0.4 : 1 }}
        >
          {verdict ? '[ ACCEPT ]' : '[ SEND ]'}
        </button>
      </div>
    </div>
  )
}
