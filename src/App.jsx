import React, { useState, useEffect, useRef } from 'react'
import {
  OFFERS,
  DEFAULT_SCENARIO,
  applyOffer,
  buildProspectSystemPrompt,
  buildMasterRepSystemPrompt,
  buildScorecardPrompt,
} from './lib/salesEngine'
import { sendChatMessage } from './lib/gemini'
import { useSpeechSynthesis } from './lib/useSpeechSynthesis'
import { useSpeechRecognition } from './lib/useSpeechRecognition'

export default function App() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO)
  const [userRole, setUserRole] = useState('rep') // 'rep' (User Sells) or 'prospect' (AI Sells)
  const [transcript, setTranscript] = useState([])
  const [isCallActive, setIsCallActive] = useState(false)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [scorecard, setScorecard] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const { speak, stop: stopSpeech, isSpeaking } = useSpeechSynthesis()
  const { transcript: liveInput, resetTranscript, startListening, stopListening, listening } = useSpeechRecognition()

  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [transcript, liveInput])

  const handleOfferChange = (offerId) => {
    setScenario((prev) => applyOffer(prev, offerId))
    handleEndCall()
  }

  const handleRoleToggle = (role) => {
    setUserRole(role)
    handleEndCall()
  }

  const handleStartCall = async () => {
    setTranscript([])
    setScorecard(null)
    setIsCallActive(true)

    // Select correct system prompt based on active role
    const systemPrompt = userRole === 'rep' 
      ? buildProspectSystemPrompt(scenario) 
      : buildMasterRepSystemPrompt(scenario)

    setIsAiThinking(true)

    try {
      // Opening line from AI
      const initialPrompt = userRole === 'rep'
        ? (scenario.mode === 'cold' ? 'Answer the phone as the prospect.' : 'Say hello as the prospect starting the scheduled call.')
        : 'Open the call as the elite sales closer from Astraura.'

      const response = await sendChatMessage(systemPrompt, [], initialPrompt)
      
      const aiRole = userRole === 'rep' ? 'prospect' : 'rep'
      setTranscript([{ role: aiRole, text: response }])
      
      speak(response, scenario.prospectGender)
    } catch (err) {
      console.error('Failed to start call:', err)
    } finally {
      setIsAiThinking(false)
    }
  }

  const handleSendUserMessage = async (userText) => {
    if (!userText.trim() || isAiThinking) return

    stopSpeech()
    const currentRole = userRole // 'rep' or 'prospect'
    const aiRole = userRole === 'rep' ? 'prospect' : 'rep'

    const updatedTranscript = [...transcript, { role: currentRole, text: userText }]
    setTranscript(updatedTranscript)
    resetTranscript()
    setIsAiThinking(true)

    try {
      const systemPrompt = userRole === 'rep' 
        ? buildProspectSystemPrompt(scenario) 
        : buildMasterRepSystemPrompt(scenario)

      const response = await sendChatMessage(systemPrompt, updatedTranscript, userText)

      setTranscript((prev) => [...prev, { role: aiRole, text: response }])
      speak(response, scenario.prospectGender)
    } catch (err) {
      console.error('Failed to get AI response:', err)
    } finally {
      setIsAiThinking(false)
    }
  }

  const handleEndCall = async () => {
    stopSpeech()
    stopListening()
    setIsCallActive(false)

    if (transcript.length > 1) {
      setIsEvaluating(true)
      try {
        const evalPrompt = buildScorecardPrompt(scenario, transcript)
        const rawJson = await sendChatMessage('You are an expert sales analyst. Return raw JSON only.', [], evalPrompt)
        const parsed = JSON.parse(rawJson.replace(/```json|```/g, '').trim())
        setScorecard(parsed)
      } catch (err) {
        console.error('Failed to generate scorecard:', err)
      } finally {
        setIsEvaluating(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 md:p-8 flex flex-col gap-6">
      {/* HEADER & OFFERS */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#d4af37] tracking-wider uppercase">Astraura Neural Sales Engine</h1>
          <p className="text-xs text-gray-400">High-Ticket Simulator & Reverse Roleplay Studio</p>
        </div>

        {/* ROLE SWITCHER TOGGLE */}
        <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => handleRoleToggle('rep')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              userRole === 'rep'
                ? 'bg-[#d4af37] text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            You Pitch (Rep Mode)
          </button>
          <button
            onClick={() => handleRoleToggle('prospect')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              userRole === 'prospect'
                ? 'bg-[#d4af37] text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            AI Pitches (Master Rep)
          </button>
        </div>
      </header>

      {/* OFFER TABS */}
      <div className="flex flex-wrap gap-2">
        {OFFERS.map((offer) => (
          <button
            key={offer.id}
            onClick={() => handleOfferChange(offer.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-all ${
              scenario.offerId === offer.id
                ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10'
                : 'border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            {offer.tab}
          </button>
        ))}
      </div>

      {/* MAIN CONSOLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* SCENARIO DETAILS */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">Target Profile</h2>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-500">Name:</span> {scenario.prospectName}</div>
            <div><span className="text-gray-500">Role:</span> {scenario.prospectRole}</div>
            <div><span className="text-gray-500">Company:</span> {scenario.prospectCompany}</div>
            <div><span className="text-gray-500">Difficulty:</span> <span className="text-[#d4af37]">{scenario.difficulty}</span></div>
            <div><span className="text-gray-500">Primary Friction:</span> {scenario.primaryPain}</div>
            <div><span className="text-gray-500">Hidden Objection:</span> {scenario.hiddenObjection}</div>
          </div>

          {!isCallActive ? (
            <button
              onClick={handleStartCall}
              className="mt-auto w-full py-3 bg-[#d4af37] text-black font-bold uppercase text-xs tracking-wider rounded hover:bg-[#c5a028] transition-all"
            >
              Start Call ({userRole === 'rep' ? 'Sales Rep' : 'Prospect'})
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="mt-auto w-full py-3 bg-red-600/20 text-red-400 border border-red-500/30 font-bold uppercase text-xs tracking-wider rounded hover:bg-red-600/30 transition-all"
            >
              End Call & Evaluate
            </button>
          )}
        </div>

        {/* TRANSCRIPT & LIVE CALL */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-lg p-5 flex flex-col h-[500px]">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
            {transcript.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm max-w-[85%] ${
                  msg.role === 'rep'
                    ? 'ml-auto bg-[#d4af37]/10 border border-[#d4af37]/30 text-gray-200'
                    : 'mr-auto bg-gray-800 border border-gray-700 text-gray-300'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">
                  {msg.role === 'rep' ? 'Sales Rep' : scenario.prospectName}
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
            {isAiThinking && <div className="text-xs italic text-gray-500">AI speaking...</div>}
          </div>

          {/* INPUT CONTROLS */}
          {isCallActive && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder={userRole === 'rep' ? "Speak or type your pitch..." : "Speak or type prospect objection..."}
                value={liveInput}
                onChange={(e) => resetTranscript(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendUserMessage(liveInput)}
                className="flex-1 bg-black border border-gray-800 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={() => (listening ? stopListening() : startListening())}
                className={`px-4 py-2 rounded text-xs font-bold ${
                  listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {listening ? 'Mic On' : 'Mic Off'}
              </button>
              <button
                onClick={() => handleSendUserMessage(liveInput)}
                className="px-5 py-2 bg-[#d4af37] text-black text-xs font-bold rounded"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>

      {/* EVALUATION SCORECARD DISPLAY */}
      {isEvaluating && <div className="text-center py-6 text-sm text-[#d4af37]">Evaluating execution matrix...</div>}
      {scorecard && (
        <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <h3 className="text-lg font-bold text-[#d4af37]">Performance Scorecard</h3>
            <div className="text-2xl font-bold">{scorecard.overallScore}/100</div>
          </div>
          <p className="text-sm italic text-gray-300">{scorecard.verdict}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Strengths</h4>
              <ul className="list-disc pl-4 text-xs text-gray-300 space-y-1">
                {scorecard.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Key Improvements</h4>
              <ul className="list-disc pl-4 text-xs text-gray-300 space-y-1">
                {scorecard.improvements?.map((imp, i) => <li key={i}>{imp}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}