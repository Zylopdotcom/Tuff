import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { authFont, secondaryButton } from '../lib/auth'

// Shared look and pieces for the signup, login and password reset screens.

export function AuthShell({ kicker, title, subtitle, children }: { kicker: string; title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ background: '#050d12', minHeight: '100vh', fontFamily: authFont, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cp-cursor { display:inline-block; width:9px; height:16px; background:#00fff7; animation:blink 1s infinite; vertical-align:middle; margin-left:3px; }
        .cp-input { width:100%; background:#071219; border:1px solid #00fff733; color:#00fff7; caret-color:#00fff7; padding:14px 16px; font-family:${authFont}; font-size:13px; outline:none; letter-spacing:1px; box-sizing:border-box; }
        .cp-input:focus { border-color:#00fff7; }
        .cp-input::placeholder { color:#00fff744; }
        .cp-link { background:none; border:none; padding:0; color:#4af; font-family:${authFont}; font-size:11px; letter-spacing:1px; cursor:pointer; text-decoration:underline; }
      `}</style>
      <div style={{ width: '100%', maxWidth: '480px', padding: '0 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ color: '#00fff799', fontSize: '11px', letterSpacing: '4px', marginBottom: '12px' }}>&gt;&gt; {kicker}</div>
          <div style={{ color: '#00fff7', fontSize: '28px', letterSpacing: '3px' }}>{title}<span className="cp-cursor" /></div>
          {subtitle && <div style={{ color: '#4af8', fontSize: '12px', marginTop: '8px', letterSpacing: '1px', lineHeight: 1.7 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, ...input }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ color: '#4af7', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>{label}</div>
      <input className="cp-input" {...input} />
    </label>
  )
}

export function Message({ kind, children }: { kind: 'error' | 'info'; children: ReactNode }) {
  const color = kind === 'error' ? '#ff4444' : '#00ff88'
  return <div role={kind === 'error' ? 'alert' : 'status'} style={{ color, fontSize: '12px', letterSpacing: '1px', lineHeight: 1.7 }}>{children}</div>
}


export function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4af7', fontSize: '10px', letterSpacing: '2px' }}>
      <div style={{ flex: 1, height: '1px', background: '#00fff722' }} /> OR <div style={{ flex: 1, height: '1px', background: '#00fff722' }} />
    </div>
  )
}

// Supabase publishes which sign-in providers are switched on.
async function googleEnabled() {
  try {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
    })
    const settings = await res.json()
    return settings?.external?.google === true
  } catch {
    return true // If the check itself fails, try anyway rather than block the user.
  }
}

// Google sign-in leaves the page and comes back signed in; App then finishes the signup.
export function GoogleButton({ onError, beforeRedirect }: { onError: (msg: string) => void; beforeRedirect?: () => void }) {
  async function go() {
    // Without this check, a disabled provider sends the user to a raw Supabase error page.
    if (!(await googleEnabled())) {
      onError('[ ERROR ] Google sign-in is not set up yet. Use email and password for now.')
      return
    }
    beforeRedirect?.()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      onError(/provider is not enabled/i.test(error.message)
        ? '[ ERROR ] Google sign-in is not set up yet. Use email and password for now.'
        : `[ ERROR ] ${error.message}`)
    }
  }
  return (
    <button onClick={go} type="button" style={{ ...secondaryButton, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#e8f4ff', borderColor: '#e8f4ff55' }}>
      <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 38.2 44 33 44 24c0-1.3-.1-2.4-.4-3.5z"/>
      </svg>
      CONTINUE WITH GOOGLE
    </button>
  )
}

