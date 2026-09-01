import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState([])
  const utteranceRef = useRef(null)

  const loadVoices = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return []
    const available = window.speechSynthesis.getVoices()
    if (available.length > 0) {
      setVoices(available)
    }
    return available
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [loadVoices])

  const speak = useCallback((text, options = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Always fetch fresh list in case onvoiceschanged loaded late
    let available = window.speechSynthesis.getVoices()
    if (!available.length) available = voices

    const isMale = options.gender?.toLowerCase() === 'male' || options.isMale === true

    // 1. Precise Match: Edge Free Online Natural Voices
    let selectedVoice = available.find((v) =>
      isMale
        ? /guy.*online|christopher.*online|eric.*online|natural.*male/i.test(v.name)
        : /libby.*online|sonia.*online|jenny.*online|maisie.*online|natural.*female/i.test(v.name)
    )

    // 2. Loose Match: Any Natural / Online voice for requested gender
    if (!selectedVoice) {
      selectedVoice = available.find((v) =>
        isMale
          ? /guy|christopher|eric|george/i.test(v.name) && !/david/i.test(v.name)
          : /libby|sonia|jenny|maisie|zira|hazel/i.test(v.name)
      )
    }

    // 3. Absolute Fallback: Any voice that is NOT Microsoft David
    if (!selectedVoice && available.length > 0) {
      selectedVoice = available.find((v) => !/david/i.test(v.name)) || available[0]
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [voices])

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