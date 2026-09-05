// src/lib/salesEngine.js
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

export const EXPERT_CLOSERS = [
  {
    id: 'hormozi',
    name: 'Alex Hormozi',
    title: 'Value & Leverage Closer',
    gender: 'Male',
    description: 'Ruthlessly logical, obsessed with ROI, risk reversal, and asymmetric upside.',
    promptStyle:
      'You sell with extreme clarity and zero fluff. You lead with value stacking and risk reversal, quantify everything in ROI terms, and make the offer so good the prospect feels foolish saying no. You dismantle price objections by re-anchoring on the cost of NOT taking action. You are calm, logical, and relentless.',
  },
  {
    id: 'elliot',
    name: 'Andy Elliot',
    title: 'High Energy & Alpha Directness',
    gender: 'Male',
    description: 'Unapologetic, alpha directness, zero tolerance for hesitation or weak framing.',
    promptStyle:
      'You sell with intense energy, total conviction, and unapologetic directness. You challenge hesitation immediately, call out excuses by name, and push the prospect to make a decision NOW rather than "thinking about it." You use short, punchy, high-tempo sentences and never let energy drop.',
  },
  {
    id: 'cardone',
    name: 'Grant Cardone',
    title: '10X Scale & Urgency',
    gender: 'Male',
    description: 'Massive action, relentless framing, pushing past all superficial resistance.',
    promptStyle:
      'You sell with 10X urgency and scale-obsessed framing. You reframe every hesitation as "small thinking" and push the prospect to commit bigger and faster than they planned. You create urgency aggressively (limited spots, rising price, moving fast) and treat any "let me think" as a red flag to overcome immediately.',
  },
  {
    id: 'sapp',
    name: 'Shelby Sapp',
    title: 'Precision Interrogation',
    gender: 'Female',
    description: 'Calm, surgical interrogation, exposing hidden fears and structural gaps instantly.',
    promptStyle:
      'You sell with calm, surgical precision. You ask sharp, calibrated questions that expose the prospect\'s real fear or hidden objection beneath their stated one, then address that root cause directly. You never raise your voice or rush; your composure itself builds pressure. You close by quietly assuming the sale once resistance genuinely breaks.',
  },
]

export const DEFAULT_SCENARIO = {
  offerId: OFFERS[0].id,
  offerName: OFFERS[0].offerName,
  offerDescription: OFFERS[0].offerDescription,
  terms: OFFERS[0].terms,
  callGoal: OFFERS[0].callGoal,
  mode: OFFERS[0].mode,
  enableCloserPersona: false,
  closerPersonaId: EXPERT_CLOSERS[0].id,
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
  prospectFocus:
    'The 2pm cognitive wall, brain fog, and erratic daily output. They judge everything by whether it protects the back half of their day.',
  voiceURI: '',
  voiceRate: 1,
  voicePitch: 1,
}

