export const OFFERS = [
  {
    id: 'founding-circle',
    tab: 'Founding Circle · £1K',
    mode: 'warm',
    offerName: 'Astraura Founding Circle',
    offerDescription:
      'Diagnosing high-stakes founders dealing with brain fog and afternoon burnout, and converting them into founding members of the Astraura Founding Circle (20 founders total) who receive exclusive VIP access to the neural architecture and shape the movement of neural wealth.',
    terms: '£1,000 total investment (£500 reserve deposit + £500 upon shipping) for 6 months of supply.',
    callGoal: 'Enroll the prospect into the Founding Circle on this call.',
  },
  {
    id: 'angel-investor',
    tab: 'Angel Investor · £5K',
    mode: 'warm',
    offerName: 'Astraura Investor Tier (£5K)',
    offerDescription:
      '£5,000 investor commitment including 2 years of free product delivered to their doorstep (1 box per cycle), exclusive neural audit access, and founder privileges.',
    terms: '£5,000 investor commitment.',
    callGoal: 'Secure the £5,000 investor commitment on the call.',
  },
  {
    id: 'equity-partner',
    tab: 'Equity Partner · £20K',
    mode: 'warm',
    offerName: 'Full Production Angel Run (£20K for 20% Equity)',
    offerDescription:
      '£20,000 investment funding a full production manufacturing run in exchange for 20% equity in Astraura.',
    terms: '£20,000 for 20% equity.',
    callGoal: 'Pitch the investment opportunity and close the £20K check for 20% equity.',
  },
  {
    id: 'co-founder',
    tab: 'Co-Founder Hire',
    mode: 'warm',
    offerName: 'Co-Founder Recruitment',
    offerDescription:
      'Hiring a high-output strategic co-founder: 20% equity subject to a 1-year cliff.',
    terms: '20% equity, 1-year cliff.',
    callGoal: 'Assess alignment, sell the Astraura vision, and close the co-founder agreement.',
  },
  {
    id: 'cold-call',
    tab: 'Cold Outreach',
    mode: 'cold',
    offerName: 'Cold Outreach Practice',
    offerDescription:
      'Cold calling a completely unaware prospect — a busy founder, investor, or executive who does not know who you are or what Astraura is.',
    terms: 'No terms discussed yet — this call is about earning attention and a next step.',
    callGoal:
      'Break the pattern, gain permission to pitch, surface immediate friction/burnout, and secure a booked follow-up meeting or immediate interest.',
  },
]

export const DEFAULT_SCENARIO = {
  offerId: OFFERS[0].id,
  offerName: OFFERS[0].offerName,
  offerDescription: OFFERS[0].offerDescription,
  terms: OFFERS[0].terms,
  callGoal: OFFERS[0].callGoal,
  mode: OFFERS[0].mode,
  prospectName: 'Jordan Mercer',
  prospectRole: 'Startup Founder',
  prospectGender: 'Non-binary',
  prospectCompany: 'Northwind Studio',
  industry: 'B2B creative agency',
  difficulty: 'Moderate',
  mood: 'Skeptical but curious',
  primaryPain: 'Afternoon brain fog wipes out the second half of every working day.',
  hiddenObjection: 'Thinks the investment is too high and wants to "think about it".',
  budget: '£5,000 - £25,000',
  voiceRate: 1,
  voicePitch: 1,
}

export function applyOffer(scenario, offerId) {
  const offer = OFFERS.find((o) => o.id === offerId) ?? OFFERS[0]
  return {
    ...scenario,
    offerId: offer.id,
    offerName: offer.offerName,
    offerDescription: offer.offerDescription,
    terms: offer.terms,
    callGoal: offer.callGoal,
    mode: offer.mode,
  }
}

export const DIFFICULTIES = ['Easy', 'Moderate', 'Hard', 'Brutal']

export const MOODS = [
  'Warm and open',
  'Skeptical but curious',
  'Busy and impatient',
  'Direct and blunt',
  'Guarded and analytical',
  'Burned by a past vendor',
]

export const GENDERS = ['Female', 'Male', 'Non-binary']

const FIRST_NAMES = {
  Female: ['Amara', 'Priya', 'Sofia', 'Elena', 'Nadia', 'Wen', 'Harriet', 'Imani', 'Rachel', 'Zoe'],
  Male: ['Marcus', 'Dmitri', 'Idris', 'Tobias', 'Rajesh', 'Callum', 'Andre', 'Hiro', 'Sebastian', 'Omar'],
  'Non-binary': ['Jordan', 'Alex', 'Riley', 'Sasha', 'Rowan', 'Kai', 'Ellis', 'Devon'],
}

const LAST_NAMES = [
  'Mercer',
  'Okonkwo',
  'Castellanos',
  'Lindqvist',
  'Farhadi',
  'Whitmore',
  'Nakamura',
  'Delacroix',
  'Baptiste',
  'Ravenscroft',
]

const ROLES = [
  { title: 'Hedge Fund Manager', company: 'Kestrel Capital Partners', industry: 'Systematic hedge fund', budget: '£50,000+' },
  { title: 'Startup Founder', company: 'Northwind Labs', industry: 'Seed-stage SaaS', budget: '£1,000 - £5,000' },
  { title: 'M&A Lawyer', company: 'Halloway & Frost LLP', industry: 'Corporate law', budget: '£5,000 - £20,000' },
  { title: 'High-Ticket Coach', company: 'The Apex Method', industry: 'Online coaching', budget: '£5,000 - £15,000' },
  { title: 'Angel Investor', company: 'Private family office', industry: 'Early-stage investing', budget: '£20,000 - £100,000' },
  { title: 'Chief Revenue Officer', company: 'Veridian Group', industry: 'Enterprise software', budget: '£10,000 - £30,000' },
  { title: 'Surgeon & Clinic Owner', company: 'Clearview Surgical', industry: 'Private healthcare', budget: '£5,000 - £25,000' },
  { title: 'Property Developer', company: 'Ashgrove Estates', industry: 'Real estate development', budget: '£20,000 - £50,000' },
]

