export const PRIMARY_MODEL = 'gemini-3.6-flash'
export const FALLBACK_MODEL = 'gemini-3.5-flash-lite'

const MAX_ATTEMPTS = 2
const BASE_DELAY_MS = 500
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504])

const endpoint = (model) => {
  const modelPath = model.startsWith('models/') ? model : `models/${model}`
  return `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function requestModel({ model, apiKey, systemPrompt, contents, temperature }) {
  const res = await fetch(`${endpoint(model)}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { 
        temperature, 
        maxOutputTokens: 512 // Reduced output window speeds up response latency
      },
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
    const err = new Error(`Gemini API error (${res.status}) on ${model}: ${message}`)
    err.status = res.status
    err.retryable = RETRYABLE_STATUS.has(res.status)
    throw err
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('') ?? ''
  if (!text.trim()) throw new Error('Gemini returned an empty response.')
  return text.trim()
}

export async function callGemini({ apiKey, systemPrompt, contents, temperature = 0.7, onNotice }) {
  if (!apiKey) throw new Error('Add your Gemini API key in the header to start the call.')

  let lastError
  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        const text = await requestModel({ model, apiKey, systemPrompt, contents, temperature })
        if (model !== PRIMARY_MODEL) onNotice?.(`${PRIMARY_MODEL} busy — failover to ${model}.`)
        return text
      } catch (err) {
        lastError = err
        
        // On 429 rate limit, break immediately to fallback model instead of freezing UI
        if (err.status === 429 && model === PRIMARY_MODEL) {
          onNotice?.(`Rate limit hit on ${PRIMARY_MODEL}. Instant switching to ${FALLBACK_MODEL}…`)
          break
        }

        if (!err.retryable) throw err
        if (attempt < MAX_ATTEMPTS - 1) {
          await sleep(BASE_DELAY_MS * (attempt + 1))
        }
      }
    }
  }

  throw lastError
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
