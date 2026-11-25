// Shared styles and helpers for the signup, login and password reset screens.

export const authFont = "'Share Tech Mono', monospace"

export const primaryButton = (busy: boolean) => ({
  background: 'transparent', border: '1px solid #00fff7', color: '#00fff7', padding: '14px', fontFamily: authFont,
  fontSize: '13px', letterSpacing: '3px', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.5 : 1,
})

export const secondaryButton = {
  background: 'transparent', border: '1px solid #4af5', color: '#4af', padding: '12px', fontFamily: authFont,
  fontSize: '12px', letterSpacing: '2px', cursor: 'pointer',
}

// Turns Supabase's auth errors into plain messages.
export function friendlyAuthError(message: string) {
  if (/invalid login credentials/i.test(message)) return '[ ERROR ] Wrong email or password.'
  if (/email not confirmed/i.test(message)) return '[ ERROR ] Please confirm your email first; check your inbox for the link.'
  if (/already registered|already been registered/i.test(message)) return '[ ERROR ] An account with this email already exists. Log in instead.'
  if (/password should be at least/i.test(message)) return `[ ERROR ] ${message}`
  if (/rate limit|too many/i.test(message)) return '[ ERROR ] Too many attempts. Please wait a minute and try again.'
  return `[ ERROR ] ${message}`
}
