// Proxy between the CodePath frontend and the Anthropic API.
//
// The API key lives only on the server, so this endpoint must not become a free
// general-purpose Claude endpoint for anyone who finds the URL. It only accepts
// requests shaped like the ones the app sends, and caps their size and cost.

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_OUTPUT_TOKENS = 1000
// EduBot asks up to 7 questions, but people can keep discussing after the verdict.
const MAX_MESSAGES = 50
const MAX_MESSAGE_CHARS = 12000
const MAX_SYSTEM_CHARS = 12000
const MAX_TOTAL_CHARS = 60000

function validate(body) {
  if (!body || typeof body !== 'object') return 'Invalid request body'

  const { max_tokens, system, messages } = body

  if (!Number.isInteger(max_tokens) || max_tokens < 1 || max_tokens > MAX_OUTPUT_TOKENS) {
    return `max_tokens must be between 1 and ${MAX_OUTPUT_TOKENS}`
  }
  if (typeof system !== 'string' || system.length > MAX_SYSTEM_CHARS) {
    return 'Invalid system prompt'
  }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return `Between 1 and ${MAX_MESSAGES} messages are allowed`
  }

  let total = system.length
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return 'Invalid message role'
    // Plain text only: no images, documents or tool use.
    if (typeof m.content !== 'string' || m.content.length === 0 || m.content.length > MAX_MESSAGE_CHARS) {
      return 'Invalid message content'
    }
    total += m.content.length
  }
  if (total > MAX_TOTAL_CHARS) return 'Request too large'
  // Note: EduBot's history starts with its own greeting, so the first message
  // can be from the assistant. Anthropic accepts that; don't reject it here.

  return null
}

// Browsers always send an Origin header on POST. Requiring it to match the host
// blocks other websites from using this endpoint through their visitors'
// browsers. Scripts can fake the header, so this is a filter, not a lock;
// the size caps above and the firewall rate limit do the rest.
function isSameOrigin(req) {
  const origin = req.headers.origin
  const host = req.headers['x-forwarded-host'] || req.headers.host
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const problem = validate(req.body)
  if (problem) {
    return res.status(400).json({ error: problem })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set')
    return res.status(500).json({ error: 'Server is not configured' })
  }

  // Rebuild the request from validated fields only, so callers cannot pick a
  // different model or pass extra options such as tools.
  const { max_tokens, system, messages } = req.body
  const payload = {
    model: MODEL,
    max_tokens,
    system,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Anthropic API error:', response.status, data?.error?.type)
      return res.status(502).json({ error: 'AI request failed' })
    }

    // Send back only what the app reads.
    return res.status(200).json({ content: data.content, stop_reason: data.stop_reason })
  } catch (err) {
    console.error('Anthropic proxy error:', err)
    return res.status(500).json({ error: 'Failed to reach Anthropic API' })
  }
}
