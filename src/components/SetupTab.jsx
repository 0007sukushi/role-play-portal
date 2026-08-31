import { BookOpen, Dices, ListChecks, PlayCircle, RotateCcw, ShieldQuestion, Sparkles } from 'lucide-react'
import {
  AAAR_FRAMEWORK,
  CORE_PRINCIPLES,
  DIFFICULTIES,
  DISCOVERY_PROTOCOL,
  GENDERS,
  MOODS,
  OFFERS,
  SOURCE_BOOKS,
  applyOffer,
} from '../lib/salesEngine'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  )
}

export default function SetupTab({ scenario, onChange, onReset, onRandomize, onStartCall, voices }) {
  const set = (key) => (e) => onChange({ ...scenario, [key]: e.target.value })

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <section className="space-y-6">
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">Choose an offer</h2>
          <div className="flex flex-wrap gap-2">
            {OFFERS.map((offer) => {
              const isActive = offer.id === scenario.offerId
              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => onChange(applyOffer(scenario, offer.id))}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'border-gold/70 bg-gold/10 text-gold'
                      : 'border-edge bg-ink text-white/60 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {offer.tab}
                </button>
              )
            })}
          </div>
          <p className="text-xs leading-relaxed text-white/45">
            {scenario.mode === 'cold'
              ? 'Cold call: the prospect has never heard of you or Astraura and will demand a hook immediately.'
              : 'Warm call: the prospect already knows Astraura, has afternoon brain fog, and booked this call themselves.'}
          </p>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
              <Sparkles className="h-4 w-4" /> Offer
            </h2>
            <button type="button" onClick={onReset} className="btn-ghost !px-3 !py-1.5 text-xs">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
          <Field label="Offer name">
            <input className="field" value={scenario.offerName} onChange={set('offerName')} />
          </Field>
          <Field label="What the offer does">
            <textarea className="field h-24 resize-none" value={scenario.offerDescription} onChange={set('offerDescription')} />
          </Field>
          <Field label="Terms">
            <input className="field" value={scenario.terms} onChange={set('terms')} />
          </Field>
          <Field label="Goal of this call">
            <input className="field" value={scenario.callGoal} onChange={set('callGoal')} />
          </Field>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">AI Prospect</h2>
            <button type="button" onClick={onRandomize} className="btn-ghost !px-3 !py-1.5 text-xs">
              <Dices className="h-3.5 w-3.5" /> Randomize Prospect
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input className="field" value={scenario.prospectName} onChange={set('prospectName')} />
            </Field>
            <Field label="Role">
              <input className="field" value={scenario.prospectRole} onChange={set('prospectRole')} />
            </Field>
            <Field label="Company">
              <input className="field" value={scenario.prospectCompany} onChange={set('prospectCompany')} />
            </Field>
            <Field label="Industry">
              <input className="field" value={scenario.industry} onChange={set('industry')} />
            </Field>
            <Field label="Gender">
              <select className="field" value={scenario.prospectGender} onChange={set('prospectGender')}>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty">
              <select className="field" value={scenario.difficulty} onChange={set('difficulty')}>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Mood">
              <select className="field" value={scenario.mood} onChange={set('mood')}>
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Biggest problem (hidden until discovered)">
            <textarea className="field h-20 resize-none" value={scenario.primaryPain} onChange={set('primaryPain')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hidden objection">
              <input className="field" value={scenario.hiddenObjection} onChange={set('hiddenObjection')} />
            </Field>
            <Field label="Budget reality">
              <input className="field" value={scenario.budget} onChange={set('budget')} />
            </Field>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">Prospect Voice</h2>
          <Field label="Voice">
            <select
              className="field"
              value={scenario.voiceURI ?? ''}
              onChange={(e) => onChange({ ...scenario, voiceURI: e.target.value })}
            >
              <option value="">System default</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`Rate — ${Number(scenario.voiceRate).toFixed(2)}x`}>
              <input
                type="range"
                min="0.6"
                max="1.6"
                step="0.05"
                value={scenario.voiceRate}
                onChange={(e) => onChange({ ...scenario, voiceRate: Number(e.target.value) })}
                className="w-full accent-gold"
              />
            </Field>
            <Field label={`Pitch — ${Number(scenario.voicePitch).toFixed(2)}`}>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={scenario.voicePitch}
                onChange={(e) => onChange({ ...scenario, voicePitch: Number(e.target.value) })}
                className="w-full accent-gold"
              />
            </Field>
          </div>
        </div>

        <button type="button" onClick={onStartCall} className="btn-gold w-full !py-3 text-base">
          <PlayCircle className="h-5 w-5" /> Start the Zoom call
        </button>
      </section>

      <aside className="space-y-6">
        <div className="card space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
            <ListChecks className="h-4 w-4" /> 4-Step Discovery Protocol
          </h2>
          <ol className="space-y-3">
            {DISCOVERY_PROTOCOL.map((s) => (
              <li key={s.step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/50 text-xs font-bold text-gold">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs leading-relaxed text-white/50">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="card space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
            <ShieldQuestion className="h-4 w-4" /> AAAR Objection Framework
          </h2>
          {AAAR_FRAMEWORK.map((a) => (
            <div key={a.step} className="rounded-lg border border-edge bg-ink px-3 py-2">
              <p className="text-sm font-medium text-white/90">{a.step}</p>
              <p className="text-xs leading-relaxed text-white/50">{a.detail}</p>
            </div>
          ))}
        </div>

        <div className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">Core Principles</h2>
          <ul className="space-y-2">
            {CORE_PRINCIPLES.map((p) => (
              <li key={p} className="flex gap-2 text-sm text-white/70">
                <span className="text-gold">&#8226;</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="card space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
            <BookOpen className="h-4 w-4" /> Embedded Source Material
          </h2>
          {SOURCE_BOOKS.map((b) => (
            <div key={b.title}>
              <p className="text-sm font-medium text-white/90">{b.title}</p>
              <p className="text-xs leading-relaxed text-white/50">{b.detail}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
