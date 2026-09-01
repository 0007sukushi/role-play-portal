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
    let available = window.speechSynthesis.getVoices()
    if (!available.length) available = voices

    const isMale = options.gender?.toLowerCase() === 'male' || options.isMale

    // 1. Target Edge's High-Quality Online Natural Voices First
    let selectedVoice = available.find((v) =>
      isMale
        ? /Guy Online \(Natural\)|Christopher Online \(Natural\)|Eric Online \(Natural\)/i.test(v.name)
        : /Libby Online \(Natural\)|Sonia Online \(Natural\)|Jenny Online \(Natural\)|Maisie Online \(Natural\)/i.test(v.name)
    )

    // 2. Fallback to any generic Natural voice
    if (!selectedVoice) {
      selectedVoice = available.find((v) =>
        isMale
          ? /natural.*male|male.*natural/i.test(v.name)
          : /natural.*female|female.*natural/i.test(v.name)
      )
    }

    // 3. Fallback to standard female/male names (excluding robotic local SAPI drivers like Microsoft David)
    if (!selectedVoice) {
      selectedVoice = available.find((v) =>
        isMale
          ? /george|richard|guy|natural/i.test(v.name) && !/david/i.test(v.name)
          : /zira|hazel|libby|jennifer|female/i.test(v.name)
      )
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