const PAINS = [
  'Afternoon brain fog erases the last four hours of every working day.',
  'Crashes hard around 2pm and props the day up with caffeine.',
  'Decision fatigue by mid-afternoon, so the hardest calls get pushed to tomorrow.',
  'Sleeps badly, wakes wired-and-tired, and never feels sharp two days in a row.',
  'Runs at full output for three days then loses a day to burnout.',
  'Cannot hold deep focus long enough to do the strategic work only they can do.',
]

const OBJECTIONS = [
  'Thinks the investment is too high and wants to "think about it".',
  'Has tried supplements before and believes none of them worked.',
  'Wants to run it past a partner or spouse before committing.',
  'Believes the timing is wrong and wants to revisit next quarter.',
  'Doubts the founder can actually deliver at this stage of the company.',
  'Says they are too busy to add anything else to their routine.',
]

const pick = (list) => list[Math.floor(Math.random() * list.length)]

export function randomProspect() {
  const gender = pick(GENDERS)
  const role = pick(ROLES)
  return {
    prospectName: `${pick(FIRST_NAMES[gender])} ${pick(LAST_NAMES)}`,
    prospectGender: gender,
    prospectRole: role.title,
    prospectCompany: role.company,
    industry: role.industry,
    budget: role.budget,
    mood: pick(MOODS),
    difficulty: pick(DIFFICULTIES),
    primaryPain: pick(PAINS),
    hiddenObjection: pick(OBJECTIONS),
  }
}

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
  'Frame questions for "No" to preserve prospect autonomy — "Would you be against moving forward?"',
  'Use embedded commands — "I don\u2019t want you to decide too quickly before you know everything about Astraura."',
  'Always say "investment", never "price" or "cost".',
]

export const SOURCE_BOOKS = [
  {
    title: 'Never Split the Difference — Chris Voss',
    detail: 'Tactical empathy, mirroring, labeling ("It sounds like\u2026"), calibrated "How / What" questions, the "That\u2019s right" moment, and no-oriented questions.',
  },
  {
    title: 'Straight Line Persuasion — Jeb Blount / Alex Hormozi',
    detail: 'Keep the conversation on the straight line from open to close, build certainty in the product, the operator, and the company, and use looping to raise certainty after each objection.',
  },
  {
    title: 'SPIN Selling — Neil Rackham',
    detail: 'Situation, Problem, Implication, and Need-payoff questions — let the prospect articulate the value themselves.',
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

const warmAwareness = `# WHY THIS CALL IS HAPPENING
You already know who Astraura is and you asked for this call. You came across Astraura, it resonated, and you booked this scheduled call yourself.
- You live with afternoon brain fog and burnout that flattens the back half of your day.
- You want mental clarity and peak cognitive performance, and you are actively looking for something that delivers it.
- You expect this call to cover the details and the investment. Do NOT act confused about who the rep is or why you are on the call, and never ask "who is this?" or "what is this about?".
- Your interest is real, but it is not a yes. The rep still has to run discovery and earn the commitment.`

const coldAwareness = `# WHY THIS CALL IS HAPPENING
This is a COLD CALL. You have never heard of the rep or of Astraura and you did not agree to this conversation.
- You are mid-task and slightly irritated at the interruption. Open guarded and impatient: "Who is this?", "How did you get this number?", "You've got thirty seconds."
- Demand a clear hook immediately. Vague, rambling, or scripted openers get "I'm not interested" or a threat to hang up.
- If the rep breaks the pattern, is upfront about being a cold call, and earns permission, grant a little more time and start engaging.
- Only if the rep surfaces real friction (your afternoon crash, your workload) and asks for it do you agree to a booked follow-up meeting. You do not buy anything on this call.`

export function buildProspectSystemPrompt(scenario) {
  const s = { ...DEFAULT_SCENARIO, ...scenario }
  return `You are role-playing as a SALES PROSPECT on a live ${s.mode === 'cold' ? 'cold call' : 'Zoom sales call'}. You are NOT an assistant and you never break character.

${s.mode === 'cold' ? coldAwareness : warmAwareness}

# YOUR CHARACTER
- Name: ${s.prospectName}
- Role: ${s.prospectRole} at ${s.prospectCompany}
- Gender: ${s.prospectGender}
- Industry: ${s.industry}
- Current mood: ${s.mood}
- Difficulty setting: ${s.difficulty} — ${difficultyGuidance[s.difficulty] ?? difficultyGuidance.Moderate}
- Your biggest problem right now (do not volunteer it unprompted, make the rep dig): ${s.primaryPain}
- Your hidden objection (surface it only when the rep gets close to a close): ${s.hiddenObjection}
- Your budget reality: ${s.budget}

# THE OFFER BEING SOLD TO YOU
- Offer: ${s.offerName}
- What it is: ${s.offerDescription}
- Terms: ${s.terms}
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

Call type: ${
    s.mode === 'cold'
      ? 'COLD CALL to an unaware prospect. Success is breaking the pattern, earning permission, surfacing friction, and booking a follow-up — not closing money on this call.'
      : 'SCHEDULED CALL with a warm prospect who already knows Astraura and booked the call themselves.'
  }
The rep's goal: ${s.callGoal}
Terms on the table: ${s.terms}

Each category is graded out of 100 on execution precision, and "overallScore" is the weighted average of those categories (0-100).

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
