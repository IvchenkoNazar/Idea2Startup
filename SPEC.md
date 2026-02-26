# Idea2Startup — Technical Specification

## Overview

**Idea2Startup** — AI-powered platform for validating and developing startup ideas. Users describe their idea, and AI guides them through a structured validation pipeline, providing real-time market research, competitor analysis, and business model generation.

**Approach:** Smart Chat First — chat-driven interface with a Live Dashboard that updates in real-time as AI generates structured artifacts.

---

## Target Users

- **Beginners** — people with an idea but no startup experience. Need step-by-step guidance in simple language.
- **Experienced entrepreneurs** — want to quickly validate a new idea without basic explanations.
- The system adapts tone and depth based on user level.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Backend/DB | Supabase (PostgreSQL + Auth + Realtime) |
| Auth | Supabase Auth (Email + Google) |
| AI | AWS Bedrock (Claude) |
| Web Search | Serper.dev |
| Startup Data | Product Hunt API (GraphQL) |
| i18n | next-intl (EN + UA) |
| Deploy | Vercel (free tier) |

---

## Idea Validation Pipeline

AI guides the user through 6 stages sequentially:

### Stage 1 — Idea Capture
- User describes their idea in free form
- AI asks clarifying questions, refines and formulates a clear description
- **Artifact:** Idea Summary card (title, description, target audience, problem statement)

### Stage 2 — Market Research
- AI uses web search (Serper.dev) and Product Hunt API to analyze the market
- Identifies market size, trends, existing demand
- **Artifact:** Market Overview card (market size, trends, demand signals)

### Stage 3 — Competitor Analysis
- AI finds and analyzes direct/indirect competitors
- Compares their strengths, weaknesses, pricing, features
- **Artifact:** Competitors card (comparative table)

### Stage 4 — Unique Value Proposition
- Based on competitor gaps, AI helps find a unique differentiator
- Explores potential "killer features"
- **Artifact:** UVP card (unique value proposition statement + differentiators)

### Stage 5 — Business Model Canvas
- AI fills in Lean Canvas through dialogue
- Covers: problem, solution, key metrics, unfair advantage, channels, customer segments, cost structure, revenue streams
- **Artifact:** Lean Canvas card (interactive canvas)

### Stage 6 — Scoring & Verdict
- AI evaluates the idea across criteria: market size, competition level, uniqueness, feasibility, monetization potential
- Generates a final score (0-100) with explanation
- **Artifact:** Score card (radial diagram + breakdown by criteria)

---

## Architecture

### AI Response Format

AI returns mixed content — text for chat and structured artifacts for dashboard in a single streamed response:

```
Here's what I found about your competitors...

<artifact type="competitors" action="create">
{
  "competitors": [
    {
      "name": "Validator AI",
      "url": "https://example.com",
      "description": "AI-powered idea validation tool",
      "strengths": ["Fast analysis", "Large database"],
      "weaknesses": ["No business model generation", "English only"]
    }
  ]
}
</artifact>

As we can see, the main competitor is Validator AI, but they lack...
```

**Stream Parser** splits this in real-time:
- `<text>` → renders in chat with markdown
- `<artifact>` → saves to DB + updates Dashboard card

### Artifact Actions
- `create` — new card appears on Dashboard
- `update` — existing card updates with new data
- `replace` — card is fully replaced

---

## Project Structure

