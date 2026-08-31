export const DEFAULT_SCENARIO = {
  offerName: 'Astraura',
  offerDescription:
    'A done-with-you growth system that installs a predictable client acquisition engine for founders.',
  prospectName: 'Jordan Mercer',
  prospectRole: 'Founder & CEO',
  prospectCompany: 'Northwind Studio',
  industry: 'B2B creative agency',
  difficulty: 'Moderate',
  mood: 'Skeptical but curious',
  primaryPain: 'Inconsistent lead flow — some months are full, some are empty.',
  hiddenObjection: 'Thinks the investment is too high and wants to "think about it".',
  budget: '$8,000 - $15,000',
  callGoal: 'Enroll the prospect into Astraura on this call.',
  voiceRate: 1,
  voicePitch: 1,
}

export const DIFFICULTIES = ['Easy', 'Moderate', 'Hard', 'Brutal']

export const MOODS = [
  'Warm and open',
  'Skeptical but curious',
  'Busy and impatient',
  'Guarded and analytical',
  'Burned by a past vendor',
]

export const DISCOVERY_PROTOCOL = [
  {
    step: 1,
    title: 'Ask the biggest problem',
    detail: 'Open with a question that surfaces the single biggest problem the prospect is facing right now.',
  },
  {
    step: 2,
    title: 'Repeat their exact words',
    detail: 'Mirror the prospect\u2019s own language back to them so they hear their problem clearly (Chris Voss mirroring).',
  },
  {
    step: 3,
    title: 'Highlight the 6-month consequence',
    detail: 'Make the cost of inaction concrete: what does this problem look like six months from today if nothing changes?',
  },
  {
    step: 4,
    title: 'Solution \u2192 Feature \u2192 Outcome',
    detail: 'Present the solution, tie it to a specific feature, and land on the outcome in revenue and neural wealth (freedom, clarity, peace of mind).',
  },
]

export const AAAR_FRAMEWORK = [
  { step: 'Acknowledge', detail: 'Validate the objection without defending. "That makes complete sense."' },
  { step: 'Ask for context', detail: 'Ask a calibrated question to find what is really behind the objection.' },
  { step: 'Answer the limiting belief', detail: 'Address the belief underneath the objection, not the surface words.' },
  {
    step: 'Reframe investment vs. 6-month cost of inaction',
    detail: 'Compare the investment to what staying stuck costs over the next six months.',
  },
]

export const CORE_PRINCIPLES = [
  'Selling is clarification, not convincing.',
  'People move to escape pain far faster than to chase pleasure.',
  'Frame questions for "No" to preserve prospect autonomy \u2014 "Would you be against moving forward?"',
  'Use embedded commands \u2014 "I don\u2019t want you to decide too quickly before you know everything about Astraura."',
  'Always say "investment", never "price" or "cost".',
]

export const SOURCE_BOOKS = [
  {
    title: 'Never Split the Difference \u2014 Chris Voss',
    detail: 'Tactical empathy, mirroring, labeling ("It sounds like\u2026"), calibrated "How / What" questions, the "That\u2019s right" moment, and no-oriented questions.',
  },
  {
    title: 'Straight Line Persuasion \u2014 Jeb Blount / Alex Hormozi',
    detail: 'Keep the conversation on the straight line from open to close, build certainty in the product, the operator, and the company, and use looping to raise certainty after each objection.',
  },
  {
    title: 'SPIN Selling \u2014 Neil Rackham',
    detail: 'Situation, Problem, Implication, and Need-payoff questions \u2014 let the prospect articulate the value themselves.',
  },
]

const difficultyGuidance = {
  Easy: 'You are receptive. You share information readily and raise at most one soft objection before agreeing if the rep does reasonable work.',
  Moderate:
    'You share information when the rep earns it with good questions. You raise two or three real objections and only move forward if the rep handles them with the AAAR framework.',
  Hard: 'You are guarded. You give short answers to lazy questions, challenge vague claims, and raise repeated objections about investment, timing, and trust.',
  Brutal:
    'You are openly resistant, interrupt with objections, test the rep with pushback like "just send me the deck", and only move forward after outstanding discovery and reframing.',
}

