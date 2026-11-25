import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthShell, Field, Message } from './AuthUi'
import { primaryButton, friendlyAuthError } from '../lib/auth'

const MIN_PASSWORD = 8

// Shown after the user opens a password reset link from their email.
export default function ResetPassword({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < MIN_PASSWORD) {
      setError(`[ ERROR ] Password must be at least ${MIN_PASSWORD} characters.`)
      return
    }
    if (password !== confirm) {
      setError('[ ERROR ] The two passwords do not match.')
      return
    }
    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updateError) setError(friendlyAuthError(updateError.message))
    else onDone()
  }

  return (
    <AuthShell kicker="ACCOUNT RECOVERY" title="NEW_PASSWORD" subtitle="Choose a new password for your account">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Field label="NEW PASSWORD" type="password" placeholder={`at least ${MIN_PASSWORD} characters`} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
        <Field label="CONFIRM PASSWORD" type="password" placeholder="type it again" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
        {error && <Message kind="error">{error}</Message>}
        <button type="submit" disabled={loading} style={primaryButton(loading)}>
          {loading ? 'SAVING...' : '[ SAVE_PASSWORD ]'}
        </button>
      </form>
    </AuthShell>
  )
}
