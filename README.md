# Quorum Protocol

**A 20-persona synthetic focus group that stress-tests your product idea before you build it.**

> *"Stop guessing. Run the quorum."*

[![Live App](https://img.shields.io/badge/Live%20App-svc--mo84e57ac8gebo8k.buildwithlocus.com-cyan)](https://svc-mo84e57ac8gebo8k.buildwithlocus.com)
[![Deployed on BuildWithLocus](https://img.shields.io/badge/Deployed%20on-BuildWithLocus-blue)](https://beta.buildwithlocus.com)
[![Powered by Locus API](https://img.shields.io/badge/AI-Locus%20Wrapped%20OpenAI-purple)](https://beta.paywithlocus.com)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-YouTube-red?logo=youtube)](https://youtu.be/nPXiCIZkvnw)

---

## What Is Quorum Protocol?

Quorum Protocol simulates a panel of **20 fully-realized synthetic users** who interview your product idea — each with distinct demographics, income brackets, tech literacy levels, and motivations. It runs a structured research protocol, surfaces objections, feature requests, and willingness-to-pay data, then scores your idea against a **Product-Market Fit formula**.

This is not a chatbot that says "great idea." The panel is designed to include skeptics. At least **6 of the 20 personas will push back on your idea** — because that's what real focus groups do.

After the quorum, you can:
- **Re-interview the panel** — ask any follow-up question and get answers citing specific persona perspectives
- **Refine the idea** — let AI rewrite your pitch to address the top objections, then **re-run the full quorum** on the improved version

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
|  Tailwind v4     |  POST /api/generate                   |
|  React 19        |    → runs full quorum (20 personas)   |
|                  |    → returns QuorumReport JSON         |
|  ReportView      |                                       |
|  PersonaCards    |  POST /api/refine                     |
|  PMF Gauge       |    → rewrites idea to address         |
|  InsightsPanel   |      top objections                   |
|  RefinePanel     |                                       |
|  ReinterviewChat |  POST /api/reinterview                |
|  ShareButton     |    → Q&A against the panel            |
|                  |    → returns answer + persona IDs     |
|                  |                                       |
|                  |  POST /api/share → GET /api/share/:id |
|                  |    → short-link share store           |
+------------------+----------------------------------------+
|          Locus Wrapped OpenAI API                        |
|          model: gpt-4o-mini                              |
|          POST /wrapped/openai/chat                       |
+----------------------------------------------------------+
|          Deployed: BuildWithLocus (containerized)        |
+----------------------------------------------------------+
```

---

## API Routes

### `POST /api/generate`
Runs a full 20-persona quorum on a product idea.

**Request:**
```json
{ "description": "Your product idea (up to 500 chars)" }
```

**Response:**
```json
{
  "report": {
    "idea": "...",
    "pmfScore": 62,
    "verdict": "Niche Viable",
    "personas": [ /* 20 objects */ ],
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
| AI | Locus Wrapped OpenAI API |
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

## Demo Video

[![Watch on YouTube](https://img.shields.io/badge/Watch-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/nPXiCIZkvnw)

https://youtu.be/nPXiCIZkvnw

---

## Hackathon Compliance — BuildWithLocus Week 2

This project was built and submitted for the **PayGentic Week 2 Hackathon** ([devfolio](https://paygentic-week2.devfolio.co/overview)).

| Requirement | How We Met It |
|---|---|
| Deployed on BuildWithLocus | ✅ Containerized service `svc_mo84e57ac8gebo8k` — no Dockerfile, no cloud console, no DevOps |
| Uses Locus API | ✅ All AI inference routes through `POST /wrapped/openai/chat` on the Locus platform |
| PayWithLocus account | ✅ Funded via PayWithLocus wallet; credits transferred to BuildWithLocus account |
| Something cool and unique | ✅ Not another demo site — a functional synthetic research tool with a structured scoring engine and 20 engineered personas |
| Demo video | ✅ [https://youtu.be/nPXiCIZkvnw](https://youtu.be/nPXiCIZkvnw) |

The entire deployment pipeline — build, infrastructure, routing, SSL — is handled by BuildWithLocus. The only commands needed to ship were `git push` and a single API call to trigger a deploy.