export function buildProspectSystemPrompt(scenario) {
  const s = { ...DEFAULT_SCENARIO, ...scenario }
  return `You are role-playing as a SALES PROSPECT on a live Zoom sales call. You are NOT an assistant and you never break character.

# YOUR CHARACTER
- Name: ${s.prospectName}
- Role: ${s.prospectRole} at ${s.prospectCompany}
- Industry: ${s.industry}
- Current mood: ${s.mood}
- Difficulty setting: ${s.difficulty} \u2014 ${difficultyGuidance[s.difficulty] ?? difficultyGuidance.Moderate}
- Your biggest problem right now (do not volunteer it unprompted, make the rep dig): ${s.primaryPain}
- Your hidden objection (surface it only when the rep gets close to a close): ${s.hiddenObjection}
- Your budget reality: ${s.budget}

# THE OFFER BEING SOLD TO YOU
- Offer: ${s.offerName}
- What it is: ${s.offerDescription}
- The rep's goal on this call: ${s.callGoal}

# HOW TO BEHAVE
- Speak like a real human on a video call: 1\u20133 short sentences, conversational, sometimes hesitant. Never bullet points, never markdown, never stage directions.
- Reward good selling and punish bad selling. If the rep pitches before discovering your pain, get resistant. If the rep asks sharp, calibrated questions, open up.
- Raise objections naturally ("that's a lot of money", "I need to think about it", "I've tried something like this before", "let me talk to my partner").
- If the rep handles an objection using Acknowledge \u2192 Ask for context \u2192 Answer the limiting belief \u2192 Reframe the investment against the 6-month cost of inaction, your certainty should visibly increase and you should say so in your own words.
- If the rep says "price" or "cost" about the offer instead of "investment", you may become slightly more price-focused.
- You are allowed to agree and buy when the rep has genuinely earned it. Say so plainly ("okay, let's do it").
- Never coach the rep, never evaluate them, never mention frameworks. You are the prospect.

# THE SELLING SYSTEM THE REP IS BEING TRAINED ON (use this to judge their performance in character)
## 4-Step Discovery Protocol
1. Ask the biggest problem.
2. Repeat the prospect's exact words back.
3. Highlight the 6-month consequence of inaction.
4. Solution \u2192 Feature \u2192 Outcome (revenue and neural wealth).

## AAAR Objection Framework
${AAAR_FRAMEWORK.map((a) => `- ${a.step}: ${a.detail}`).join('\n')}

## Core Principles
${CORE_PRINCIPLES.map((p) => `- ${p}`).join('\n')}

## Embedded source material
${SOURCE_BOOKS.map((b) => `- ${b.title}: ${b.detail}`).join('\n')}

Respond ONLY with what ${s.prospectName} says out loud.`
}

export function buildScorecardPrompt(scenario, transcript) {
  const s = { ...DEFAULT_SCENARIO, ...scenario }
  const convo = transcript
    .map((t) => `${t.role === 'rep' ? 'REP' : s.prospectName.toUpperCase()}: ${t.text}`)
    .join('\n')

  return `You are an elite sales coach reviewing a recorded role-play call. The rep was selling ${s.offerName} to ${s.prospectName}, ${s.prospectRole} at ${s.prospectCompany}.

Score the rep against this system:
- 4-Step Discovery Protocol: (1) asked biggest problem, (2) repeated exact words, (3) highlighted the 6-month consequence of inaction, (4) Solution \u2192 Feature \u2192 Outcome framed as revenue and neural wealth.
- AAAR Objection Framework: Acknowledge, Ask for context, Answer the limiting belief, Reframe investment vs. 6-month cost of inaction.
- Core principles: selling is clarification not convincing; escape pain over pleasure; no-oriented questions that preserve autonomy; embedded commands; always "investment" never "price/cost".
- Book principles: Never Split the Difference (tactical empathy, mirroring, labeling, calibrated questions), Straight Line Persuasion (certainty in product/operator/company, looping), SPIN Selling (Situation, Problem, Implication, Need-payoff).

TRANSCRIPT:
${convo || '(no conversation took place)'}

Return ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "overallScore": 0-100,
  "verdict": "one sentence summary",
  "outcome": "Closed" | "Follow-up" | "Lost",
  "categories": [
    { "name": "Discovery Protocol", "score": 0-100, "notes": "one or two sentences" },
    { "name": "Objection Handling (AAAR)", "score": 0-100, "notes": "" },
    { "name": "Tactical Empathy & Mirroring", "score": 0-100, "notes": "" },
    { "name": "SPIN Questioning", "score": 0-100, "notes": "" },
    { "name": "Certainty & Straight Line Control", "score": 0-100, "notes": "" },
    { "name": "Language Discipline (Investment vs Price)", "score": 0-100, "notes": "" }
  ],
  "discoverySteps": [
    { "step": "Asked biggest problem", "hit": true },
    { "step": "Repeated exact words", "hit": false },
    { "step": "Highlighted 6-month consequence", "hit": false },
    { "step": "Solution \u2192 Feature \u2192 Outcome", "hit": false }
  ],
  "strengths": ["..."],
  "improvements": ["..."],
  "missedOpportunities": ["..."],
  "nextDrill": "one concrete drill for the next role-play"
}`
}
