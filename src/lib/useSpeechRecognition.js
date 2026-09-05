import { useCallback, useEffect, useRef, useState } from 'react'

function getRecognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export const speechRecognitionSupported = () => Boolean(getRecognitionCtor())

// How long to wait after the user stops producing any speech (final or
// interim) before we treat their turn as actually finished and send it.
// Raise this if you're still getting cut off mid-thought; lower it if
// replies feel too slow to fire after you finish talking.
const SILENCE_COMMIT_MS = 2200

export function useSpeechRecognition({ onFinalResult }) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const wantsListeningRef = useRef(false)
  const finalHandlerRef = useRef(onFinalResult)
  const bufferRef = useRef('')
  const silenceTimerRef = useRef(null)

  useEffect(() => {
    finalHandlerRef.current = onFinalResult
  }, [onFinalResult])

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  const commitBuffer = useCallback(() => {
    clearSilenceTimer()
    const text = bufferRef.current.trim()
    bufferRef.current = ''
    if (text) finalHandlerRef.current?.(text)
  }, [])

  const scheduleCommit = useCallback(() => {
    clearSilenceTimer()
    silenceTimerRef.current = setTimeout(() => {
      commitBuffer()
    }, SILENCE_COMMIT_MS)
  }, [commitBuffer])

  useEffect(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return undefined

    const recognition = new Ctor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let pending = ''
      let gotFinalChunk = false

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        const text = result[0].transcript
        if (result.isFinal) {
          const trimmed = text.trim()
          if (trimmed) {
            bufferRef.current = bufferRef.current ? `${bufferRef.current} ${trimmed}` : trimmed
            gotFinalChunk = true
          }
        } else {
          pending += text
        }
      }

      setInterim(bufferRef.current + (pending ? ` ${pending}` : ''))

      // Any speech activity (final chunk or live interim text) means the
      // person is still mid-thought — push the "are they done?" timer out
      // instead of committing right away.
      if (gotFinalChunk || pending.trim()) {
        scheduleCommit()
      }
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
      setError(event.error)
      wantsListeningRef.current = false
      setListening(false)
    }

    recognition.onend = () => {
      // The engine stopped on its own (it does this periodically even
      // mid-conversation). If the user is still holding mic-on, restart
      // it seamlessly without treating this as the end of their turn —
      // only the silence timer decides that.
      if (wantsListeningRef.current) {
        try {
          recognition.start()
        } catch {
          setListening(false)
        }
      } else {
        commitBuffer()
        setInterim('')
        setListening(false)
      }
    }

    recognitionRef.current = recognition
    return () => {
      wantsListeningRef.current = false
      recognition.onend = null
      recognition.stop()
      clearSilenceTimer()
    }
  }, [commitBuffer, scheduleCommit])

  const start = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) {
      setError('not-supported')
      return
    }
    setError(null)
    bufferRef.current = ''
    wantsListeningRef.current = true
    try {
      recognition.start()
      setListening(true)
    } catch {
      setListening(true)
    }
  }, [])

  const stop = useCallback(() => {
    wantsListeningRef.current = false
    clearSilenceTimer()
    recognitionRef.current?.stop()
    setListening(false)
    setInterim('')
    bufferRef.current = ''
  }, [])

  // Optional: call this to manually flag "I'm done talking" right now,
  // instead of waiting for the silence timer (e.g. wire to an Enter key).
  const finishTurn = useCallback(() => {
    commitBuffer()
  }, [commitBuffer])

  return { listening, interim, error, start, stop, finishTurn, supported: speechRecognitionSupported() }
}