```
idea2startup/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── [locale]/               # i18n (en/uk)
│   │   │   ├── layout.tsx          # Root layout with auth check
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # List of user's ideas
│   │   │   └── idea/
│   │   │       └── [id]/
│   │   │           └── page.tsx    # Workspace: Chat + Live Dashboard
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts        # AI streaming endpoint
│   │       ├── search/
│   │       │   └── route.ts        # Serper + Product Hunt proxy
│   │       └── webhooks/
│   │           └── route.ts        # Supabase webhooks
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── dashboard/
│   │   │   ├── LiveDashboard.tsx
│   │   │   ├── IdeaSummaryCard.tsx
│   │   │   ├── CompetitorCard.tsx
│   │   │   ├── UVPCard.tsx
│   │   │   ├── LeanCanvasCard.tsx
│   │   │   └── ScoreCard.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── WorkspaceLayout.tsx # Split: Chat | Dashboard
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── middleware.ts       # Auth middleware
│   │   ├── ai/
│   │   │   ├── bedrock.ts          # AWS Bedrock client
│   │   │   ├── prompts.ts          # System prompts per stage
│   │   │   └── parser.ts           # Stream parser (text + structured data)
│   │   ├── search/
│   │   │   ├── serper.ts           # Google search via Serper.dev
│   │   │   └── producthunt.ts      # Product Hunt GraphQL client
│   │   └── i18n/
│   │       ├── config.ts
│   │       ├── en.json
│   │       └── uk.json
│   ├── hooks/
│   │   ├── useChat.ts              # Chat logic + streaming
│   │   ├── useDashboard.ts         # Dashboard state from parsed AI output
│   │   └── useIdea.ts              # CRUD for ideas
│   └── types/
│       ├── idea.ts
│       ├── chat.ts
│       └── dashboard.ts
├── supabase/
│   └── migrations/                 # DB migrations
├── public/
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Database Schema

```sql
-- User profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  api_key_encrypted TEXT,           -- BYOK (future)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ideas
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  stage TEXT DEFAULT 'capture',     -- capture/research/competitors/uvp/canvas/scoring
  score INTEGER,                    -- 0-100
  status TEXT DEFAULT 'active',     -- active/archived
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  role TEXT NOT NULL,                -- user/assistant/system
  content TEXT NOT NULL,
  metadata JSONB,                    -- structured data extracted by parser
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dashboard artifacts (live cards)
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                -- idea_summary/competitors/uvp/lean_canvas/score
  data JSONB NOT NULL,               -- structured content of the card
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

All tables must have RLS enabled. Users can only access their own data:

```sql
-- Example for ideas table
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ideas"
  ON ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ideas"
  ON ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE
  USING (auth.uid() = user_id);
```

---

## API Design

### POST /api/chat

Main AI endpoint with Server-Sent Events streaming.

**Request:**
```typescript
{
  ideaId: string;
  message: string;
  stage: string;       // current pipeline stage
}
```

**Response:** SSE stream with mixed content (text + artifacts).

**Flow:**
1. Load conversation history from DB
2. Build system prompt based on current stage
3. If stage is "research" or "competitors" — attach search tools for Claude
4. Stream response from Bedrock
5. Parser splits stream → text chunks sent to client, artifacts saved to DB
6. Save assistant message to DB

### POST /api/search

Proxy for external search APIs. Called by AI via tool use.

**Request:**
```typescript
{
  query: string;
  source: "serper" | "producthunt";
  type?: "web" | "news";            // for serper only
}
```

**Response:**
```typescript
{
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    source: string;
  }>;
}
```

---

## AI Prompts Strategy

Each stage has a dedicated system prompt that:
1. Defines AI's role and behavior for that stage
2. Specifies what artifact(s) to generate
3. Includes the artifact XML format
4. Adapts language to match user's locale
5. Adjusts depth based on user experience level (detected from conversation)

### Tool Use Configuration

For stages 2 (Market Research) and 3 (Competitor Analysis), Claude receives tool definitions:

```typescript
tools: [
  {
    name: "web_search",
    description: "Search the web for market data, competitors, trends",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        type: { type: "string", enum: ["web", "news"] }
      },
      required: ["query"]
    }
  },
  {
    name: "search_producthunt",
    description: "Search Product Hunt for existing startups and products",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" }
      },
      required: ["query"]
    }
  }
]
```

---

## Artifact Data Schemas

### Idea Summary
```typescript
{
  title: string;
  description: string;
  problem: string;
  targetAudience: string;
  category: string;
}
```

### Competitors
```typescript
{
  competitors: Array<{
    name: string;
    url: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    pricing: string;
    similarity: number;    // 0-100
  }>;
}
```

### Unique Value Proposition
```typescript
{
  statement: string;        // one-line UVP
  differentiators: Array<{
    feature: string;
    description: string;
    competitorComparison: string;
  }>;
}
```

### Lean Canvas
```typescript
{
  problem: string[];
  solution: string[];
  keyMetrics: string[];
  uniqueAdvantage: string;
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
  unfairAdvantage: string;
}
```

### Score
```typescript
{
  total: number;            // 0-100
  criteria: Array<{
    name: string;           // e.g., "Market Size", "Competition", "Feasibility"
    score: number;          // 0-100
    weight: number;         // 0-1
    explanation: string;
  }>;
  verdict: string;          // AI's final assessment
  recommendations: string[];
}
```

