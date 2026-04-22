import type { QuorumReport, ReinterviewResponse, Persona, PersonaChatMessage } from "./types";
import { GENERATE_SYSTEM_PROMPT, REINTERVIEW_SYSTEM_PROMPT } from "./prompts";

const LOCUS_BASE =
  process.env.LOCUS_API_BASE ?? "https://beta-api.paywithlocus.com/api";
const LOCUS_KEY = process.env.LOCUS_API_KEY ?? "";

export const isLocusConfigured = (): boolean =>
  Boolean(LOCUS_KEY) &&
  LOCUS_KEY.startsWith("claw_") &&
  !LOCUS_KEY.includes("your_") &&
  !LOCUS_KEY.includes("_here");

type OpenAIResponse = {
  choices: Array<{ message: { content: string } }>;
};

async function locusChat(
  messages: { role: string; content: string }[],
  maxTokens: number,
  temperature: number
): Promise<string> {
  const res = await fetch(`${LOCUS_BASE}/wrapped/openai/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOCUS_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(
      data.message ?? data.error ?? `Locus API error (${res.status})`
    );
  }

  const result = data.data as OpenAIResponse;
  return result.choices?.[0]?.message?.content ?? "";
}

function stripFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export async function runQuorum(description: string): Promise<QuorumReport> {
  if (!isLocusConfigured()) {
    return generateStubReport(description);
  }

  const raw = await locusChat(
    [
      { role: "system", content: GENERATE_SYSTEM_PROMPT },
      { role: "user", content: `My idea: ${description}` },
    ],
    4000,
    0.8
  );

  const cleaned = stripFences(raw);
  let report: QuorumReport;

  try {
    report = JSON.parse(cleaned);
  } catch {
    // Retry once with stricter instruction
    const retry = await locusChat(
      [
        { role: "system", content: GENERATE_SYSTEM_PROMPT },
        {
          role: "user",
          content: `My idea: ${description}. IMPORTANT: Output ONLY the raw JSON object. No markdown, no backticks, no explanation. Start with { and end with }`,
        },
      ],
      4000,
      0.5
    );
    report = JSON.parse(stripFences(retry));
  }

  if (!Array.isArray(report.personas) || report.personas.length === 0) {
    throw new Error("Invalid report: personas array missing");
  }

  return report;
}

export async function reinterviewPersonas(
  report: QuorumReport,
  question: string
): Promise<ReinterviewResponse> {
  const contextPayload = {
    idea: report.idea,
    pmfScore: report.pmfScore,
    verdict: report.verdict,
    personas: report.personas,
  };

  const raw = await locusChat(
    [
      { role: "system", content: REINTERVIEW_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Research context:\n${JSON.stringify(contextPayload, null, 2)}\n\nFollow-up question: ${question}`,
      },
    ],
    1000,
    0.7
  );

  return JSON.parse(stripFences(raw)) as ReinterviewResponse;
}

