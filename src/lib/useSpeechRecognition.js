import { useCallback, useEffect, useRef, useState } from 'react'

function getRecognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export const speechRecognitionSupported = () => Boolean(getRecognitionCtor())

export function useSpeechRecognition({ onFinalResult }) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const wantsListeningRef = useRef(false)
  const finalHandlerRef = useRef(onFinalResult)

  useEffect(() => {
    finalHandlerRef.current = onFinalResult
  }, [onFinalResult])

  useEffect(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return undefined

    const recognition = new Ctor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let pending = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        const text = result[0].transcript
        if (result.isFinal) {
          const trimmed = text.trim()
          if (trimmed) finalHandlerRef.current?.(trimmed)
        } else {
          pending += text
        }
      }
      setInterim(pending)
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
      setError(event.error)
      wantsListeningRef.current = false
      setListening(false)
    }

    recognition.onend = () => {
      setInterim('')
      if (wantsListeningRef.current) {
        try {
          recognition.start()
        } catch {
          setListening(false)
        }
      } else {
        setListening(false)
      }
    }

    recognitionRef.current = recognition
    return () => {
      wantsListeningRef.current = false
      recognition.onend = null
      recognition.stop()
    }
  }, [])

  const start = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) {
      setError('not-supported')
      return
    }
    setError(null)
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
    recognitionRef.current?.stop()
    setListening(false)
    setInterim('')
  }, [])

  return { listening, interim, error, start, stop, supported: speechRecognitionSupported() }
}
