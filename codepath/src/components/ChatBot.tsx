import { useState, useEffect, useRef } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Props = {
  onBack: () => void
}

const SYSTEM_PROMPT = `You are EduBot, a terminal-style AI guide that helps students find the perfect programming language to learn. You have a cool, slightly robotic but friendly personality. You speak in short punchy sentences. You sometimes use terminal-style formatting like >> or [ ] around key words.

Your goal is to recommend one of these languages: JavaScript, Python, Swift, or C#/Unity.

Ask the student questions ONE AT A TIME to understand:
1. What they want to build (websites, games, mobile apps, data/AI)
2. Their experience level
3. Their career goals
4. Their learning style

After 4-5 messages, make a confident recommendation with a brief reason why. Then offer to show them a learning roadmap.

Keep responses SHORT — max 3 sentences. Never ask more than one question at a time.`

export default function ChatBot({ onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dots, setDots] = useState('')
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
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: history.length === 0
            ? [{ role: 'user', content: 'Start the conversation by greeting me and asking your first question.' }]
            : history,
        }),
      })
      const data = await response.json()
      const reply = data.content[0].text
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '[ ERROR ] Connection failed. Please try again.' }])
    }
    setLoading(false)
  }

  async function handleSend() {
    if (!input.trim() || loading) return
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
            <div style={{ background: msg.role === 'user' ? '#0a1f2e' : '#071219', border: `1px solid ${msg.role === 'user' ? '#4af4' : '#00fff722'}`, color: msg.role === 'user' ? '#4af' : '#00fff7', padding: '14px 18px', fontSize: '13px', lineHeight: 1.8, maxWidth: '70%', whiteSpace: 'pre-wrap' }}>
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
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '24px 48px', borderTop: '1px solid #00fff722', display: 'flex', gap: '12px', flexShrink: 0 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #00fff744', padding: '0 16px', background: '#071219' }}>
          <span style={{ color: '#00fff766', fontSize: '13px', marginRight: '8px' }}>&gt;&gt;</span>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="type your response..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#00fff7', fontFamily: "'Share Tech Mono',monospace", fontSize: '13px', padding: '14px 0', letterSpacing: '1px' }} />
          <span className="cp-cursor" />
        </div>
        <button onClick={handleSend} disabled={loading || !input.trim()} style={{ background: 'transparent', border: '1px solid #00fff7', color: '#00fff7', padding: '0 24px', fontFamily: "'Share Tech Mono',monospace", fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', opacity: loading || !input.trim() ? 0.4 : 1 }}>
          [ SEND ]
        </button>
      </div>
    </div>
  )
}