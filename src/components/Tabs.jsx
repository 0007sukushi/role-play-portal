import { ClipboardCheck, Settings2, Video } from 'lucide-react'

const TABS = [
  { id: 'setup', label: 'Setup & Scenario Config', icon: Settings2 },
  { id: 'room', label: 'Simulated Zoom Room', icon: Video },
  { id: 'scorecard', label: 'Post-Call Scorecard', icon: ClipboardCheck },
]

export default function Tabs({ active, onChange }) {
  return (
    <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pt-5">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'border-gold/70 bg-gold/10 text-gold'
                : 'border-edge bg-panel text-white/60 hover:border-white/20 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
