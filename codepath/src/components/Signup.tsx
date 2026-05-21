import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Props = {
  language: string
  onComplete: (user: { username: string; email: string; language: string }) => void
}

export default function Signup({ language, onComplete }: Props) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!username.trim() || !email.trim()) {
      setError('[ ERROR ] All fields required.')
      return
    }
    setLoading(true)
    setError('')
    const { error: dbError } = await supabase
      .from('users')
      .insert([{ username: username.trim(), email: email.trim(), language }])

    if (dbError) {
      setError(`[ ERROR ] ${dbError.message}`)
      setLoading(false)
      return
    }

    onComplete({ username: username.trim(), email: email.trim(), language })
    setLoading(false)
  }

  return (
    <div style={{ background: '#050d12', minHeight: '100vh', fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cp-cursor { display:inline-block; width:9px; height:16px; background:#00fff7; animation:blink 1s infinite; vertical-align:middle; margin-left:3px; }
        .cp-input { width:100%; background:#071219; border:1px solid #00fff733; color:#00fff7; padding:14px 16px; font-family:'Share Tech Mono',monospace; font-size:13px; outline:none; letter-spacing:1px; box-sizing:border-box; }
        .cp-input:focus { border-color:#00fff7; }
        .cp-input::placeholder { color:#00fff744; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '480px', padding: '0 24px' }}>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ color: '#00fff799', fontSize: '11px', letterSpacing: '4px', marginBottom: '12px' }}>&gt;&gt; ALMOST THERE</div>
          <div style={{ color: '#00fff7', fontSize: '28px', letterSpacing: '3px' }}>CREATE_PROFILE<span className="cp-cursor" /></div>
          <div style={{ color: '#4af8', fontSize: '12px', marginTop: '8px', letterSpacing: '1px' }}>
            Language selected: <span style={{ color: '#00fff7' }}>[{language.toUpperCase()}]</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ color: '#4af7', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>USERNAME</div>
            <input
              className="cp-input"
              placeholder="what should we call you?"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <div style={{ color: '#4af7', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>EMAIL</div>
            <input
              className="cp-input"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: '#ff4444', fontSize: '12px', letterSpacing: '1px' }}>{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: 'transparent', border: '1px solid #00fff7', color: '#00fff7', padding: '14px', fontFamily: "'Share Tech Mono',monospace", fontSize: '13px', letterSpacing: '3px', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'SAVING...' : '[ ENTER_CODEPATH ]'}
          </button>
        </div>

      </div>
    </div>
  )
}