import { AlertTriangle, CheckCircle2, Circle, Loader2, RefreshCw, Target, TrendingUp, XCircle } from 'lucide-react'

function scoreColor(score) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 55) return 'text-gold'
  return 'text-red-400'
}

function Bar({ value }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export default function Scorecard({ scorecard, loading, error, transcript, onRegenerate, onNewCall }) {
  if (loading) {
    return (
      <div className="card flex flex-col items-center gap-3 py-16 text-white/60">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
        Grading your call against the discovery protocol, AAAR, and the book principles…
      </div>
    )
  }

  if (error) {
    return (
      <div className="card space-y-4">
        <p className="flex items-center gap-2 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4" /> {error}
        </p>
        <button type="button" onClick={onRegenerate} className="btn-gold">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    )
  }

  if (!scorecard) {
    return (
      <div className="card space-y-3 py-16 text-center">
        <p className="text-white/60">No scorecard yet. Run a call and hit “End call” to get graded.</p>
        <button type="button" onClick={onNewCall} className="btn-ghost">
          Go to setup
        </button>
      </div>
    )
  }

  const outcomeStyles = {
    Closed: 'border-emerald-400/50 text-emerald-400',
    'Follow-up': 'border-gold/60 text-gold',
    Lost: 'border-red-500/50 text-red-400',
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="card flex flex-col items-center justify-center gap-3 text-center">
          <p className="label !mb-0">Overall score</p>
          <p className={`text-6xl font-bold ${scoreColor(scorecard.overallScore)}`}>{scorecard.overallScore}</p>
          <p className="text-[11px] leading-relaxed text-white/40">
            Overall Score: Weighted average (0–100%). Each category is graded out of 100 points based on execution
            precision.
          </p>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              outcomeStyles[scorecard.outcome] ?? 'border-edge text-white/60'
            }`}
          >
            {scorecard.outcome}
          </span>
          <p className="text-sm text-white/60">{scorecard.verdict}</p>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">Category breakdown</h2>
          {scorecard.categories?.map((c) => (
            <div key={c.name} className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/85">{c.name}</span>
                <span className={`text-sm font-semibold ${scoreColor(c.score)}`}>{c.score}</span>
              </div>
              <Bar value={c.score} />
              {c.notes && <p className="text-xs leading-relaxed text-white/45">{c.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">4-Step Discovery Protocol</h2>
          {scorecard.discoverySteps?.map((s) => (
            <div key={s.step} className="flex items-center gap-2 text-sm">
              {s.hit ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Circle className="h-4 w-4 text-white/25" />
              )}
              <span className={s.hit ? 'text-white/85' : 'text-white/45'}>{s.step}</span>
            </div>
          ))}
        </div>

        <div className="card space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
            <Target className="h-4 w-4" /> Next drill
          </h2>
          <p className="text-sm leading-relaxed text-white/70">{scorecard.nextDrill}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: 'Strengths', items: scorecard.strengths, Icon: TrendingUp, tone: 'text-emerald-400' },
          { title: 'Improvements', items: scorecard.improvements, Icon: RefreshCw, tone: 'text-gold' },
          { title: 'Missed opportunities', items: scorecard.missedOpportunities, Icon: XCircle, tone: 'text-red-400' },
        ].map(({ title, items, Icon, tone }) => (
          <div key={title} className="card space-y-3">
            <h2 className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${tone}`}>
              <Icon className="h-4 w-4" /> {title}
            </h2>
            <ul className="space-y-2">
              {(items ?? []).map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-white/70">
                  <span className="text-white/30">&#8226;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">Call transcript</h2>
        <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
          {transcript.map((entry, i) => (
            <p key={`${entry.at}-${i}`} className="text-sm leading-relaxed">
              <span className={entry.role === 'rep' ? 'text-gold' : 'text-white/45'}>
                {entry.role === 'rep' ? 'You: ' : 'Prospect: '}
              </span>
              <span className="text-white/75">{entry.text}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onRegenerate} className="btn-ghost">
          <RefreshCw className="h-4 w-4" /> Re-grade this call
        </button>
        <button type="button" onClick={onNewCall} className="btn-gold">
          Start a new role-play
        </button>
      </div>
    </div>
  )
}