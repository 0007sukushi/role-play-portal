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

    const rawGender = String(options.gender || options.prospectGender || '').toLowerCase()
    const isMale = rawGender === 'male' || options.isMale === true

    let selectedVoice = null

    if (isMale) {
      // 1. Edge Male Natural Voices
      selectedVoice = available.find((v) =>
        /guy online|christopher online|eric online|ryan online|steffan online/i.test(v.name)
      )
      // 2. Generic Male Fallback (Excluding Microsoft David)
      if (!selectedVoice) {
        selectedVoice = available.find((v) =>
          /male|guy|christopher|eric|george|richard/i.test(v.name) && !/david/i.test(v.name)
        )
      }
    } else {
      // 1. Edge Female Natural Voices
      selectedVoice = available.find((v) =>
        /libby online|sonia online|jenny online|maisie online|aria online/i.test(v.name)
      )
      // 2. Generic Female Fallback
      if (!selectedVoice) {
        selectedVoice = available.find((v) =>
          /female|libby|sonia|jenny|maisie|zira|hazel/i.test(v.name)
        )
      }
    }

    // 3. Absolute Fallback
    if (!selectedVoice && available.length > 0) {
      selectedVoice = available.find((v) => !/david/i.test(v.name)) || available[0]
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log(`[TTS Active Voice]: ${selectedVoice.name} | Targeted Gender: ${isMale ? 'Male' : 'Female'}`)
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