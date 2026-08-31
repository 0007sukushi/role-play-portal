import { useState } from 'react'
import { Check, Eye, EyeOff, KeyRound, Sparkles } from 'lucide-react'
import { PRIMARY_MODEL } from '../lib/gemini'

export default function Header({ apiKey, onApiKeyChange }) {
  const [visible, setVisible] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (value) => {
    onApiKeyChange(value)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1200)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-edge bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/40 bg-gold/10">
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Role-play <span className="text-gold">Portal</span>
            </h1>
            <p className="text-xs text-white/45">AI prospect simulator for high-ticket sales reps</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <KeyRound className="pointer-events-none absolute left-3 h-4 w-4 text-white/35" />
            <input
              type={visible ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={`Gemini API key (${PRIMARY_MODEL})`}
              className="field w-full pl-9 pr-10 md:w-96"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-2 rounded p-1 text-white/40 transition hover:text-gold"
              aria-label={visible ? 'Hide API key' : 'Show API key'}
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <span
            className={`flex items-center gap-1 text-xs text-gold transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}
          >
            <Check className="h-3.5 w-3.5" /> saved
          </span>
        </div>
      </div>
    </header>
  )
}
