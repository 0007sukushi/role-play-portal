// src/lib/useSpeechSynthesis.js
import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState([])
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined
    const load = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text, { voiceURI, rate = 1.02, pitch = 0.98, gender = 'male' } = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const availableVoices = window.speechSynthesis.getVoices()

    let selectedVoice = null

    if (voiceURI) {
      selectedVoice = availableVoices.find(v => v.voiceURI === voiceURI) || null
    }

    if (!selectedVoice) {
      const g = String(gender || 'male').toLowerCase()
      if (g === 'female') {
        selectedVoice = availableVoices.find(v => v.name.includes('Sonia Online') && v.lang.startsWith('en')) ||
          availableVoices.find(v => (v.name.includes('Sonia') || v.name.includes('Libby') || v.name.includes('Natasha') || v.name.includes('Mia') || v.name.includes('Zoe')) && v.lang.startsWith('en')) ||
          availableVoices.find(v => v.name.includes('Natural') && v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Hazel') || v.name.includes('Susan'))) ||
          availableVoices.find(v => v.lang.startsWith('en'))
      } else {
        selectedVoice = availableVoices.find(v => v.name.includes('Ryan') || v.name.includes('Oliver') || v.name.includes('Arthur') || (v.name.includes('Natural') && v.lang.startsWith('en'))) ||
          availableVoices.find(v => v.lang.startsWith('en'))
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
    utterance.lang = selectedVoice ? selectedVoice.lang : 'en-GB'
    utterance.rate = rate
    utterance.pitch = pitch
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

  return { speak, cancel, speaking, voices, supported: typeof window !== 'undefined' && !!window.speechSynthesis }
}