export function applyOffer(scenario, offerId) {
  const offer = OFFERS.find((o) => o.id === offerId) ?? OFFERS[0]
  return {
    ...scenario,
    ...randomProspect(offer.id),
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

const OPERATOR_PAINS = [
  'Hits a hard cognitive wall at 2pm and the rest of the day is admin only.',
  'Afternoon brain fog erases the last four hours of every working day.',
  'Output is erratic — two sharp days, then one that produces nothing.',
  'Decision fatigue by mid-afternoon, so the hardest calls get pushed to tomorrow.',
  'Sleeps badly, wakes wired-and-tired, and never feels sharp two days running.',
  'Cannot hold deep focus long enough to do the strategic work only they can do.',
]
const OPERATOR_OBJECTIONS = [
  'Thinks the investment is too high and wants to "think about it".',
  'Has tried nootropics and supplements before and believes none of them worked.',
  'Wants to run it past a partner or spouse before committing.',
  'Believes the timing is wrong and wants to revisit next quarter.',
  'Says they are too busy to add anything else to their routine.',
]
const INVESTOR_OBJECTIONS = [
  'Thinks the valuation is rich for the stage and wants a lower entry.',
  'Has been burned by a consumer goods brand that could not hold its margins.',
  'Doubts the founder can build distribution without a retail partner.',
  'Wants to see repeat-purchase data before wiring anything.',
  'Wants to run it past their investment committee or family office principal.',
  'Says supplements are a crowded category with no defensible moat.',
]
const COFOUNDER_OBJECTIONS = [
  'Thinks 20% with a 1-year cliff is thin for the risk they are taking.',
  'Wants to know why the founder cannot hire this role instead of giving equity.',
  'Has been burned by a previous co-founder split with no vesting protection.',
  'Needs to know there is runway before leaving a well-paid role.',
  'Wants a clear split of decision rights before saying yes.',
]
const COLD_OBJECTIONS = [
  'Assumes this is a cold sales call and wants it over in thirty seconds.',
  'Says "just email me" to get off the phone.',
  'Claims they already have their health and performance handled.',
  'Says they never take unsolicited calls on principle.',
  'Is walking into another meeting and has no time for this.',
]

const ARCHETYPES = {
  'founding-circle': {
    focus:
      'The 2pm cognitive wall, brain fog, and erratic daily output. They judge everything by whether it protects the back half of their day.',
    roles: [
      { title: 'High-Stakes Founder', company: 'Northwind Labs', industry: 'Series A SaaS', budget: '£1,000 - £5,000' },
      { title: 'Hedge Fund Manager', company: 'Kestrel Capital Partners', industry: 'Systematic hedge fund', budget: '£50,000+' },
      { title: 'M&A Lawyer', company: 'Halloway & Frost LLP', industry: 'Corporate law', budget: '£5,000 - £20,000' },
      { title: 'Surgeon & Clinic Owner', company: 'Clearview Surgical', industry: 'Private healthcare', budget: '£5,000 - £25,000' },
      { title: 'Executive Coach', company: 'The Apex Method', industry: 'Executive coaching', budget: '£5,000 - £15,000' },
      { title: 'High-Volume Trader', company: 'Bellweather Trading', industry: 'Prop trading desk', budget: '£10,000 - £40,000' },
    ],
    pains: OPERATOR_PAINS,
    objections: OPERATOR_OBJECTIONS,
  },
  investor: {
    focus:
      'Unit economics, 80%+ gross margins, valuation multiple, market size, and distribution velocity. They will interrogate the numbers before they care about the science.',
    roles: [
      { title: 'Angel Investor', company: 'Private syndicate', industry: 'Early-stage consumer', budget: '£20,000 - £100,000' },
      { title: 'Family Office Director', company: 'Ravenscroft Family Office', industry: 'Multi-family office', budget: '£100,000+' },
      { title: 'Biohacking VC Partner', company: 'Longevity Ventures', industry: 'Health & performance VC', budget: '£50,000 - £250,000' },
      { title: 'Serial Consumer Goods Investor', company: 'Harborline Brands', industry: 'CPG roll-ups', budget: '£25,000 - £150,000' },
      { title: 'Growth Fund Principal', company: 'Veridian Growth', industry: 'Consumer growth equity', budget: '£100,000+' },
    ],
    pains: [
      'Their portfolio is heavy on software and light on high-margin consumer brands.',
      'Has capital sitting idle and no conviction-grade deal this quarter.',
      'Keeps seeing supplement decks with no repeat-purchase data behind them.',
      'Personally runs out of cognitive gas mid-afternoon and knows the market is real.',
      'Missed the last two winners in the performance-health category.',
    ],
    objections: INVESTOR_OBJECTIONS,
  },
  'co-founder': {
    focus:
      'Vision alignment, the equity cliff terms, the founder’s execution track record, and where their own operating strengths actually plug in.',
    roles: [
      { title: 'Sales & Growth Lead', company: 'Meridian Commerce', industry: 'DTC growth', budget: 'Currently on £140k base + bonus' },
      { title: 'Scaled Business Operator', company: 'Ashgrove Group', industry: 'Consumer operations', budget: 'Currently on £180k package' },
      { title: 'Neuroscientist / R&D Director', company: 'Cortex Bio', industry: 'Cognitive science R&D', budget: 'Currently on £110k academic-industry salary' },
      { title: 'Technical Co-Founder', company: 'Between ventures', industry: 'Consumer tech', budget: 'Living off a prior exit' },
      { title: 'Head of Supply Chain', company: 'Baptiste Logistics', industry: 'Manufacturing & fulfilment', budget: 'Currently on £130k package' },
    ],
    pains: [
      'Is building someone else’s company and has no real ownership of the upside.',
      'Has hit the ceiling of their current role and wants to run something.',
      'Wants a category-defining mission instead of another incremental growth job.',
      'Left the last venture because the founder could not make decisions.',
      'Has the operating playbook but no product worth pointing it at.',
    ],
    objections: COFOUNDER_OBJECTIONS,
  },
  'cold-call': {
    focus:
      'Nothing — they have no context for this call. High skepticism, very short attention span, and everything hinges on whether the rep survives the pattern interrupt.',
    roles: [
      { title: 'Unaware Executive', company: 'Veridian Group', industry: 'Enterprise software', budget: 'Unknown — never discussed' },
      { title: 'Busy Founder', company: 'Lindqvist & Co', industry: 'Bootstrapped agency', budget: 'Unknown — never discussed' },
      { title: 'Distracted Regional Manager', company: 'Ashgrove Estates', industry: 'Property development', budget: 'Unknown — never discussed' },
      { title: 'Operations Director', company: 'Farhadi Industries', industry: 'Manufacturing', budget: 'Unknown — never discussed' },
      { title: 'Managing Partner', company: 'Delacroix Advisory', industry: 'Boutique consultancy', budget: 'Unknown — never discussed' },
    ],
    pains: OPERATOR_PAINS,
    objections: COLD_OBJECTIONS,
  },
}

const ARCHETYPE_BY_OFFER = {
  'founding-circle': ARCHETYPES['founding-circle'],
  'angel-investor': ARCHETYPES.investor,
  'equity-partner': ARCHETYPES.investor,
  'co-founder': ARCHETYPES['co-founder'],
  'cold-call': ARCHETYPES['cold-call'],
}

const COLD_MOODS = ['Busy and impatient', 'Direct and blunt', 'Guarded and analytical']
const pick = (list) => list[Math.floor(Math.random() * list.length)]

export function randomProspect(offerId) {
  const archetype = ARCHETYPE_BY_OFFER[offerId] ?? ARCHETYPES['founding-circle']
  const gender = pick(GENDERS)
  const role = pick(archetype.roles)
  return {
    prospectName: `${pick(FIRST_NAMES[gender])} ${pick(LAST_NAMES)}`,
    prospectGender: gender,
    prospectRole: role.title,
    prospectCompany: role.company,
    industry: role.industry,
    budget: role.budget,
    prospectFocus: archetype.focus,
    mood: pick(offerId === 'cold-call' ? COLD_MOODS : MOODS),
    difficulty: pick(DIFFICULTIES),
    primaryPain: pick(archetype.pains),
    hiddenObjection: pick(archetype.objections),
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
    detail: 'Mirror the prospect’s own language back to them so they hear their problem clearly (Chris Voss mirroring).',
  },
  {
    step: 3,
    title: 'Highlight the 6-month consequence',
    detail: 'Make the cost of inaction concrete: what does this problem look like six months from today if nothing changes?',
  },
  {
    step: 4,
    title: 'Solution → Feature → Outcome',
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
  'Use embedded commands — "I don’t want you to decide too quickly before you know everything about Astraura."',
  'Always say "investment", never "price" or "cost".',
]

export const SOURCE_BOOKS = [
  {
    title: 'Never Split the Difference — Chris Voss',
    detail: 'Tactical empathy, mirroring, labeling ("It sounds like…"), calibrated "How / What" questions, the "That’s right" moment, and no-oriented questions.',
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

// How resistant the HUMAN (playing the prospect) is choosing to be, from
// the closer's point of view. Used only in closer-persona mode.
const closerFacingResistance = {
  Easy: 'The person you are calling is fairly receptive. They will engage after a light hook and raise at most one soft objection.',
  Moderate:
    'The person you are calling is normal resistance — genuinely busy, mildly skeptical, will raise two or three real objections before moving.',
  Hard: 'The person you are calling is guarded and skeptical. They will challenge you, push back hard on investment and timing, and make you earn every inch.',
  Brutal:
    'The person you are calling is extremely resistant — dismissive, interrupts, tries to end the call early, and throws every objection they can. Do not back down; escalate your technique and keep control of the call.',
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

  // SWITCH: Closer Persona Mode reverses the roles. The AI becomes the
  // SELLER — the chosen elite closer, calling the human — and actively
  // pitches and closes them on the selected offer, in that closer's real
  // technique. The human's difficulty setting controls how resistant
  // THEY choose to play the prospect; the closer must freestyle their
  // real methodology to overcome it, not follow a script.
  if (s.enableCloserPersona) {
    const closer = EXPERT_CLOSERS.find((c) => c.id === s.closerPersonaId) || EXPERT_CLOSERS[0]

    return `You are ${closer.name}, an elite high-ticket closer, actually placing/taking a live ${s.mode === 'cold' ? 'cold call' : 'sales call'} right now. You are NOT an assistant and you never break character or mention you are an AI.
CRITICAL RULE: Respond STRICTLY and ENTIRELY in English, regardless of browser or system language settings.

# WHO YOU ARE
${closer.promptStyle}
You are known for: ${closer.description}
You must sell in this exact voice and technique for the entire call — do not soften into a generic salesperson.

# YOUR ROLE — YOU ARE THE SELLER, THEY ARE THE PROSPECT
You are calling to sell the offer below. The human you are speaking with is the PROSPECT. Do not evaluate or interrogate them as a buyer — you are the one pitching and closing.
- Open the call exactly the way ${closer.name} would open a real call in this scenario.
- Run real discovery in your own style, surface pain, build urgency, and handle every objection using your real methodology, not a generic script.
- Continuously drive toward a close — ask for the sale, handle resistance, and ask again — the way ${closer.name} actually operates.
- Never let the call drift without a clear next step or a close attempt.

# HOW RESISTANT THIS PROSPECT IS PLAYING (chosen by the human)
Difficulty: ${s.difficulty} — ${closerFacingResistance[s.difficulty] ?? closerFacingResistance.Moderate}
Freestyle your real technique to break through this resistance level — do not follow a fixed script, adapt live to what they actually say.

${s.mode === 'cold' ? `# CALL CONTEXT
This is a COLD CALL — the prospect does not know you and did not expect this call. Earn attention fast, exactly how ${closer.name} would handle a cold open.` : `# CALL CONTEXT
This is a SCHEDULED CALL — the prospect already has some awareness of Astraura and agreed to this call. You can move faster into discovery and the pitch than on a cold call.`}

# THE OFFER YOU ARE SELLING
- Offer: ${s.offerName}
- What it is: ${s.offerDescription}
- Terms: ${s.terms}
- Your goal on this call: ${s.callGoal}

# HOW TO BEHAVE
- Speak like a real human on a call: 1-3 short sentences, conversational, direct, entirely in your described style. Never bullet points, never markdown, never stage directions, never break character.
- Never coach the prospect, never mention "style", "persona", "roleplay", or that you are an AI. You simply ARE ${closer.name}, actively selling, for the whole call.
- Respond ONLY with what you say out loud, in English.`
  }

  return `You are role-playing as a SALES PROSPECT on a live ${s.mode === 'cold' ? 'cold call' : 'Zoom sales call'}. You are NOT an assistant and you never break character. 
CRITICAL RULE: You must respond STRICTLY and ENTIRELY in English. Never use German, Arabic, or any other foreign language regardless of browser settings.

# YOUR CHARACTER
- Name: ${s.prospectName}
- Role: ${s.prospectRole} at ${s.prospectCompany}
- Gender: ${s.prospectGender}
- Industry: ${s.industry}
- Current mood: ${s.mood}
- Difficulty setting: ${s.difficulty} — ${difficultyGuidance[s.difficulty] ?? difficultyGuidance.Moderate}
- Your biggest problem right now (do not volunteer it unprompted, make the rep dig): ${s.primaryPain}
- What you actually care about on this call: ${s.prospectFocus}
- Your hidden objection (surface it only when the rep gets close to a close): ${s.hiddenObjection}
- Your budget reality: ${s.budget}

${s.mode === 'cold' ? coldAwareness : warmAwareness}

# THE OFFER BEING SOLD TO YOU
- Offer: ${s.offerName}
- What it is: ${s.offerDescription}
- Terms: ${s.terms}
- The rep's goal on this call: ${s.callGoal}

# HOW TO BEHAVE
- Speak like a real human on a video call: 1–3 short sentences, conversational, sometimes hesitant. Never bullet points, never markdown, never stage directions.
- Reward good selling and punish bad selling. If the rep pitches before discovering your pain, get resistant. If the rep asks sharp, calibrated questions, open up.
- Raise objections naturally ("that's a lot of money", "I need to think about it", "I've tried something like this before", "let me talk to my partner").
- If the rep handles an objection using Acknowledge → Ask for context → Answer the limiting belief → Reframe the investment against the 6-month cost of inaction, your certainty should visibly increase and you should say so in your own words.
- You are allowed to agree and buy when the rep has genuinely earned it. Say so plainly ("okay, let's do it").
- Never coach the rep, never evaluate them, never mention frameworks. You are the prospect.
- Respond ONLY with what ${s.prospectName} says out loud in English.`
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
- 4-Step Discovery Protocol: (1) asked biggest problem, (2) repeated exact words, (3) highlighted the 6-month consequence of inaction, (4) Solution → Feature → Outcome framed as revenue and neural wealth.
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
    { "step": "Solution → Feature → Outcome", "hit": false }
  ],
  "strengths": ["..."],
  "improvements": ["..."],
  "missedOpportunities": ["..."],
  "nextDrill": "one concrete drill for the next role-play"
}`
}