import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState([])
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined
    
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices()
      if (available.length > 0) {
        setVoices(available)
      }
    }

    loadVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const availableVoices = window.speechSynthesis.getVoices()

    // Find Chrome or System female voice explicitly
    const preferredFemale = availableVoices.find((v) =>
      /google uk english female|google us english female|zira|hazel|natural|female/i.test(v.name)
    )

    if (preferredFemale) {
      utterance.voice = preferredFemale
    }

    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const cancel = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  return {
    speak,
    cancel,
    speaking,
    voices,
    supported: typeof window !== 'undefined' && !!window.speechSynthesis,
  }
}