---

## Security

### API Key Storage (BYOK — Future)
- User's API key encrypted with AES-256 before storing in `profiles.api_key_encrypted`
- Encryption key stored in environment variable, never in DB
- Key is decrypted only server-side when making AI calls
- Never sent to client after initial save

### General
- All API routes validate Supabase JWT token
- RLS on all tables — users access only their own data
- Environment variables for all secrets (Bedrock credentials, Serper key, encryption key)
- CORS configured for production domain only
- Rate limiting on /api/chat to prevent abuse

---

## i18n Strategy

Using `next-intl` with:
- URL prefix: `/en/...`, `/uk/...`
- Default locale: `en`
- UI text — translated via JSON files
- AI responses — prompted to respond in user's `locale` from profile
- Artifacts — generated in user's language by AI

---

## Milestones & Tasks

### Milestone 1 — Foundation

| # | Task | Description |
|---|------|-------------|
| 1.1 | Init project | Next.js + Tailwind + shadcn/ui + TypeScript setup |
| 1.2 | Setup Supabase | Create project, configure client, env variables |
| 1.3 | Database schema | Create migrations (profiles, ideas, messages, artifacts) + RLS |
| 1.4 | Auth | Supabase Auth — email + Google, middleware for protected routes |
| 1.5 | i18n | Configure next-intl (EN + UA), base translations |
| 1.6 | Base layout | Header, Sidebar with idea history, responsive layout |

### Milestone 2 — Chat Core

| # | Task | Description |
|---|------|-------------|
| 2.1 | AWS Bedrock client | Connect to Claude via Bedrock, streaming setup |
| 2.2 | System prompts | Prompts for each stage (capture/research/competitors/uvp/canvas/scoring) |
| 2.3 | Chat API endpoint | POST /api/chat with SSE streaming |
| 2.4 | Chat UI | ChatWindow, MessageBubble, ChatInput with markdown rendering |
| 2.5 | useChat hook | Streaming logic, message history, DB persistence |
| 2.6 | Stage management | Auto-transition between stages, progress bar |

### Milestone 3 — Live Dashboard

| # | Task | Description |
|---|------|-------------|
| 3.1 | Stream Parser | Parse AI response — split text/artifact in real-time |
| 3.2 | Artifact API | CRUD for artifacts, save to Supabase |
| 3.3 | WorkspaceLayout | Split view — Chat left, Dashboard right, resizable |
| 3.4 | IdeaSummaryCard | Card with idea description, target audience |
| 3.5 | CompetitorCard | Competitors card with comparison table |
| 3.6 | UVPCard | Unique value proposition card |
| 3.7 | LeanCanvasCard | Interactive Lean Canvas |
| 3.8 | ScoreCard | Idea score with radial chart and criteria breakdown |

### Milestone 4 — Market Research

| # | Task | Description |
|---|------|-------------|
| 4.1 | Serper.dev integration | Google Search API client |
| 4.2 | Product Hunt integration | GraphQL client for startup search |
| 4.3 | Search API endpoint | POST /api/search — proxy for both sources |
| 4.4 | AI Tool Use | Claude calls search as tool during market analysis |

### Milestone 5 — Dashboard & History

| # | Task | Description |
|---|------|-------------|
| 5.1 | Dashboard page | List of all user's ideas with filters and scores |
| 5.2 | Idea CRUD | Create, archive, delete ideas |
| 5.3 | Idea comparison | Side-by-side comparison of two ideas by scores |
| 5.4 | Export | Export results to PDF/Markdown |

### Milestone 6 — Polish

| # | Task | Description |
|---|------|-------------|
| 6.1 | Landing page | Attractive landing with product description |
| 6.2 | Dark/Light theme | Theme toggle |
| 6.3 | Responsive design | Mobile adaptation (chat/dashboard as tabs) |
| 6.4 | Onboarding | Tooltips for new users |
| 6.5 | Error handling | Graceful handling of AI, search, auth errors |
| 6.6 | BYOK UI | Settings page for future API key input |

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AWS Bedrock
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# Serper.dev
SERPER_API_KEY=

# Product Hunt
PRODUCTHUNT_API_TOKEN=

# Security
ENCRYPTION_KEY=                  # for BYOK key encryption (future)

# App
NEXT_PUBLIC_APP_URL=
```
