# Quorum Protocol

**Real focus groups cost $5,000. We charge $0.25. And the AI panelists are meaner.**

> *"Stop guessing. Run the quorum."*

[![Live App](https://img.shields.io/badge/Live%20App-svc--mo84e57ac8gebo8k.buildwithlocus.com-cyan)](https://svc-mo84e57ac8gebo8k.buildwithlocus.com)
[![Deployed on BuildWithLocus](https://img.shields.io/badge/Deployed%20on-BuildWithLocus-blue)](https://beta.buildwithlocus.com)
[![Powered by Locus API](https://img.shields.io/badge/AI-Locus%20Wrapped%20OpenAI-purple)](https://beta.paywithlocus.com)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-YouTube-red?logo=youtube)](https://youtu.be/nPXiCIZkvnw)

---

## What Is Quorum Protocol?

Quorum Protocol is a **pay-per-validation research engine**. You pay a few cents in USDC, and 20 synthetic users tear your idea apart — each with distinct demographics, income, tech literacy, and motivations. You get a PMF score, ranked objections, willingness-to-pay data, and verbatim quotes from each persona.

Then the mechanic gets interesting: **you can keep iterating**. The AI rewrites your pitch to address the top objections. You pay again. You run the quorum again. You watch the score move. Each cent you spend is a real on-chain transaction — the feedback loop is literally metered by micropayments.

This is not a chatbot that says "great idea." At least **6 of the 20 personas are designed to push back** — because that's what real focus groups do.

After the quorum, you can:
- **Re-interview the panel** — ask any follow-up question and get answers citing specific persona perspectives
- **Refine the idea** — let AI rewrite your pitch to address the top objections, then **re-run the full quorum** on the improved version

---

## The Loop

This is what separates Quorum Protocol from a one-shot AI tool:

```
1. Pay $0.25 USDC  →  20 personas roast your idea  →  PMF Score: 41
                              ↓
2. AI rewrites your pitch addressing the top 3 objections
                              ↓
3. Pay $0.25 USDC  →  Same rigor, new framing  →  PMF Score: 63
                              ↓
4. Repeat until you hit 70+ or pivot
```

Every iteration is a real on-chain USDC payment. The score going up (or not) is proof that the feedback is grounded — not just flattery. You're not paying for content, you're paying for a signal.

---

## Pricing

Every quorum run is paid in USDC via **Locus Checkout** — no accounts, no credit cards.

| Tier | Price | Personas | Market Intelligence |
|---|---|---|---|
| Quick Scan | **$0.10 USDC** | 10 synthetic users | Standard |
| Full Panel | **$0.25 USDC** | 20 synthetic users | Standard |
| Deep Dive | **$0.50 USDC** | 20 synthetic users | + Live web search via Brave Search |

Payment is completed through the **Locus Checkout popup** — users can pay with a Locus Wallet, MetaMask, or any WalletConnect wallet. Reports are generated immediately after on-chain confirmation.

### Free Demo
Not ready to pay? There's a "try a free demo" link on the run page that loads a pre-generated stub report — no payment, no API key required. The full UI is explorable.

### How Deep Dive Works
Before generating personas, Deep Dive calls **Locus Wrapped Brave Search** to query real-time information about the idea's competitive landscape and market trends. These results are injected directly into the persona generation prompt — so Deep Dive personas reference actual competitors, price points, and recent news in their objections and quotes, not just hallucinated context.

---

## The PMF Score

Every quorum produces a score from 0–100 based on a concrete formula:

```
Base = (wouldUse / 20) * 60 + (wouldPay / 20) * 40
Final = Base - realismPenalty (0–15 points for niche/early-stage ideas)
```

| Score | Verdict |
|---|---|
| 70–100 | Strong Fit |
| 50–69 | Niche Viable |
| 30–49 | Needs Pivoting |
| 0–29 | Don't Build |

---

## The 20-Persona Engine

The panel is not random. Each quorum enforces strict diversity constraints:

| Dimension | Distribution |
|---|---|
| Age | 18–65, spread across range |
| Income | Low ($20k–40k), Middle ($40k–80k), High ($80k–200k+) |
| Tech Literacy | ≥5 low, ≥6 medium, ≥9 high |
| Sentiment | ≥7 positive, ≥5 neutral, ≥6 negative |
| Occupations | Students, professionals, freelancers, executives, retirees, creators, blue-collar |
| Names | Culturally diverse — not all Western |

Each persona carries: `name`, `age`, `occupation`, `income`, `background`, `techLiteracy`, `wouldUse`, `wouldPay`, `suggestedPrice`, `mainObjection`, `killerFeature`, and a verbatim `quote` in their authentic voice.

This structure means you can drill into **why** a segment won't pay, not just that they won't.

---

## Architecture

```
+-----------------------------------------------------------+
|                   QUORUM PROTOCOL                         |
+------------------+----------------------------------------+
|  FRONTEND        |  BACKEND (Next.js App Router)         |
|  Next.js 15      |                                       |
|  Tailwind v4     |  POST /api/checkout                   |
|  React 19        |    → creates Locus Checkout session   |
|                  |    → returns sessionId                 |
|  TierSelector    |                                       |
|  LocusCheckout   |  POST /api/generate                   |
|  ReportView      |    → runs quorum (10 or 20 personas)  |
|  PersonaCards    |    → for Deep Dive: calls Brave Search |
|  PMF Gauge       |      then injects market context      |
|  InsightsPanel   |    → returns QuorumReport JSON        |
|  RefinePanel     |                                       |
|  ReinterviewChat |  POST /api/refine                     |
|  ShareButton     |    → rewrites idea to address         |
|                  |      top objections                   |
|                  |                                       |
|                  |  POST /api/reinterview                |
|                  |    → Q&A against the panel            |
|                  |    → returns answer + persona IDs     |
|                  |                                       |
|                  |  POST /api/share → GET /api/share/:id |
|                  |    → short-link share store           |
+------------------+----------------------------------------+
|   Locus Checkout API   |   Locus Wrapped OpenAI           |
|   POST /checkout/sessions  |  POST /wrapped/openai/chat  |
|   (session creation)   |   model: gpt-4o-mini            |
+------------------------+---------------------------------+
|   Locus Wrapped Brave Search (Deep Dive only)            |
|   POST /wrapped/brave/search                             |
|   (live market context injected into prompt)             |
+----------------------------------------------------------+
|          Deployed: BuildWithLocus (containerized)        |
+----------------------------------------------------------+
```

---

## API Routes

### `POST /api/checkout`
Creates a Locus Checkout session for the selected tier. Returns a `sessionId` to pass to the `<LocusCheckout>` component.

**Request:**
```json
{ "tier": "full", "description": "Your product idea" }
```

**Response:**
```json
{ "sessionId": "uuid" }
```

### `POST /api/generate`
Runs a quorum on a product idea. For Deep Dive tier, first calls Brave Search to gather live market context.

**Request:**
```json
{ "description": "Your product idea (up to 500 chars)", "tier": "full" }
```

**Response:**
```json
{
  "report": {
    "idea": "...",
    "pmfScore": 62,
    "verdict": "Niche Viable",
    "personas": [ /* 10 or 20 objects */ ],
    "topObjections": ["...", "...", "..."],
    "topFeatureRequests": ["...", "...", "..."],
    "willingToPay": { "percentage": 45, "averagePrice": "$18/mo" },
    "targetSegment": "...",
    "pivotSuggestion": "...",
    "summary": "..."
  }
}
```

### `POST /api/refine`
Rewrites the product idea to address the panel's top objections.

**Request:** `{ "report": QuorumReport }`  
**Response:** `{ "refinedIdea": "string" }`

### `POST /api/reinterview`
Ask the panel a follow-up question. The AI answers citing specific persona perspectives.

**Request:** `{ "report": QuorumReport, "question": "string" }`  
**Response:** `{ "answer": "string", "relevantPersonas": [1, 7, 12, ...] }`

### `POST /api/share` / `GET /api/share/:id`
Save and retrieve a report via a 10-character short ID (e.g. `/report/a3f8c92b10`).

---

## Live Deployment

| Resource | URL |
|---|---|
| App | https://svc-mo84e57ac8gebo8k.buildwithlocus.com |
| Platform | BuildWithLocus |
| AI Backend | Locus Wrapped OpenAI (`gpt-4o-mini`) |
| Demo Video | https://youtu.be/nPXiCIZkvnw |

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Locus Wrapped OpenAI API (`gpt-4o-mini`) |
| Payments | Locus Checkout (USDC on Base, 3 tiers: $0.10 / $0.25 / $0.50) |
| Market Data | Locus Wrapped Brave Search (Deep Dive tier) |
| Deployment | BuildWithLocus (containerized, Node 20) |
| Build | nixpacks — `npm install → npm run build → npm start` |

---

## Running Locally

```bash
git clone https://github.com/Gideon145/quorum-protocol.git
cd quorum-protocol
npm install

# Create .env.local
echo "LOCUS_API_KEY=your_claw_key_here" >> .env.local
echo "LOCUS_API_BASE=https://beta-api.paywithlocus.com/api" >> .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a valid `LOCUS_API_KEY`, the app falls back to a stub report so the UI is still explorable.

---

## Persona Data Schema

```typescript
interface Persona {
  id: number;
  name: string;
  age: number;
  occupation: string;
  income: string;            // e.g. "$45,000/yr"
  background: string;        // 1-sentence life context
  techLiteracy: "low" | "medium" | "high";
  wouldUse: boolean;
  wouldPay: boolean;
  suggestedPrice: string;    // e.g. "$10/mo" or "Would not pay"
  mainObjection: string;
  killerFeature: string;
  quote: string;             // verbatim quote in their voice
  sentiment: "positive" | "neutral" | "negative";
}
```

---

## Report Preview

> A real quorum report on **"A fish farm that sells directly to restaurants using an app"** — scored 58/100 (Niche Viable). 14/20 personas said they'd use it. The top objection: *"I already have distributor relationships. Why would I switch to an app?"* The top feature request: *live inventory + same-day booking*. [Try it free →](https://svc-mo84e57ac8gebo8k.buildwithlocus.com/run)

---

## Demo Video

[![Watch on YouTube](https://img.shields.io/badge/Watch-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/nPXiCIZkvnw)

https://youtu.be/nPXiCIZkvnw

---

## Live Payment Proof

Real USDC payment processed through Locus on Base — Apr 22, 2026.

| Payment Complete | Locus Purchases Dashboard |
|---|---|
| ![Payment Complete](screenshots/payment-complete.png) | ![Locus Purchases Confirmed](screenshots/locus-purchases-confirmed.png) |

**Transaction:** [`0x0a04e8dc...983a7`](https://basescan.org/tx/0x0a04e8dc2a161b6634f5004f4190b3ae92d873af16f66e33698b4860e85983a7) — 0.50 USDC · Deep Dive — Quorum Protocol · Base mainnet · CONFIRMED

---

## Hackathon Compliance — BuildWithLocus Week 2

This project was built and submitted for the **PayGentic Week 2 Hackathon** ([devfolio](https://paygentic-week2.devfolio.co/overview)).

| Requirement | How We Met It |
|---|---|
| Deployed on BuildWithLocus | ✅ Containerized service `svc_mo84e57ac8gebo8k` — no Dockerfile, no cloud console, no DevOps |
| Uses Locus API | ✅ AI inference via `POST /wrapped/openai/chat`; Deep Dive uses `POST /wrapped/brave/search` for live market context |
| Locus Checkout | ✅ 3-tier USDC pricing ($0.10/$0.25/$0.50) via `POST /checkout/sessions` + hosted checkout page |
| PayWithLocus account | ✅ Funded via PayWithLocus wallet; credits transferred to BuildWithLocus account |
| Demo video | ✅ [https://youtu.be/nPXiCIZkvnw](https://youtu.be/nPXiCIZkvnw) |

The entire deployment pipeline — build, infrastructure, routing, SSL — is handled by BuildWithLocus. The only commands needed to ship were `git push` and a single API call to trigger a deploy.
