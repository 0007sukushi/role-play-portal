import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import SetupTab from './components/SetupTab'
import ZoomRoom from './components/ZoomRoom'
import Scorecard from './components/Scorecard'
import {
  DEFAULT_SCENARIO,
  buildProspectSystemPrompt,
  buildScorecardPrompt,
  randomProspect,
} from './lib/salesEngine'
import { callGemini, parseJsonResponse, transcriptToContents } from './lib/gemini'
import { useSpeechRecognition } from './lib/useSpeechRecognition'
import { useSpeechSynthesis } from './lib/useSpeechSynthesis'

const API_KEY_STORAGE = 'rpp.geminiApiKey'
const SCENARIO_STORAGE = 'rpp.scenario'

function loadStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [tab, setTab] = useState('setup')
  const [apiKey, setApiKey] = useState(() => loadStored(API_KEY_STORAGE, ''))
  const [scenario, setScenario] = useState(() => {
    const stored = loadStored(SCENARIO_STORAGE, {})
    return stored.offerId ? { ...DEFAULT_SCENARIO, ...stored } : DEFAULT_SCENARIO
  })
  const [transcript, setTranscript] = useState([])
  const [callActive, setCallActive] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [callError, setCallError] = useState(null)
  const [gradedCall, setGradedCall] = useState(null)
  const [scorecard, setScorecard] = useState(null)
  const [scorecardLoading, setScorecardLoading] = useState(false)
  const [scorecardError, setScorecardError] = useState(null)

  const transcriptRef = useRef(transcript)
  const busyRef = useRef(false)
  const callIdRef = useRef(0)
  const apiKeyRef = useRef(apiKey)
  const scenarioRef = useRef(scenario)

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])
  useEffect(() => {
    apiKeyRef.current = apiKey
    window.localStorage.setItem(API_KEY_STORAGE, JSON.stringify(apiKey))
  }, [apiKey])
  useEffect(() => {
    scenarioRef.current = scenario
    window.localStorage.setItem(SCENARIO_STORAGE, JSON.stringify(scenario))
  }, [scenario])

  const { speak, cancel: cancelSpeech, speaking, voices, supported: ttsSupported } = useSpeechSynthesis()

  const sendToProspect = useCallback(
    async (text) => {
      if (busyRef.current) return
      const trimmed = text.trim()
      if (!trimmed) return

      const callId = callIdRef.current
      busyRef.current = true
      setCallError(null)
      const next = [...transcriptRef.current, { role: 'rep', text: trimmed, at: Date.now() }]
      transcriptRef.current = next
      setTranscript(next)
      setThinking(true)

      try {
        const reply = await callGemini({
          apiKey: apiKeyRef.current,
          systemPrompt: buildProspectSystemPrompt(scenarioRef.current),
          contents: transcriptToContents(next),
        })
        if (callId !== callIdRef.current) return
        const withReply = [...transcriptRef.current, { role: 'prospect', text: reply, at: Date.now() }]
        transcriptRef.current = withReply
        setTranscript(withReply)
        if (ttsSupported) {
          speak(reply, {
            voiceURI: scenarioRef.current.voiceURI,
            rate: Number(scenarioRef.current.voiceRate) || 1,
            pitch: Number(scenarioRef.current.voicePitch) || 1,
          })
        }
      } catch (err) {
        if (callId === callIdRef.current) setCallError(err.message)
      } finally {
        if (callId === callIdRef.current) setThinking(false)
        busyRef.current = false
      }
    },
    [speak, ttsSupported],
  )

  const { listening, interim, start, stop, supported: micSupported } = useSpeechRecognition({
    onFinalResult: sendToProspect,
  })

  const [micOn, setMicOn] = useState(false)

  useEffect(() => {
    if (!micSupported) return
    if (micOn && !speaking && !thinking) start()
    else stop()
  }, [micOn, speaking, thinking, micSupported, start, stop])

  const resetCall = useCallback(() => {
    callIdRef.current += 1
    setMicOn(false)
    stop()
    cancelSpeech()
    busyRef.current = false
    transcriptRef.current = []
    setTranscript([])
    setThinking(false)
    setCallError(null)
  }, [cancelSpeech, stop])

  const randomizeProspect = useCallback(() => {
    setScenario((prev) => ({ ...prev, ...randomProspect() }))
  }, [])

  const startCall = () => {
    resetCall()
    setScorecard(null)
    setScorecardError(null)
    setCallError(apiKey ? null : 'Add your Gemini API key in the header to start the call.')
    setCallActive(true)
    setTab('room')
  }

  const openTab = (next) => {
    if (next === 'room' && !callActive) startCall()
    else setTab(next)
  }

  const generateScorecard = useCallback(async (call) => {
    if (!call) return
    setScorecardLoading(true)
    setScorecardError(null)
    try {
      if (call.transcript.length === 0) throw new Error('There is nothing to grade — the call had no dialogue.')
      const raw = await callGemini({
        apiKey: apiKeyRef.current,
        systemPrompt: 'You are a precise sales-call grader. You always respond with valid JSON only.',
        contents: [{ role: 'user', parts: [{ text: buildScorecardPrompt(call.scenario, call.transcript) }] }],
        temperature: 0.3,
      })
      setScorecard(parseJsonResponse(raw))
    } catch (err) {
      setScorecardError(err.message)
    } finally {
      setScorecardLoading(false)
    }
  }, [])

  const endCall = () => {
    const call = { transcript: transcriptRef.current, scenario: scenarioRef.current }
    resetCall()
    setCallActive(false)
    setGradedCall(call)
    randomizeProspect()
    setTab('scorecard')
    generateScorecard(call)
  }

  return (
    <div className="min-h-full bg-ink">
      <Header apiKey={apiKey} onApiKeyChange={setApiKey} />
      <Tabs active={tab} onChange={openTab} />
      <main className="mx-auto max-w-7xl px-6 py-6">
        {tab === 'setup' && (
          <SetupTab
            scenario={scenario}
            onChange={setScenario}
            onReset={() => setScenario(DEFAULT_SCENARIO)}
            onRandomize={randomizeProspect}
            onStartCall={startCall}
            voices={voices}
          />
        )}
        {tab === 'room' && (
          <ZoomRoom
            scenario={scenario}
            transcript={transcript}
            interim={interim}
            listening={listening}
            thinking={thinking}
            speaking={speaking}
            error={callError}
            micOn={micOn}
            micSupported={micSupported}
            onToggleMic={() => setMicOn((v) => !v)}
            onSendText={sendToProspect}
            onStopSpeaking={cancelSpeech}
            onEndCall={endCall}
          />
        )}
        {tab === 'scorecard' && (
          <Scorecard
            scorecard={scorecard}
            loading={scorecardLoading}
            error={scorecardError}
            transcript={gradedCall?.transcript ?? []}
            onRegenerate={() => generateScorecard(gradedCall)}
            onNewCall={() => setTab('setup')}
          />
        )}
      </main>
    </div>
  )
}