export async function chatWithPersona(
  persona: Persona,
  idea: string,
  history: PersonaChatMessage[],
  newMessage: string
): Promise<string> {
  const systemPrompt = `You are ${persona.name}, a ${persona.age}-year-old ${persona.occupation} earning ${persona.income}.

Background: ${persona.background}
Tech literacy: ${persona.techLiteracy}
You ${persona.wouldUse ? "would use" : "would NOT use"} this product.
You ${persona.wouldPay ? `would pay around ${persona.suggestedPrice}` : "would NOT pay for this"}.
Your main objection: ${persona.mainObjection}
The one feature that would win you over: ${persona.killerFeature}
Your general sentiment: ${persona.sentiment}

The product being discussed: ${idea}

CRITICAL RULES:
- Stay fully in character as ${persona.name} at all times. Never break character.
- Respond in first person, conversationally, as this real human would.
- Keep responses to 2-4 sentences — natural and direct, like a real user interview.
- Your opinions are grounded in your background, income, and tech literacy.
- Don't be a pushover — if you have objections, stand your ground unless genuinely convinced.
- Do NOT mention you are an AI or a simulation.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: newMessage },
  ];

  return await locusChat(messages, 300, 0.85);
}

// ─── Stub (when API key not configured) ──────────────────────────────────────

function generateStubReport(description: string): QuorumReport {
  const names = ["Alex Chen", "Maria Santos", "James Okafor", "Priya Patel", "Sam Wilson", "Fatima Al-Hassan", "Tom Brady Jr", "Yuki Tanaka", "Carlos Mendez", "Emma Johnson", "Kwame Asante", "Sarah Kim", "Diego Ramirez", "Nadia Petrov", "Ben Clarke", "Aisha Mohammed", "Ryan O'Brien", "Lin Wei", "Zoe Anderson", "Marcus Williams"];
  const occupations = ["Software Engineer", "Nurse", "Small Business Owner", "Product Manager", "Retired Teacher", "Marketing Director", "College Student", "UX Designer", "Freelance Writer", "Data Analyst", "Accountant", "Sales Rep", "Chef", "HR Manager", "Gig Worker", "Lawyer", "Farmer", "Graphic Designer", "Social Worker", "Venture Capitalist"];
  const incomes = ["$95k/yr", "$58k/yr", "$72k/yr", "$110k/yr", "$35k/yr", "$130k/yr", "$18k/yr", "$88k/yr", "$45k/yr", "$82k/yr", "$65k/yr", "$52k/yr", "$41k/yr", "$78k/yr", "$22k/yr", "$150k/yr", "$38k/yr", "$55k/yr", "$47k/yr", "$200k/yr"];
  const ages = [24, 31, 45, 28, 52, 37, 22, 41, 33, 26, 48, 29, 35, 43, 19, 38, 56, 27, 32, 44];
  const techLits = ["high", "medium", "medium", "high", "low", "high", "high", "high", "medium", "high", "medium", "medium", "low", "medium", "medium", "high", "low", "medium", "low", "high"] as const;
  const sentiments = ["positive", "positive", "neutral", "positive", "negative", "positive", "neutral", "positive", "negative", "positive", "neutral", "positive", "negative", "neutral", "positive", "neutral", "negative", "neutral", "negative", "positive"] as const;
  const quotes = ["This could really change how I work.", "I'd try it but need to see proof first.", "Honestly not convinced yet — too many tools already.", "Show me the data and I'm in.", "My team already uses something else for this.", "If the price is right, absolutely yes.", "Cool concept but needs more integrations.", "I'd pay for this — solves a real problem I have.", "Not sure I actually have this problem.", "Would recommend to others in my circle.", "Needs better documentation before I'd trust it.", "Love the concept — hate the current alternatives.", "Too many SaaS tools already killing my budget.", "Could replace what I'm cobbling together now.", "Would share this with my whole network.", "Let me think about it after I see the roadmap.", "Not really for someone in my industry.", "Interesting but not urgent enough to pay for.", "Would use if there's a free tier.", "I can see real long-term value here."];
  const objections = ["Unclear ROI vs existing tools", "Privacy and data security concerns", "Team adoption friction", "Budget constraints this quarter", "Don't fully understand the value prop", "Already committed to a competitor", "Needs more integrations", "Skeptical about AI-generated insights", "Too new — needs more social proof", "Not a priority right now", "Learning curve too steep", "Would need IT approval", "Our workflow is different", "Need a mobile app first", "Pricing model doesn't fit", "Support quality unknown", "Need to see case studies", "Our use case is too niche", "Compliance/legal concerns", "Just not relevant to me"];
  const killerFeatures = ["Slack + CRM integration", "Compelling free tier", "Analytics dashboard", "Offline mode", "Team collaboration features", "API access for developers", "Custom persona templates", "White-label option", "Better onboarding flow", "Export to PDF/Notion", "Real user validation pairing", "ROI calculator", "Simpler pricing model", "SSO support", "Industry-specific templates", "Mobile app", "Comparison with competitors", "Community forum", "Dedicated customer success", "Enterprise security features"];

  const personas = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: names[i],
    age: ages[i],
    occupation: occupations[i],
    income: incomes[i],
    background: `Has been in their field for ${[3, 8, 15, 5, 25, 10, 2, 12, 7, 4, 18, 6, 11, 9, 1, 14, 30, 4, 7, 20][i]} years.`,
    techLiteracy: techLits[i],
    wouldUse: i < 13,
    wouldPay: i < 8,
    suggestedPrice: i < 8 ? ["$15/mo", "$20/mo", "$10/mo", "$25/mo", "$12/mo", "$30/mo", "$18/mo", "$15/mo"][i] : "Would not pay",
    mainObjection: objections[i],
    killerFeature: killerFeatures[i],
    quote: `"${quotes[i]}"`,
    sentiment: sentiments[i],
  }));

  return {
    idea: description,
    pmfScore: 63,
    verdict: "Niche Viable",
    personas,
    topObjections: [
      "Unclear ROI compared to existing solutions",
      "Trust and data security concerns with a new platform",
      "Adoption friction — hard to get the whole team on board",
    ],
    topFeatureRequests: [
      "Integrations with existing tools (Slack, CRM, Notion)",
      "A compelling free tier or time-limited trial",
      "Analytics and reporting dashboard",
    ],
    willingToPay: { percentage: 40, averagePrice: "$18/mo" },
    targetSegment: "Early-stage founders and product managers at startups who move fast and make high-stakes decisions with incomplete information.",
    pivotSuggestion: "Offer a free tier limited to 5 personas per month. The conversion bottleneck should be scale, not initial access — let users experience value first.",
    summary: `This is a stub report. Configure LOCUS_API_KEY for real AI-generated results. Simulated research on "${description}" suggests moderate product-market fit (63/100) with strong resonance among tech-savvy early adopters. Main blockers are unclear ROI and team adoption friction. A free tier and integrations would meaningfully improve conversion.`,
  };
}

