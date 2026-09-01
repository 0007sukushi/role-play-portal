import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechRecognition({ onFinalResult }) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const recognitionRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const accumulatedTextRef = useRef('')

  const stop = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
    }
    setListening(false)
  }, [])

  const start = useCallback(() => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    stop()
    accumulatedTextRef.current = ''
    setInterim('')

    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onstart = () => setListening(true)

    rec.onresult = (e) => {
      let currentInterim = ''
      let newFinals = ''

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcriptText = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          newFinals += transcriptText + ' '
        } else {
          currentInterim += transcriptText
        }
      }

      if (newFinals) {
        accumulatedTextRef.current += newFinals
      }

      setInterim(accumulatedTextRef.current + currentInterim)

      // Clear existing silence timer and set a 1.5s delay before sending
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      
      silenceTimerRef.current = setTimeout(() => {
        const fullTranscript = (accumulatedTextRef.current + currentInterim).trim()
        if (fullTranscript && onFinalResult) {
          onFinalResult(fullTranscript)
          accumulatedTextRef.current = ''
          setInterim('')
        }
      }, 1500) // 1.5 second silence tolerance threshold
    }

    rec.onerror = (e) => {
      if (e.error !== 'no-speech') console.warn('[SpeechRec Error]:', e.error)
    }

    rec.onend = () => {
      // Auto restart continuous listening if mic active flag is still on
      setListening(false)
    }

    recognitionRef.current = rec
    try {
      rec.start()
    } catch {}
  }, [onFinalResult, stop])

  return {
    listening,
    interim,
    start,
    stop,
    supported: typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  }
}