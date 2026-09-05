// src/lib/gemini.js
export const PRIMARY_MODEL = 'gemini-3.5-flash-lite'
export const FALLBACK_MODEL = 'gemini-2.5-flash'

const MAX_ATTEMPTS = 3
const BASE_DELAY_MS = 800
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504])

const endpoint = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function requestModel({ model, apiKey, systemPrompt, contents, temperature }) {
  const res = await fetch(`${endpoint(model)}?key=${encodeURIComponent(apiKey)}`, {
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

/**
 * Calls the primary model, retrying transient failures with exponential backoff
 * and dropping to the fallback model once the primary keeps rejecting.
 */
export async function callGemini({ apiKey, systemPrompt, contents, temperature = 0.9, onNotice }) {
  if (!apiKey) throw new Error('Add your Gemini API key in the header to start the call.')

  let lastError
  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        const text = await requestModel({ model, apiKey, systemPrompt, contents, temperature })
        if (model !== PRIMARY_MODEL) onNotice?.(`${PRIMARY_MODEL} was unavailable — answered with ${model}.`)
        return text
      } catch (err) {
        lastError = err
        if (!err.retryable) throw err
        if (attempt < MAX_ATTEMPTS - 1) {
          onNotice?.(`${model} is rate limited (${err.status}). Retrying…`)
          await sleep(BASE_DELAY_MS * 2 ** attempt)
        }
      }
    }
    if (model === PRIMARY_MODEL) onNotice?.(`Falling back to ${FALLBACK_MODEL}…`)
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
}export async function sendChatMessage({ apiKey, systemPrompt, contents, temperature = 0.9, onNotice }) {
  return callGemini({ apiKey, systemPrompt, contents, temperature, onNotice })
}