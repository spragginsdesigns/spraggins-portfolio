# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for **Austin Spraggins** - Co-Founder, CTO & Senior Software Engineer at **LineCrush Inc**. Built with Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, and Aceternity UI components. Live at [spragginsdesigns.xyz](https://www.spragginsdesigns.xyz/).

**Purpose:** Showcase professional work, experience, and technical expertise. This portfolio represents 2+ years of intensive full-stack development experience at LineCrush, building production systems at scale.

## About Austin

### Professional

- **Current Role:** Co-Founder & CTO at LineCrush Inc. Jay Raynor is his co-founder; never write "sole technical founder"
- **Company:** [LineCrush](https://www.linecrush.com) - Sports research platform
- **Experience:** The current record is the public resume at `public/resume/Austin_Spraggins_Resume_2026.pdf`. In short:
  - Web: Next.js 15, React, TypeScript, Tailwind CSS
  - Backend: Python data services running about 700 scheduled jobs, Node.js
  - Database: Neon Postgres (477 tables), Redis
  - Native: SwiftUI iOS app and Kotlin/Compose Android app, both in the stores
  - AI: the Claude Code and Codex agent fleet and C2, the tracker that replaced Linear
  - Own products: SureWord (web, Google Play, App Store) and Gunmetal Orbit (Steam)
- **Education:** A.S., Information Systems: Web Design, Clovis Community College (2021). He has no bachelor's degree; never state or imply one
- **Teaching:** Former Web Development Instructor at Bitwise Industries / Geekwise Academy (January 2022 - July 2023)
- **Status:** Looking for his next full-time, hands-on engineering job (see the 2026-11-19 blog post)

### Personal

- **Location:** Fresno, California (grew up in the mountains of O'Neals, CA)
- **Family:** Proud father of two children - Julian and Lilly
- **Faith:** Born-again Christian, saved by grace through faith in Jesus Christ. Public testimony page at /faith (old /#faith links redirect there); faith is central to his life and work.
- **Background:** Lost his father at age 8; later cared for his mother when she became blind. Former truck driver before transitioning to tech. Went through a transformative life experience that profoundly changed his perspective, helping him find faith, inner peace, and renewed purpose.

### Values & Approach

- **Mission:** To serve God, be a good father and provider, and build technology that makes the world more intelligent, loving, and just
- **Problem-Solving Style:** Thinks through problems deeply, plans carefully, and takes things step by step - testing and adjusting along the way. Prefers to understand every part of a plan before attempting it.
- **Core Beliefs:**
  - Technology should extend human gifts, not replace them
  - Kindness, respect, and honesty in all interactions
  - Building meaningful tools that honor God

### Personal Projects

- **SureWord** (formerly Bible AI Explorer): Austin's biggest personal project - an AI Bible study companion at [sureword.app](https://sureword.app) on the web, Google Play (Android via Expo) and the App Store (iPhone, iPad and Mac) sharing one Next.js + AI SDK backend. Vector RAG over the KJV, offline Bible reader, notes, and a memory system. The AI is instructed to act as a believer in Christ. Has its own flagship spotlight card in the Projects section.

## Social Links

- **GitHub:** [github.com/spragginsdesigns](https://github.com/spragginsdesigns)
- **LinkedIn:** [linkedin.com/in/spragginsdesigns](https://www.linkedin.com/in/spragginsdesigns/)
- **Twitter:** [@spragginsdesign](https://twitter.com/spragginsdesign)

## Commands

```bash
pnpm dev      # Start development server (runs on localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata/SEO + MotionProvider
│   ├── page.tsx        # Main page composing all sections
│   ├── work/[slug]/page.tsx # Engineering case studies with timelines and release evidence
│   ├── games/page.tsx  # LineCrush Games studio page (Gunmetal Orbit + VideoGame JSON-LD)
│   ├── faith/page.tsx  # Austin's testimony (Faith.tsx); the landing page for SureWord's creator link
│   ├── local-websites/page.tsx # Spraggins Designs offer page for Fresno businesses (ProfessionalService + FAQPage JSON-LD)
│   ├── blog/           # Blog index + [slug] MDX post pages
│   ├── feed.xml/       # RSS feed route
│   ├── globals.css     # Global styles + CSS variables + reduced-motion
│   ├── sitemap.ts      # Auto-generated sitemap.xml (incl. /games + blog posts)
│   └── robots.ts       # Auto-generated robots.txt
├── components/
│   ├── ui/             # shadcn/ui + Aceternity UI components (background-lines, count-up, timeline, card, badge, button, ...)
│   ├── games/GamesShowcase.tsx # /games page sections
│   ├── local-websites/ # CredibilityStrip, CallTextButtons, IntakeForm, LocalWebsitesShowcase (/local-websites body)
│   ├── Hero.tsx        # Product engineering introduction, real product screenshots, and sourced metrics
│   ├── InteractiveTerminal.tsx # "Ask about my work" agent console (tool-call rows, streamed Markdown) + the collapsible fake shell
│   ├── ask/            # AnswerMarkdown (safe Markdown renderer), usePortfolioWebMcp (WebMCP tool registration)
│   ├── SelectedWork.tsx # LineCrush, SureWord, C2, Gunmetal Orbit, client work, and open source
│   ├── Expertise.tsx   # Bento grid skills + stats + WakaTime
│   ├── WorkLedger.tsx  # Homepage "Daily Work Log" section (measured hours, heatmap, buckets)
│   ├── work-ledger/    # WorkLedger sub-components
│   ├── About.tsx       # Timeline-based journey section
│   ├── BlogPreview.tsx # Latest 3 posts on homepage
│   ├── GitHubShowcase.tsx # Live GitHub stats
│   ├── Contact.tsx     # Contact form
│   ├── Header.tsx      # Navigation header + CommandPalette
│   ├── Footer.tsx      # Site footer (uses /#hash links, safe off-homepage)
│   └── MotionProvider.tsx # framer-motion reduced-motion config
├── content/blog/       # MDX posts (YYYY-MM-DD-slug.mdx)
├── data/work-ledger.json # Bundled snapshot of the work ledger (generated, never hand-edit)
├── data/engineering-record.json # Curated, dated stories, decisions, lessons, timeline, skills and facts for the portfolio agent (screening rules in docs/ask-agent.md)
├── lib/
│   ├── ask/            # Portfolio agent: agent.ts (model + tool loop), tools.ts (read-only tools), prompt.ts (system prompt), rate-limit.ts
│   ├── portfolio-answers.ts # Curated public facts: the agent's search corpus and its no-model fallback
│   ├── work-ledger.ts  # Work ledger types, type guard, summary helpers
│   ├── stats.ts        # SINGLE SOURCE OF TRUTH for all LineCrush/game stats
│   ├── local-websites.ts # SINGLE SOURCE OF TRUTH for the Spraggins Designs offer (price, phone, copy, FAQ, GBP link)
│   ├── format-date.ts  # UTC-safe date formatting (client-safe)
│   ├── blog.ts         # Blog post loading (server-only, imports fs)
│   └── utils.ts        # cn() utility for Tailwind merging
└── pages/api/          # API routes (Pages Router)
    ├── ask-ai.ts       # Portfolio agent endpoint (gpt-6.2-sol + tool calls, NDJSON stream)
    ├── portfolio-tools.ts # Public read-only tool endpoint behind the page's WebMCP tools
    ├── send-email.ts   # Contact form handler (also the local-websites intake; accepts phone in place of email)
    └── youtube-stats.ts # YouTube API integration
docs/
├── ask-agent.md        # Portfolio agent: tools, safety rules, system prompt, WebMCP, limits, how to verify
├── google-business-profile.md # Spraggins Designs GBP: fields, rules, how to edit, current restrictions
└── work-ledger.md      # Daily Work Log: what is measured, privacy rules, how the hourly collector runs
scripts/
└── work-ledger/collect.py # Collector run hourly on the PC (pulls the MacBook over SSH), publishes daily totals
```

### Routing Pattern

This project uses a **hybrid routing approach**:
- **App Router** (`src/app/`) for pages, layouts, and SEO files
- **Pages Router** (`src/pages/api/`) for API routes

### Key Sections

The homepage leads with the engineering introduction, selected work, and Austin's journey. Expertise, Daily Work Log, writing, the interactive terminal, GitHub, and contact follow. Case studies live at `/work/linecrush`, `/work/sureword`, `/work/game-development`, and `/work/independent`. The LineCrush case study includes a linkable C2 section at `#c2`. Games, the résumé, and the Fresno website offer have dedicated routes. Austin's testimony lives on its own page, `/faith`, and stays off the homepage (Austin, 2026-11-18): it is there for people who follow SureWord's "Created by Austin Spraggins" link, and it has nothing to do with hiring. The shipped SureWord apps link to `/#faith`, so `FaithHashRedirect` on the homepage must keep forwarding that hash.

### UI Components

**From shadcn/ui:**
- Card, Badge, Button

**From Aceternity UI (customized):**
- BackgroundLines - Animated SVG paths with cyan color scheme
- TextGenerateEffect - Blur-in word-by-word text animation
- Timeline - Scroll-progress animated timeline

### API Routes

- `/api/ask-ai` - Portfolio agent: OpenAI Responses API (`gpt-6.2-sol`, medium reasoning) with read-only tools over the portfolio, the live work ledger, public GitHub and Steam. Read `docs/ask-agent.md` before changing it; its privacy rules mirror the Content and Blog Post Guidelines below.
- `/api/portfolio-tools` - The same tools over plain HTTP for WebMCP browser agents (no model runs)
- `/api/send-email` - Contact form submission using Nodemailer (Gmail SMTP)
- `/api/youtube-stats` - Fetches YouTube channel statistics

### Environment Variables

Required in `.env.local`:
```
GMAIL_APP_PASSWORD=     # Gmail app password for contact form
YOUTUBE_API_KEY=        # YouTube Data API key
OPENAI_API_KEY=         # Portfolio agent (needs gpt-6.2-sol access); without it answers fall back to curated facts
GITHUB_TOKEN=           # Optional, raises the GitHub rate limit for the agent's public-repo tools
```

### Styling

- **Tailwind CSS** with CSS variables for theming
- **Dark cyberpunk theme** - Primary cyan (#5ce1e6), dark background
- **Fonts:** Inter (body), Poppins (headings) via next/font/google
- **Path alias:** `@/*` maps to `./src/*`

### SEO

- **Title:** "Austin Spraggins | Co-Founder & CTO | Senior Software Engineer"
- **Sitemap:** Auto-generated at `/sitemap.xml`
- **Robots:** Auto-generated at `/robots.txt`
- **Open Graph & Twitter cards** configured for social sharing

## Content Guidelines

When updating portfolio content:
- **LineCrush** is the flagship project - emphasize scale and the autonomous agent fleet
- Highlight CTO leadership and architectural decision-making
- Status is "Open to full-time roles, contracts & consulting" (Austin, 2026-11-18: the job search no longer needs hiding; Jay supports it). Pay, equity, employers applied to and reasons for leaving stay private.
- **LineCrush native apps wording:** Austin started both apps from scratch and wrote their first month himself; since then the fleet he designed has written most of their feature code, and he owns releases and store review. Never "personally built" or "built myself" for the LineCrush apps. SureWord's apps are his own build.
- **Stats single source of truth: `src/lib/stats.ts`** (fleet ledger on 2026-11-17: 14,111 completed fleet jobs, 91% of admitted, ~124 admissions a day over the trailing 30 days, 10,745 completed jobs with a recorded commit link; repository counts measured 2026-11-18 on the monorepo's main branch). Canonical set: 43,649 monorepo commits (43,000+ in prose; 26,369 in 2026), 725 API handlers, 70 agent skills, ~2,300 TSX modules, 4 product clients, 450+ database tables (tables created by migrations, a floor), 5 LLM providers, 14+ sports, 2+ years production. These are platform numbers that include Jay's and the fleet's work, never Austin's personal output. Older published figures (August 8, 2026 blog post): Fleet ledger since June 23, 2026: 4,426 Linear issues worked, 95% completed, ~90/day, 2,730 jobs shipped commits. Update stats.ts first; llms.txt, README.md, CLAUDE.md, and AGENTS.md must be kept in sync manually.
- **Gunmetal Orbit** is the flagship game: space-mining arena roguelite, Steam release September 10, 2026 at $4.99, store URL https://store.steampowered.com/app/4975430, studio site games.linecrush.com
- **SureWord** is the personal flagship (spotlight card alongside LineCrush and Gunmetal Orbit): sureword.app, Android on Google Play (com.spragginsdesigns.sureword), Apple apps on the App Store (id6820260211); the GitHub repo is private, so never link it (spragginsdesigns/bible-ai-explorer)
- **Spraggins Designs local-business offer** ($299 build + $19/mo hosting, live in a day, call or text 559-818-0467): single source of truth is `src/lib/local-websites.ts`, rendered on the homepage section and `/local-websites`. The matching Google Business Profile is documented in `docs/google-business-profile.md`. Read that file before touching the profile: posting is currently disabled after a policy strike, and the rules there (no phone numbers or prices in posts, no category churn, one edit at a time) are not optional.
- Featured GitHub projects: SaveALife CPR, Constrong, AI Tutor WebApp
- **CLAUDE.md and AGENTS.md are twins** - they must be edited in lockstep (they differ only in their title/intro lines)
- **IMPORTANT:** When referencing Austin's transformative life experience, describe it as a "difficult period" or "challenging time" that led to personal growth, finding faith, and renewed purpose. Never be more specific than this.

## Blog Post Guidelines (CRITICAL)

**LineCrush Competitive Moat Protection: "Show results, hide methods. Be a black box."**

Updated policy (Austin, 2026-08-08): **naming commodity tools is fine; system internals are not.**

OK to name: Claude, Codex, Linear, Neon, Godot, AWS, Vercel, and similar table-stakes tooling. The moat is operational, not the tool list.

When writing blog posts about LineCrush work, NEVER reveal:
- **Guardrail specifics** (spend gates, env guards, migration guards, DB role design)
- **Routing logic** (how work is routed between models/lanes, queue label conventions)
- **Prompt/skill internals** (skill contents, prompt systems, agent instructions)
- **Data sources** (don't mention which sportsbooks, APIs, or providers we use)
- **Algorithms or methodology** (the "how" behind betting recommendations)

**What TO write about:**
- High-level learnings and insights (meta-lessons about building AI products)
- Verified fleet/throughput numbers (from src/lib/stats.ts)
- The closed-loop delivery story at pattern level (investigate → fix → prove → review → deploy → verify → close)
- Personal journey, struggles, and growth
- Leadership lessons and startup life observations
- Game development (LineCrush Games is showcase, not moat - the Godot/Steam posts can be technically explicit)

**Before publishing any LineCrush-related content, ask:**
1. Does this reveal how we generate our edge?
2. Does this expose our data sources unnecessarily?
3. Can a competitor reverse-engineer our methodology from this?

If yes to any → rewrite to remove the exposure.

**Goal:** Build Austin's personal brand while protecting LineCrush's competitive advantage.

## Dependencies

Key packages:
- `next` 14.2.5 - React framework
- `react` 18 - UI library
- `motion` - Framer Motion animations
- `tailwindcss` - Utility CSS
- `lucide-react` - Icons
- `class-variance-authority` - Component variants (shadcn)
- `clsx` + `tailwind-merge` - Class utilities
