import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState([])
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text, { voiceURI, gender = 'Female', rate = 1, pitch = 1 } = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)

    const allVoices = window.speechSynthesis.getVoices()
    const isMale = gender.toLowerCase() === 'male' || /male/i.test(voiceURI || '')

    let selectedVoice = null

    if (isMale) {
      // Find native Windows/Browser Male Voice
      selectedVoice = allVoices.find((v) => /david|mark|george|james|richard|google uk english male/i.test(v.name))
    } else {
      // Find original clean Female Voice
      selectedVoice = allVoices.find((v) => /zira|hazel|susan|google uk english female/i.test(v.name))
    }

    // Fall back to voiceURI match if defined, or default browser voice
    if (!selectedVoice && voiceURI) {
      selectedVoice = allVoices.find((v) => v.voiceURI === voiceURI)
    }

    if (selectedVoice) utterance.voice = selectedVoice

    // Kept strictly at natural 1.0 pitch to stop all robotic audio warping
    utterance.pitch = pitch
    utterance.rate = rate

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