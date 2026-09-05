import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { EXPERT_CLOSERS } from '../lib/salesEngine'


function Avatar({ name, state }) {
  const ringColor = state === 'speaking' ? 'bg-gold/30' : state === 'listening' ? 'bg-emerald-400/25' : ''
  const borderColor =
    state === 'speaking' ? 'border-gold' : state === 'listening' ? 'border-emerald-400' : 'border-edge'
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()


  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      {state !== 'idle' && (
        <>
          <span className={`absolute inset-0 rounded-full ${ringColor} animate-pulse-ring`} />
          <span
            className={`absolute inset-0 rounded-full ${ringColor} animate-pulse-ring`}
            style={{ animationDelay: '0.6s' }}
          />
        </>
      )}
      <div
        className={`relative flex h-32 w-32 items-center justify-center rounded-full border-2 ${borderColor} bg-gradient-to-br from-[#1b1b1b] to-[#0d0d0d] text-3xl font-semibold text-gold transition-colors`}
      >
        {initials || <User className="h-10 w-10" />}
      </div>
    </div>
  )
}


export default function ZoomRoom({
  scenario,
  transcript,
  interim,
  listening,
  micOn,
  thinking,
  speaking,
  error,
  micSupported,
  onToggleMic,
  onSendText,
  onStopSpeaking,
  onEndCall,
}) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  const activeCloser = scenario.enableCloserPersona
    ? EXPERT_CLOSERS.find((c) => c.id === scenario.closerPersonaId)
    : null
  const displayName = activeCloser ? activeCloser.name : scenario.prospectName
  const displayRole = activeCloser ? activeCloser.title : `${scenario.prospectRole} · ${scenario.prospectCompany}`


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [transcript, interim, thinking])


  const avatarState = speaking ? 'speaking' : listening ? 'listening' : 'idle'
  const statusText = thinking
    ? 'Thinking…'
    : speaking
      ? 'Speaking'
      : listening
        ? 'Listening to you'
        : 'On the call'


  const submitDraft = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setDraft('')
    onSendText(text)
  }


  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <section className="card flex flex-col items-center justify-between gap-6 !p-6">
        <div className="flex w-full items-center justify-between text-xs text-white/45">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> LIVE
          </span>
          <span>
            {scenario.offerName} · {scenario.mode === 'cold' ? 'cold call' : 'discovery call'}
          </span>
        </div>


        <div className="flex flex-col items-center gap-4">
          <Avatar name={displayName} state={avatarState} />
          <div className="text-center">
            <p className="text-lg font-semibold">{displayName}</p>
            <p className="text-sm text-white/50">{displayRole}</p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-edge px-3 py-1 text-xs text-gold">
              {thinking && <Loader2 className="h-3 w-3 animate-spin" />}
              {statusText}
            </p>
          </div>
        </div>


        {error && (
          <div className="flex w-full items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}


        {!micSupported && (
          <p className="text-center text-xs text-white/40">
            This browser has no webkitSpeechRecognition support — use the text box to speak as the rep. Chrome or Edge
            gives you the mic.
          </p>
        )}


        <div className="flex w-full flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onToggleMic}
            disabled={!micSupported}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              micOn ? 'bg-emerald-500 text-ink hover:brightness-110' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            {micOn ? 'Mic on' : 'Mic off'}
          </button>


          <button
            type="button"
            onClick={onStopSpeaking}
            disabled={!speaking}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {speaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            Stop audio
          </button>


          <button
            type="button"
            onClick={onEndCall}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            <PhoneOff className="h-4 w-4" /> End call
          </button>
        </div>
      </section>


      <section className="card flex h-[70vh] flex-col !p-0">
        <div className="flex items-center justify-between border-b border-edge px-5 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">Live meeting transcript</h2>
          <span className="text-xs text-white/40">{transcript.length} turns</span>
        </div>


        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {transcript.length === 0 && !thinking && (
            <p className="text-sm text-white/40">
              The call is open. Turn on your mic or type below to start discovery.
            </p>
          )}
          {transcript.map((entry, i) => (
            <div key={`${entry.at}-${i}`} className={entry.role === 'rep' ? 'text-right' : 'text-left'}>
              <p className="mb-1 text-[10px] uppercase tracking-wider text-white/35">
                {entry.role === 'rep' ? 'You (rep)' : displayName}
              </p>
              <div
                className={`inline-block max-w-[85%] rounded-xl px-3.5 py-2 text-sm leading-relaxed ${
                  entry.role === 'rep'
                    ? 'bg-gold/15 text-white ring-1 ring-gold/30'
                    : 'bg-white/[0.06] text-white/85 ring-1 ring-white/10'
                }`}
              >
                {entry.text}
              </div>
            </div>
          ))}
          {interim && (
            <div className="text-right">
              <p className="mb-1 text-[10px] uppercase tracking-wider text-white/35">You (rep)</p>
              <div className="inline-block max-w-[85%] rounded-xl bg-gold/5 px-3.5 py-2 text-sm italic text-white/45 ring-1 ring-gold/15">
                {interim}
              </div>
            </div>
          )}
          {thinking && (
            <p className="flex items-center gap-2 text-xs text-white/40">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> {displayName} is responding…
            </p>
          )}
        </div>


        <form onSubmit={submitDraft} className="flex gap-2 border-t border-edge px-5 py-3">
          <input
            className="field"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type what you say as the rep…"
          />
          <button type="submit" className="btn-gold !px-3" disabled={!draft.trim() || thinking}>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  )
}