# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for **Austin Spraggins** - Co-Founder, CTO & Senior Software Engineer at **LineCrush Inc**. Built with Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, and Aceternity UI components. Live at [spragginsdesigns.xyz](https://www.spragginsdesigns.xyz/).

**Purpose:** Showcase professional work, experience, and technical expertise. This portfolio represents 2+ years of intensive full-stack development experience at LineCrush, building production systems at scale.

## About Austin

### Professional

- **Current Role:** Co-Founder, CTO & Senior Software Engineer at LineCrush Inc
- **Company:** [LineCrush](https://www.linecrush.com) - Sports analytics platform
- **Experience:** End-to-end ownership across the entire stack:
  - Frontend: Next.js 15, React (353+ components), TypeScript, Tailwind CSS
  - Backend: Python (45+ microservices), Node.js
  - Database: PostgreSQL/Neon (100+ tables), Redis caching
  - AI/ML: OpenAI, Anthropic, Perplexity, Google Vision (4+ LLM integrations)
  - Infrastructure: AWS (S3, SES, CloudFront), Ubuntu VPS, Vercel, Docker
  - Data: Web scrapers, real-time pipelines, NLP, cron jobs
- **Education:** AA in Web Development (5+ years in college, consistently high grades)
- **Teaching:** Former Web Development instructor at Bitwise Industries and Geekwise Academy
- **Status:** Open to contracts & consulting

### Personal

- **Location:** Fresno, California (grew up in the mountains of O'Neals, CA)
- **Family:** Proud father of two children - Julian and Lilly
- **Faith:** Christian - faith is central to his life and work
- **Background:** Lost his father at age 8; later cared for his mother when she became blind. Former truck driver before transitioning to tech. Went through a transformative life experience that profoundly changed his perspective, helping him find faith, inner peace, and renewed purpose.

### Values & Approach

- **Mission:** To serve God, be a good father and provider, and build technology that makes the world more intelligent, loving, and just
- **Problem-Solving Style:** Thinks through problems deeply, plans carefully, and takes things step by step - testing and adjusting along the way. Prefers to understand every part of a plan before attempting it.
- **Core Beliefs:**
  - Technology should extend human gifts, not replace them
  - Kindness, respect, and honesty in all interactions
  - Building meaningful tools that honor God

### Personal Projects

- **Bible AI Explorer:** An app to help users understand the Bible better with AI assistance (the AI is instructed to act as a believer in Christ)

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
│   ├── games/page.tsx  # LineCrush Games studio page (Gunmetal Orbit + VideoGame JSON-LD)
│   ├── blog/           # Blog index + [slug] MDX post pages
│   ├── feed.xml/       # RSS feed route
│   ├── globals.css     # Global styles + CSS variables + reduced-motion
│   ├── sitemap.ts      # Auto-generated sitemap.xml (incl. /games + blog posts)
│   └── robots.ts       # Auto-generated robots.txt
├── components/
│   ├── ui/             # shadcn/ui + Aceternity UI components (background-lines, count-up, timeline, card, badge, button, ...)
│   ├── games/GamesShowcase.tsx # /games page sections
│   ├── Hero.tsx        # Full-screen hero with BackgroundLines + stat row
│   ├── GameSpotlight.tsx # Homepage Gunmetal Orbit spotlight card
│   ├── InteractiveTerminal.tsx # Fake shell w/ agent-run demo, streaming ask-ai, mobile-aware ASCII
│   ├── AISystems.tsx   # Agentic AI showcase
│   ├── Projects.tsx    # Featured projects showcase
│   ├── Expertise.tsx   # Bento grid skills + stats + WakaTime
│   ├── About.tsx       # Timeline-based journey section
│   ├── BlogPreview.tsx # Latest 3 posts on homepage
│   ├── GitHubShowcase.tsx # Live GitHub stats
│   ├── Contact.tsx     # Contact form
│   ├── Header.tsx      # Navigation header + CommandPalette
│   ├── Footer.tsx      # Site footer (uses /#hash links, safe off-homepage)
│   └── MotionProvider.tsx # framer-motion reduced-motion config
├── content/blog/       # MDX posts (YYYY-MM-DD-slug.mdx)
├── lib/
│   ├── stats.ts        # SINGLE SOURCE OF TRUTH for all LineCrush/game stats
│   ├── format-date.ts  # UTC-safe date formatting (client-safe)
│   ├── blog.ts         # Blog post loading (server-only, imports fs)
│   └── utils.ts        # cn() utility for Tailwind merging
└── pages/api/          # API routes (Pages Router)
    ├── ask-ai.ts       # Streaming AI Q&A for the terminal
    ├── send-email.ts   # Contact form handler
    └── youtube-stats.ts # YouTube API integration
```

### Routing Pattern

This project uses a **hybrid routing approach**:
- **App Router** (`src/app/`) for pages, layouts, and SEO files
- **Pages Router** (`src/pages/api/`) for API routes

### Key Sections

The main page (`src/app/page.tsx`) renders sections in order:
1. **Header** - Fixed nav + command palette (⌘K)
2. **Hero** - Full-screen intro with BackgroundLines, profile image, role badges, CountUp stat row
3. **GameSpotlight** - Gunmetal Orbit card with Steam wishlist CTA, funnels to /games
4. **InteractiveTerminal** - Fake shell with `agent run` demo and streaming `ask` AI
5. **AISystems** - Agentic engineering showcase (delivery loop + 4 system cards)
6. **Projects** - LineCrush flagship + Gunmetal Orbit/games card + featured + additional projects
7. **Expertise** - Stats row + 6 expertise cards + WakaTime + tech stack
8. **About** - Timeline journey from truck driver to CTO
9. **BlogPreview** - Latest 3 posts
10. **GitHubShowcase** - Live GitHub profile/repos/contribution graph
11. **Contact** - Email contact form
12. **Footer** - Site links and copyright

There is also a dedicated `/games` route (LineCrush Games studio + Gunmetal Orbit flagship) and the `/blog` routes.

### UI Components

**From shadcn/ui:**
- Card, Badge, Button

**From Aceternity UI (customized):**
- BackgroundLines - Animated SVG paths with cyan color scheme
- TextGenerateEffect - Blur-in word-by-word text animation
- Timeline - Scroll-progress animated timeline

### API Routes

- `/api/send-email` - Contact form submission using Nodemailer (Gmail SMTP)
- `/api/youtube-stats` - Fetches YouTube channel statistics

### Environment Variables

Required in `.env.local`:
```
GMAIL_APP_PASSWORD=     # Gmail app password for contact form
YOUTUBE_API_KEY=        # YouTube Data API key
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
- Emphasize "Open to Contracts & Consulting" (not job seeking)
- **Stats single source of truth: `src/lib/stats.ts`** (verified 2026-08-08). Canonical set: 30,128 monorepo commits (30,000+ in prose; 12,873 in 2026), 366 API handlers, 64 agent skills, ~1,000 TSX modules, 4 product clients, 120+ database tables, 5 LLM providers, 12 sports, 2+ years production. Fleet ledger since June 23, 2026: 4,426 Linear issues worked, 95% completed, ~90/day, 2,730 jobs shipped commits. Update stats.ts first; llms.txt, README.md, CLAUDE.md, and AGENTS.md must be kept in sync manually.
- **Gunmetal Orbit** is the flagship game: space-mining arena roguelite, Steam release August 21, 2026 at $4.99, wishlist URL https://store.steampowered.com/app/4975430, studio site games.linecrush.com
- Featured GitHub projects: SaveALife CPR, Constrong, Bible AI Explorer, AI Tutor WebApp
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
