import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { resolvePath } from '../data/languages'
import { savePending } from '../lib/profile'
import { AuthShell, Field, Message, GoogleButton, Divider } from './AuthUi'
import { primaryButton, secondaryButton, friendlyAuthError } from '../lib/auth'

type Props = {
  language: string
  onLogin: () => void
}

const MIN_PASSWORD = 8

export default function Signup({ language, onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!username.trim() || !email.trim() || !password) {
      setError('[ ERROR ] All fields required.')
      return
    }
    if (password.length < MIN_PASSWORD) {
      setError(`[ ERROR ] Password must be at least ${MIN_PASSWORD} characters.`)
      return
    }
    setLoading(true)
    // Kept until the profile is created, which may happen after the user confirms their email.
    savePending({ language, username: username.trim() })
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { username: username.trim() }, emailRedirectTo: window.location.origin },
    })
    setLoading(false)
    if (signUpError) {
      setError(friendlyAuthError(signUpError.message))
      return
    }
    if (!data.session) {
      // Email confirmation is on: the account becomes active once the link is clicked.
      setInfo(`>> Almost there! We sent a confirmation link to ${email.trim()}. Open it to activate your account.`)
    }
    // With a session, App notices the sign-in and creates the profile.
  }

  return (
    <AuthShell
      kicker="ALMOST THERE"
      title="CREATE_PROFILE"
      subtitle={<>Path selected: <span style={{ color: '#00fff7' }}>[{resolvePath(language).field.toUpperCase()}]</span></>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Field label="USERNAME" placeholder="what should we call you?" value={username} onChange={e => setUsername(e.target.value)} autoComplete="nickname" />
        <Field label="EMAIL" placeholder="your@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        <Field label="PASSWORD" placeholder={`at least ${MIN_PASSWORD} characters`} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
        {error && <Message kind="error">{error}</Message>}
        {info && <Message kind="info">{info}</Message>}
        <button type="submit" disabled={loading} style={primaryButton(loading)}>
          {loading ? 'CREATING...' : '[ ENTER_CODEPATH ]'}
        </button>
      </form>
      <Divider />
      <GoogleButton onError={setError} beforeRedirect={() => savePending({ language })} />
      <button onClick={onLogin} style={secondaryButton}>[ I ALREADY HAVE AN ACCOUNT ]</button>
    </AuthShell>
  )
}
