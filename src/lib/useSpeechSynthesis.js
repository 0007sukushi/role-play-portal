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
    const isMale = gender.toLowerCase() === 'male' || /male|david|mark|george|james|richard|omar|marcus|dmitri|jordan/i.test(voiceURI || '')

    let selectedVoice = isMale
      ? allVoices.find((v) => /male|david|mark|george|james|richard|google uk english male/i.test(v.name))
      : allVoices.find((v) => /female|zira|hazel|susan|google uk english female/i.test(v.name))

    if (!selectedVoice && voiceURI) {
      selectedVoice = allVoices.find((v) => v.voiceURI === voiceURI)
    }

    if (selectedVoice) utterance.voice = selectedVoice

    utterance.pitch = isMale ? 0.7 : 1.1
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
