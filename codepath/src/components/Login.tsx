import { useState } from 'react'
import { supabase } from '../lib/supabase'

type User = {
  username: string
  email: string
  language: string
  avatar_url?: string
  streak?: number
  last_login?: string
  login_dates?: string[]
}

type Props = {
  onBack: () => void
  onComplete: (user: User) => void
}

export default function Login({ onBack, onComplete }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email.trim()) {
      setError('[ ERROR ] Email required.')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.trim())
      .single()

    if (dbError || !data) {
      setError('[ ERROR ] No account found with that email.')
      setLoading(false)
      return
    }

    console.log('[Login] supabase user row:', data)
    onComplete({username: data.username,email: data.email,language: data.language,avatar_url: data.avatar_url || '',streak: data.streak || 0,last_login: data.last_login || '',login_dates: data.login_dates || [],})
    setLoading(false)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleLogin()
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
          <div style={{ color: '#00fff799', fontSize: '11px', letterSpacing: '4px', marginBottom: '12px' }}>&gt;&gt; RETURNING USER</div>
          <div style={{ color: '#00fff7', fontSize: '28px', letterSpacing: '3px' }}>LOGIN<span className="cp-cursor" /></div>
          <div style={{ color: '#4af8', fontSize: '12px', marginTop: '8px', letterSpacing: '1px' }}>Enter your email to access your path</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ color: '#4af7', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>EMAIL</div>
            <input
              className="cp-input"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          {error && (
            <div style={{ color: '#ff4444', fontSize: '12px', letterSpacing: '1px' }}>{error}</div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ background: 'transparent', border: '1px solid #00fff7', color: '#00fff7', padding: '14px', fontFamily: "'Share Tech Mono',monospace", fontSize: '13px', letterSpacing: '3px', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'SCANNING...' : '[ ACCESS_CODEPATH ]'}
          </button>

          <button
            onClick={onBack}
            style={{ background: 'transparent', border: '1px solid #4af5', color: '#4af', padding: '12px', fontFamily: "'Share Tech Mono',monospace", fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}
          >
            [ BACK ]
          </button>
        </div>
      </div>
    </div>
  )
}