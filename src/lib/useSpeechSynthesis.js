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

  const speak = useCallback((text, { voiceURI, gender = 'Female', rate = 0.92, pitch = 1 } = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)

    const allVoices = window.speechSynthesis.getVoices()
    const isMale = gender.toLowerCase() === 'male' || /male/i.test(voiceURI || '')

    let selectedVoice = null

    if (isMale) {
      // Prioritize natural Google voices over robotic Windows SAPI voices
      selectedVoice = allVoices.find((v) => /google uk english male|google us english male|david|mark/i.test(v.name))
    } else {
      selectedVoice = allVoices.find((v) => /google uk english female|google us english female|zira|hazel/i.test(v.name))
    }

    if (!selectedVoice && voiceURI) {
      selectedVoice = allVoices.find((v) => v.voiceURI === voiceURI)
    }

    if (selectedVoice) utterance.voice = selectedVoice

    // Slight rate slowdown humanizes stiff text-to-speech cadence
    utterance.pitch = 1.0
    utterance.rate = 0.92

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