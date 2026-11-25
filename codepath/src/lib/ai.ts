// Shared helpers for talking to the AI through the /api/chat proxy.

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function askAI(system: string, messages: ChatMessage[], maxTokens: number): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ max_tokens: maxTokens, system, messages }),
  })
  if (!response.ok) throw new Error(`AI request failed (${response.status})`)
  const data = await response.json()
  const text = data?.content?.[0]?.text
  if (typeof text !== 'string') throw new Error('Unexpected AI response')
  return text
}

// The model sometimes wraps JSON in code fences or adds a sentence around it.
export function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/```json|```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object in reply')
  return JSON.parse(cleaned.slice(start, end + 1)) as T
}

export function clip(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '\n[...truncated]' : text
}
