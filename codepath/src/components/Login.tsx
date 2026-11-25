import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthShell, Field, Message, GoogleButton, Divider } from './AuthUi'
import { primaryButton, secondaryButton, friendlyAuthError } from '../lib/auth'

type Props = {
  initialError?: string
  onBack: () => void
}

export default function Login({ initialError = '', onBack }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError)
  const [info, setInfo] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email.trim() || !password) {
      setError('[ ERROR ] Email and password required.')
      return
    }
    setLoading(true)
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (loginError) setError(friendlyAuthError(loginError.message))
    // On success, App notices the sign-in and opens the dashboard.
  }

  async function handleForgot() {
    setError('')
    setInfo('')
    if (!email.trim()) {
      setError('[ ERROR ] Type your email above first, then click "Forgot password?".')
      return
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin })
    if (resetError) setError(friendlyAuthError(resetError.message))
    else setInfo(`>> If an account exists for ${email.trim()}, a password reset link is on its way.`)
  }

  return (
    <AuthShell kicker="RETURNING USER" title="LOGIN" subtitle="Sign in to continue your path">
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Field label="EMAIL" placeholder="your@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        <Field label="PASSWORD" placeholder="your password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
        <div style={{ textAlign: 'right', marginTop: '-6px' }}>
          <button type="button" className="cp-link" onClick={handleForgot}>Forgot password?</button>
        </div>
        {error && <Message kind="error">{error}</Message>}
        {info && <Message kind="info">{info}</Message>}
        <button type="submit" disabled={loading} style={primaryButton(loading)}>
          {loading ? 'SCANNING...' : '[ ACCESS_CODEPATH ]'}
        </button>
      </form>
      <Divider />
      <GoogleButton onError={setError} />
      <button onClick={onBack} style={secondaryButton}>[ BACK ]</button>
    </AuthShell>
  )
}
