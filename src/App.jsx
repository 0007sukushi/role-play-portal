import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import SetupTab from './components/SetupTab'
import ZoomRoom from './components/ZoomRoom'
import Scorecard from './components/Scorecard'
import { DEFAULT_SCENARIO, buildProspectSystemPrompt, buildScorecardPrompt } from './lib/salesEngine'
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
  const [scenario, setScenario] = useState(() => ({ ...DEFAULT_SCENARIO, ...loadStored(SCENARIO_STORAGE, {}) }))
  const [transcript, setTranscript] = useState([])
  const [thinking, setThinking] = useState(false)
  const [callError, setCallError] = useState(null)
  const [scorecard, setScorecard] = useState(null)
  const [scorecardLoading, setScorecardLoading] = useState(false)
  const [scorecardError, setScorecardError] = useState(null)

  const transcriptRef = useRef(transcript)
  const busyRef = useRef(false)
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
        setCallError(err.message)
      } finally {
        setThinking(false)
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

  const startCall = () => {
    setMicOn(false)
    cancelSpeech()
    setTranscript([])
    transcriptRef.current = []
    setScorecard(null)
    setScorecardError(null)
    setCallError(apiKey ? null : 'Add your Gemini API key in the header to start the call.')
    setTab('room')
  }

  const generateScorecard = useCallback(async () => {
    const convo = transcriptRef.current
    setScorecardLoading(true)
    setScorecardError(null)
    try {
      if (convo.length === 0) throw new Error('There is nothing to grade — the call had no dialogue.')
      const raw = await callGemini({
        apiKey: apiKeyRef.current,
        systemPrompt: 'You are a precise sales-call grader. You always respond with valid JSON only.',
        contents: [{ role: 'user', parts: [{ text: buildScorecardPrompt(scenarioRef.current, convo) }] }],
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
    setMicOn(false)
    stop()
    cancelSpeech()
    setTab('scorecard')
    generateScorecard()
  }

  return (
    <div className="min-h-full bg-ink">
      <Header apiKey={apiKey} onApiKeyChange={setApiKey} />
      <Tabs active={tab} onChange={setTab} />
      <main className="mx-auto max-w-7xl px-6 py-6">
        {tab === 'setup' && (
          <SetupTab
            scenario={scenario}
            onChange={setScenario}
            onReset={() => setScenario(DEFAULT_SCENARIO)}
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
            transcript={transcript}
            onRegenerate={generateScorecard}
            onNewCall={() => setTab('setup')}
          />
        )}
      </main>
    </div>
  )
}
