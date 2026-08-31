# Role-play Portal

An AI sales role-play trainer: configure a prospect, run a simulated Zoom call against Google Gemini with your voice, then get graded on a post-call scorecard.

Everything runs in the browser — mic input uses `webkitSpeechRecognition`, the prospect talks back through `window.speechSynthesis`, and the only external call is to the Gemini API with your own key.

## Run it

Requires Node 20.19+ (a `.nvmrc` pins 22.12.0).

```bash
nvm use          # optional, if you use nvm
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173), paste a Gemini API key into the header box (get one free at https://aistudio.google.com/apikey), and start a call. The key is stored in `localStorage` only.

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Tabs

1. **Setup & Scenario Config** — pick one of five offer presets (Founding Circle £1K, Angel Investor £5K, Equity Partner £20K, Co-Founder hire, Cold Outreach), then tune the prospect persona (name, role, gender, difficulty, mood, hidden objection, budget) or hit **Randomize Prospect** for a fresh one. Each preset has its own archetype pool — operators with a 2pm cognitive wall for the Founding Circle, investors who interrogate margins and multiples for the £5K/£20K tabs, operators and R&D leads weighing equity for the co-founder tab, and unaware executives for cold outreach — and switching tabs rolls a matching prospect automatically. Voice/rate/pitch and the injected sales system are documented here too.
2. **Simulated Zoom Room** — pulsing avatar (gold while the prospect speaks, green while it listens), live transcript on the right, mic toggle, stop-audio, and end call. Opening this tab always starts a fresh call; ending one stops the mic and audio, clears the transcript, and rolls a new prospect. A text box is available when the mic isn't (Chrome/Edge only for speech recognition).
3. **Post-Call Scorecard** — overall score, outcome, per-category breakdown, 4-step discovery checklist, strengths / improvements / missed opportunities, next drill, and the graded call's transcript.

The four warm presets tell the prospect they already know Astraura, suffer afternoon brain fog, and booked the call themselves. The Cold Outreach preset flips that: the prospect has never heard of you, is impatient, and the win is permission plus a booked follow-up rather than money.

## Sales engine

The prospect prompt and the grader in `src/lib/salesEngine.js` encode:

- **4-Step Discovery Protocol** — ask the biggest problem → repeat their exact words → highlight the 6-month consequence of inaction → Solution → Feature → Outcome (revenue / neural wealth).
- **AAAR objection framework** — Acknowledge, Ask for context, Answer the limiting belief, Reframe investment vs. the 6-month cost of inaction.
- **Core principles** — selling is clarification not convincing; escape pain over pleasure; no-oriented questions that preserve autonomy ("Would you be against moving forward?"); embedded commands; always "investment", never "price" or "cost".
- **Source material** — Never Split the Difference (Chris Voss), Straight Line Persuasion (Jeb Blount / Alex Hormozi), SPIN Selling (Neil Rackham).

## Stack

Vite + React 19, Tailwind CSS 3, lucide-react, Gemini `gemini-3.6-flash` with automatic retry/fallback to `gemini-2.5-flash` on 429/503.
