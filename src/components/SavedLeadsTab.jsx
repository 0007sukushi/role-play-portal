import { ChevronDown, ChevronUp, PhoneCall, PlayCircle, Trash2, Users } from 'lucide-react'
import { useState } from 'react'

function DetailRow({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/35">{label}</p>
      <p className="text-xs leading-relaxed text-white/70">{value}</p>
    </div>
  )
}

export default function SavedLeadsTab({ personas, onFollowUp, onPractice, onDelete }) {
  const [expandedId, setExpandedId] = useState(null)

  if (!personas || personas.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 py-16 text-center text-white/60">
        <Users className="h-6 w-6 text-gold" />
        <p>No saved personas yet.</p>
        <p className="text-xs text-white/40">
          Build a prospect in Setup & Scenario Config, then hit "Save this persona" to see it here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {personas.map((p) => {
        const isOpen = expandedId === p.id
        return (
          <div key={p.id} className="card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gold">{p.name}</p>
                <p className="truncate text-xs text-white/50">
                  {p.prospectName} · {p.prospectRole} at {p.prospectCompany}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete?.(p.id)}
                className="shrink-0 rounded-md p-1.5 text-white/30 transition hover:bg-red-500/10 hover:text-red-300"
                title="Delete persona"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {p.notes && (
              <p className="rounded-lg border border-edge bg-ink px-3 py-2 text-xs leading-relaxed text-white/60">
                {p.notes}
              </p>
            )}

            <button
              type="button"
              onClick={() => setExpandedId(isOpen ? null : p.id)}
              className="flex w-full items-center justify-center gap-1 text-[11px] text-white/40 hover:text-white/70"
            >
              {isOpen ? (
                <>
                  Hide full details <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Show full details <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>

            {isOpen && (
              <div className="space-y-2 border-t border-edge pt-3">
                <DetailRow label="Industry" value={p.industry} />
                <DetailRow label="Gender" value={p.prospectGender} />
                <DetailRow label="Difficulty" value={p.difficulty} />
                <DetailRow label="Mood" value={p.mood} />
                <DetailRow label="Biggest problem" value={p.primaryPain} />
                <DetailRow label="What they care about" value={p.prospectFocus} />
                <DetailRow label="Hidden objection" value={p.hiddenObjection} />
                <DetailRow label="Budget reality" value={p.budget} />
                <DetailRow label="Originally built on offer" value={p.sourceOfferId} />
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <button type="button" onClick={() => onFollowUp?.(p)} className="btn-gold !px-3 !py-1.5 text-xs">
                <PhoneCall className="h-3.5 w-3.5" /> Follow-Up Call
              </button>
              <button type="button" onClick={() => onPractice?.(p)} className="btn-ghost !px-3 !py-1.5 text-xs">
                <PlayCircle className="h-3.5 w-3.5" /> Practice Call
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}