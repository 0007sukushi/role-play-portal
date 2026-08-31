const MODEL = 'gemini-3.6-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export async function callGemini({ apiKey, systemPrompt, contents, temperature = 0.9 }) {
  if (!apiKey) throw new Error('Add your Gemini API key in the header to start the call.')

  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature, maxOutputTokens: 2048 },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    let message = body
    try {
      message = JSON.parse(body)?.error?.message ?? body
    } catch {
      /* keep raw body */
    }
    throw new Error(`Gemini API error (${res.status}): ${message}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('') ?? ''
  if (!text.trim()) throw new Error('Gemini returned an empty response.')
  return text.trim()
}

export function transcriptToContents(transcript) {
  return transcript.map((entry) => ({
    role: entry.role === 'rep' ? 'user' : 'model',
    parts: [{ text: entry.text }],
  }))
}

export function parseJsonResponse(raw) {
  const cleaned = raw
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Could not parse the scorecard response.')
  return JSON.parse(cleaned.slice(start, end + 1))
}
