import { useCallback, useEffect, useRef, useState } from 'react'

// Chrome (esp. on Windows) has three separate reliability bugs this hook works around:
// 1. getVoices() often returns [] on first call and only populates after a delay —
//    onvoiceschanged does not always fire, so we also poll.
// 2. Chrome silently stops/truncates any utterance queue after ~15s of continuous
//    speech unless you pause()/resume() periodically — the "Chrome speech cutoff bug".
// 3. Long single utterances degrade in quality/timing — we split text into
//    sentence-sized chunks and speak them back-to-back, which also sounds more
//    natural (proper pauses at punctuation) than one giant utterance.

// Voices ranked by how natural they sound in Chrome. "Google" voices are network
// (server-rendered) voices — localService: false — and sound dramatically better
// than local SAPI voices like "Microsoft David" or "Microsoft Zira". We rank by
// name match first, then prefer any remaining non-local (network) voice over a
// local one.
// Edge's "Online (Natural)" voices are neural TTS (real cloud rendering) and sound
// far more human than anything Chrome exposes — they're checked first. Google's
// network voices are the fallback for Chrome. Old local SAPI voices (George,
// Hazel, David, Zira) are last resort only.
const FEMALE_VOICE_PRIORITY = [
  /Microsoft Libby Online \(Natural\)/i,
  /Microsoft Aria Online \(Natural\)/i,
  /Google UK English Female/i,
  /Google US English/i, // Chrome's default Google voice is female-presenting
  /Samantha/i,
  /Microsoft Zira/i,
  /Microsoft Hazel/i,
  /female/i,
]

const MALE_VOICE_PRIORITY = [
  /Microsoft Guy Online \(Natural\)/i,
  /Microsoft Ryan Online \(Natural\)/i,
  /Google UK English Male/i,
  /Daniel/i,
  /Microsoft David/i,
  /Microsoft George/i,
  /male/i,
]

function scoreVoice(voice, priorityList) {
  for (let i = 0; i < priorityList.length; i += 1) {
    if (priorityList[i].test(voice.name)) return priorityList.length - i
  }
  return 0
}

function pickBestVoice(voices, gender) {
  const enVoices = voices.filter((v) => /^en/i.test(v.lang))
  const pool = enVoices.length ? enVoices : voices
  if (!pool.length) return null

  const priorityList = gender === 'male' ? MALE_VOICE_PRIORITY : FEMALE_VOICE_PRIORITY

  const ranked = [...pool].sort((a, b) => {
    const scoreDiff = scoreVoice(b, priorityList) - scoreVoice(a, priorityList)
    if (scoreDiff !== 0) return scoreDiff
    // Tie-break: prefer network voices (localService === false) — they're
    // server-rendered and sound far less robotic than local SAPI voices.
    return Number(a.localService) - Number(b.localService)
  })

  return ranked[0] ?? pool[0]
}

// Splits on sentence boundaries while keeping the punctuation attached, so each
// chunk gets spoken with a natural pause instead of one long monotone utterance.
function chunkText(text) {
  const chunks = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g)
  if (!chunks) return [text]
  return chunks.map((c) => c.trim()).filter(Boolean)
}

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState([])

  const queueRef = useRef([])
  const cutoffTimerRef = useRef(null)
  const activeGenderRef = useRef('female')
  const rateRef = useRef({})

  // --- Reliable voice loading (event + polling fallback) ---
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined
    const synth = window.speechSynthesis

    let cancelled = false
    let pollId = null
    let attempts = 0

    const commit = (list) => {
      if (cancelled || !list.length) return
      setVoices(list)
      if (pollId) {
        clearInterval(pollId)
        pollId = null
      }
    }

    const loadVoices = () => commit(synth.getVoices())

    loadVoices()
    synth.onvoiceschanged = loadVoices

    // Chrome/Windows fallback: onvoiceschanged is unreliable, so poll for up to ~4s.
    pollId = setInterval(() => {
      attempts += 1
      loadVoices()
      if (attempts > 20 && pollId) {
        clearInterval(pollId)
        pollId = null
      }
    }, 200)

    return () => {
      cancelled = true
      synth.onvoiceschanged = null
      if (pollId) clearInterval(pollId)
    }
  }, [])

  const clearCutoffTimer = () => {
    if (cutoffTimerRef.current) {
      clearInterval(cutoffTimerRef.current)
      cutoffTimerRef.current = null
    }
  }

  // Chrome bug workaround: nudging pause/resume every ~14s stops it from silently
  // killing a long queue of utterances.
  const armCutoffTimer = () => {
    clearCutoffTimer()
    cutoffTimerRef.current = setInterval(() => {
      const synth = window.speechSynthesis
      if (!synth.speaking) return
      synth.pause()
      synth.resume()
    }, 14000)
  }

  const speakNextInQueue = useCallback(() => {
    const synth = window.speechSynthesis
    const next = queueRef.current.shift()
    if (!next) {
      setSpeaking(false)
      clearCutoffTimer()
      return
    }

    const utterance = new SpeechSynthesisUtterance(next)
    const chosenVoice = pickBestVoice(synth.getVoices(), activeGenderRef.current)
    if (chosenVoice) utterance.voice = chosenVoice

    const { rate = 0.98, pitch = 1.0 } = rateRef.current
    utterance.rate = rate
    utterance.pitch = pitch

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => speakNextInQueue()
    utterance.onerror = () => speakNextInQueue()

    synth.speak(utterance)
  }, [])

  const speak = useCallback(
    (text, options = {}) => {
      if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
      const synth = window.speechSynthesis
      synth.cancel()
      clearCutoffTimer()

      activeGenderRef.current = options.gender === 'male' ? 'male' : 'female'
      rateRef.current = { rate: options.rate, pitch: options.pitch }

      queueRef.current = chunkText(text)
      armCutoffTimer()
      speakNextInQueue()
    },
    [speakNextInQueue],
  )

  const cancel = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    queueRef.current = []
    window.speechSynthesis.cancel()
    clearCutoffTimer()
    setSpeaking(false)
  }, [])

  useEffect(() => () => cancel(), [cancel])

  return {
    speak, // speak(text, { gender: 'male' | 'female', rate?, pitch? })
    cancel,
    speaking,
    voices,
    supported: typeof window !== 'undefined' && !!window.speechSynthesis,
  }
}
